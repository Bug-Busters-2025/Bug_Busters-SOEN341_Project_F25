const { Router } = require("express");
const { requireAuth, getAuth } = require("@clerk/express");
const eventsRouter = Router();
const db = require("../db.js");
const { format } = require("@fast-csv/format");
const QRCode = require("qrcode");

/* ---- helpers ---- */

// cache once: does `events.status` exist?
const hasStatusColumnOnce = (() => {
  let cached = null;
  return (db) =>
    new Promise((resolve) => {
      if (cached !== null) return resolve(cached);
      db.query("SHOW COLUMNS FROM events LIKE 'status'", (err, rows) => {
        cached = !err && Array.isArray(rows) && rows.length > 0;
        resolve(cached);
      });
    });
})();

// admin gate
function assertAdmin(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  db.query("SELECT role FROM users WHERE clerk_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (rows.length === 0) return res.status(401).json({ message: "Unauthorized" });
    if (rows[0].role !== "admin") return res.status(403).json({ message: "Forbidden" });
    next();
  });
}

/* ---- routes ---- */

// PUBLIC: list published events (or all, if status column is missing)
eventsRouter.get("/", async (_req, res) => {
  try {
    const hasStatus = await hasStatusColumnOnce(db);
    const whereClause = hasStatus
      ? "WHERE events.status IS NULL OR LOWER(events.status) = 'published'"
      : "";
    const sql = `
      SELECT 
        events.id,
        events.organizer_id,
        events.title,
        events.description,
        events.category,
        COALESCE(events.imageUrl, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80') AS imageUrl,
        events.event_date,
        events.location,
        events.ticket_capacity,
        events.remaining_tickets,
        events.ticket_type,
        ${hasStatus ? "events.status" : "NULL AS status"},
        users.name AS organizer_name,
        users.email AS organizer_email
      FROM events
      JOIN users ON events.organizer_id = users.id
      ${whereClause}
      ORDER BY events.event_date ASC
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send("Database error");
      res.status(200).json(results);
    });
  } catch {
    res.status(500).send("Server error");
  }
});

// Organizer: notifications (events archived by admin)
eventsRouter.get("/notifications", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  // find organizer DB id (and ensure they are an organizer)
  db.query(
    "SELECT id, role FROM users WHERE clerk_id = ?",
    [userId],
    async (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (rows.length === 0) return res.status(403).json({ message: "User not found in DB" });

      const organizerId = rows[0].id;
      // If your schema doesn’t have `status`, avoid breaking
      const hasStatus = await hasStatusColumnOnce(db);
      if (!hasStatus) return res.status(200).json([]);

      const sql = `
        SELECT 
          e.id,
          e.title,
          e.event_date,
          e.location,
          e.category,
          e.status,
          e.updated_at,
          u.name  AS organizer_name,
          u.email AS organizer_email
        FROM events e
        JOIN users u ON e.organizer_id = u.id
        WHERE e.organizer_id = ? AND LOWER(e.status) = 'archived'
        ORDER BY COALESCE(e.updated_at, e.event_date) DESC
      `;
      db.query(sql, [organizerId], (err2, rows2) => {
        if (err2) return res.status(500).json({ message: "Database error" });
        return res.status(200).json(rows2);
      });
    }
  );
});

// get events by organizer
eventsRouter.get("/organizer/:organizer_id", (req, res) => {
  const { organizer_id } = req.params;
  if (!organizer_id) {
    res.status(400).send("Organizer ID is required");
    return;
  }

  const sql = `SELECT events.*, users.name AS organizer_name, users.email AS organizer_email
   FROM events
   JOIN users ON events.organizer_id = users.id
   WHERE events.organizer_id = ?
   ORDER BY event_date ASC`;

  db.query(sql, [organizer_id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("No events found for this organizer");
      return;
    }
    res.status(200).json(results);
  });
});

// Admin: list all events
eventsRouter.get("/admin/all", requireAuth(), assertAdmin, (_req, res) => {
  const sql = `
    SELECT 
      events.*,
      users.name  AS organizer_name,
      users.email AS organizer_email
    FROM events
    JOIN users ON events.organizer_id = users.id
    ORDER BY events.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

// Admin: update status
eventsRouter.patch("/:event_id/status", requireAuth(), assertAdmin, async (req, res) => {
  const { event_id } = req.params;
  let { status } = req.body;

  if (!event_id || !status) {
    return res.status(400).json({ message: "Event ID and status are required" });
  }

  const s = String(status).toLowerCase();

  try {
    const hasStatus = await hasStatusColumnOnce(db);

    if (!hasStatus) {
      if (s === "deleted" || s === "archived") {
        db.query("DELETE FROM events WHERE id = ?", [event_id], (err, r) => {
          if (err) return res.status(500).json({ message: "Database error" });
          if (r.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
          return res.status(200).json({ ok: true, message: "Event deleted" });
        });
        return;
      }
      return res.status(400).json({ message: "Status column not present; cannot set status" });
    }

    if (s === "deleted") status = "archived";
    else if (s === "published") status = "published";
    else if (s === "archived") status = "archived";
    else return res.status(400).json({ message: "Invalid status value" });

    db.query("UPDATE events SET status = ? WHERE id = ?", [status, event_id], (err, r) => {
      if (err) {
        if (err.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD" || err.code === "WARN_DATA_TRUNCATED") {
          return res.status(400).json({ message: "Invalid status for current ENUM", detail: err.sqlMessage });
        }
        if (err.code === "ER_BAD_FIELD_ERROR") {
          return res.status(400).json({ message: "Status column missing" });
        }
        return res.status(500).json({ message: "Database error" });
      }
      if (r.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
      res.status(200).json({ ok: true, message: "Event status updated successfully" });
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// create event (requires Clerk auth)
eventsRouter.post("/create", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);

  const {
    title,
    description,
    category,
    imageUrl,
    event_date,
    location,
    ticket_capacity,
    remaining_tickets = ticket_capacity,
    ticket_type,
  } = req.body;

  if (
    !title ||
    !description ||
    !category ||
    !imageUrl ||
    !event_date ||
    !location ||
    !ticket_capacity ||
    !ticket_type
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const findUserSQL = "SELECT id FROM users WHERE clerk_id = ?";
  db.query(findUserSQL, [userId], async (err, rows) => {
    if (err) {
      console.error("❌ Database lookup error:", err);
      return res.status(500).json({ message: "Database lookup error", error: err });
    }

    if (rows.length === 0) {
      console.warn("⚠️ No user found for Clerk ID:", userId);
      return res.status(404).json({ message: "No user found for this Clerk ID" });
    }

    const organizer_id = rows[0].id;
    const formattedDate = event_date.replace("T", " ");
    const lowerTicketType = String(ticket_type).toLowerCase();

    try {
      const hasStatus = await hasStatusColumnOnce(db);
      const insertSQL = hasStatus
        ? `
          INSERT INTO events 
          (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')
        `
        : `
          INSERT INTO events 
          (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      const params = [
        organizer_id,
        title,
        description,
        category,
        imageUrl,
        formattedDate,
        location,
        ticket_capacity,
        remaining_tickets,
        lowerTicketType,
      ];

      db.query(insertSQL, params, (err2, results) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: "Database error", error: err2.sqlMessage });
        }
        res.status(201).json({
          message: "✅ Event created successfully",
          results,
        });
      });
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  });
});

// update event
eventsRouter.put("/:event_id", (req, res) => {
  const { event_id } = req.params;
  const {
    title,
    description,
    category,
    imageUrl,
    event_date,
    location,
    ticket_capacity,
    remaining_tickets,
    ticket_type,
  } = req.body;

  if (
    !event_id ||
    !title ||
    !description ||
    !category ||
    !imageUrl ||
    !event_date ||
    !location ||
    !ticket_capacity ||
    !remaining_tickets ||
    !ticket_type
  )
    return res.status(400).send("All fields are required");

  const sql = `
        UPDATE events 
        SET title=?, description=?, category=?, imageUrl=?, event_date=?, location=?, 
            ticket_capacity=?, remaining_tickets=?, ticket_type=? 
        WHERE id=?
    `;

  db.query(
    sql,
    [
      title,
      description,
      category,
      imageUrl,
      event_date,
      location,
      ticket_capacity,
      remaining_tickets,
      ticket_type,
      event_id,
    ],
    (err, results) => {
      if (err) return res.status(500).send("Database error");
      res.status(200).json(results);
    }
  );
});

// delete event (hard delete by id)
eventsRouter.delete("/:event_id", (req, res) => {
  const { event_id } = req.params;
  if (!event_id) return res.status(400).send("Event ID is required");

  db.query(`DELETE FROM events WHERE id = ?`, [event_id], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

// saved events (by user)
eventsRouter.get("/:user_id", (req, res) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).send("User ID is required");

  const sql = `
        SELECT events.*, users.name AS organizer_name, users.email AS organizer_email
        FROM userSavedEvents 
        JOIN events ON userSavedEvents.event_id = events.id
        JOIN users ON events.organizer_id = users.id
        WHERE user_id = ?
    `;
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

// save event to user saved events
eventsRouter.post("/save", (req, res) => {
  const { user_id, event_id } = req.body;
  if (!user_id || !event_id)
    return res.status(400).send("User ID and event ID are required");

  db.query(
    `INSERT INTO userSavedEvents (user_id, event_id) VALUES (?, ?)`,
    [user_id, event_id],
    (err, results) => {
      if (err) return res.status(500).send("Database error");
      res.status(200).json(results);
    }
  );
});

// delete event from user saved events
eventsRouter.post("/unsave", (req, res) => {
  const { user_id, event_id } = req.body;
  if (!user_id || !event_id)
    return res.status(400).send("User ID and event ID are required");

  db.query(
    `DELETE FROM userSavedEvents WHERE user_id = ? AND event_id = ?`,
    [user_id, event_id],
    (err, results) => {
      if (err) return res.status(500).send("Database error");
      res.status(200).json(results);
    }
  );
});

// register student for an event
eventsRouter.post("/register", async (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ message: "User ID and Event ID are required" });
  }

  db.query(
    `SELECT * FROM tickets WHERE user_id = ? AND event_id = ?`,
    [user_id, event_id],
    (err, existing) => {
      if (err) {
        console.error("Database error checking registration:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (existing.length > 0) {
        return res.status(400).json({ message: "Already registered for this event" });
      }

      db.query(
        `SELECT remaining_tickets FROM events WHERE id = ?`,
        [event_id],
        (err, eventData) => {
          if (err) {
            console.error("Database error checking tickets:", err);
            return res.status(500).json({ message: "Database error" });
          }

          if (eventData.length === 0) {
            return res.status(404).json({ message: "Event not found" });
          }

          const remainingTickets = eventData[0].remaining_tickets;
          const status = remainingTickets > 0 ? "claimed" : "waitlisted";

          db.query(
            `INSERT INTO tickets (user_id, event_id, status) VALUES (?, ?, ?)`,
            [user_id, event_id, status],
            async (err, results) => {
              if (err) {
                console.error("Database error creating ticket:", err);
                return res.status(500).json({ message: "Database error" });
              }

              if (status === "claimed") {
                const ticketId = results.insertId;

                try {
                  const payload = `ticket:${ticketId}-user:${user_id}-event:${event_id}`;
                  const qrDataUrl = await QRCode.toDataURL(payload);

                  db.query(
                    `UPDATE tickets SET qr_code = ?, qr_payload= ? WHERE id = ?`,
                    [qrDataUrl, payload, ticketId],
                    (err2) => {
                      if (err2) {
                        console.error("Error saving QR code:", err2);
                        return res.status(500).json({ message: "Error saving QR" });
                      }

                      db.query(
                        `UPDATE events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?`,
                        [event_id],
                        (err3) => {
                          if (err3) {
                            console.error("Database error updating tickets:", err3);
                            return res.status(500).json({ message: "Database error" });
                          }

                          res.status(200).json({
                            message: "Successfully registered for event",
                            status: status,
                            qr_code: qrDataUrl,
                            ticket_id: ticketId,
                          });
                        }
                      );
                    }
                  );
                } catch (qrErr) {
                  console.error("QR generation error:", qrErr);
                  return res.status(500).json({ message: "QR generation failed" });
                }
              } else {
                // waitlisted
                res.status(200).json({
                  message: "Added to waitlist",
                  status: status,
                });
              }
            }
          );
        }
      );
    }
  );
});

// unregister student from an event
eventsRouter.post("/unregister", (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ message: "User ID and Event ID are required" });
  }

  db.query(
    `SELECT status FROM tickets WHERE user_id = ? AND event_id = ?`,
    [user_id, event_id],
    (err, ticketData) => {
      if (err) {
        console.error("Database error checking ticket:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (ticketData.length === 0) {
        return res.status(404).json({ message: "Not registered for this event" });
      }

      const status = ticketData[0].status;

      db.query(
        `DELETE FROM tickets WHERE user_id = ? AND event_id = ?`,
        [user_id, event_id],
        (err, results) => {
          if (err) {
            console.error("Database error deleting ticket:", err);
            return res.status(500).json({ message: "Database error" });
          }

          if (status === "claimed") {
            db.query(
              `UPDATE events SET remaining_tickets = remaining_tickets + 1 WHERE id = ?`,
              [event_id],
              (err) => {
                if (err) {
                  console.error("Database error updating tickets:", err);
                  return res.status(500).json({ message: "Database error" });
                }

                res.status(200).json({
                  message: "Successfully unregistered from event",
                });
              }
            );
          } else {
            res.status(200).json({
              message: "Successfully removed from waitlist",
            });
          }
        }
      );
    }
  );
});

// registered events by user
eventsRouter.get("/registered/:user_id", (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const sql = `
      SELECT 
         events.*, 
         users.name AS organizer_name, 
         users.email AS organizer_email,
         tickets.status AS registration_status,
         tickets.checked_in
      FROM tickets 
      JOIN events ON tickets.event_id = events.id
      JOIN users ON events.organizer_id = users.id
      WHERE tickets.user_id = ?
      ORDER BY events.event_date ASC
   `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Database error getting registered events:", err);
    }
    res.status(200).json(results);
  });
});

// export attendees CSV
eventsRouter.get("/:id/export", requireAuth(), (req, res) => {
  const { id: eventId } = req.params;
  const { userId } = getAuth(req);

  db.query(
    "SELECT id FROM users WHERE clerk_id = ?",
    [userId],
    (err1, userRows) => {
      if (err1) {
        console.error("DB error 1 (users):", err1);
        return res.status(500).json({ message: "Database error" });
      }
      if (userRows.length === 0)
        return res.status(403).json({ message: "User not found in database" });

      const organizerId = userRows[0].id;

      db.query(
        "SELECT organizer_id FROM events WHERE id = ?",
        [eventId],
        (err2, eventRows) => {
          if (err2) {
            console.error("DB error 2 (events):", err2);
            return res.status(500).json({ message: "Database error" });
          }
          if (eventRows.length === 0)
            return res.status(404).json({ message: "Event not found" });
          if (eventRows[0].organizer_id !== organizerId)
            return res
              .status(403)
              .json({ message: "Not authorized to export this event" });

          const attendeeSQL = `
          SELECT 
            u.name       AS student_name,
            u.email      AS email,
            t.status     AS ticket_status,
            t.checked_in AS checked_in
          FROM tickets t
          JOIN users u ON t.user_id = u.id
          WHERE t.event_id = ?`;

          db.query(attendeeSQL, [eventId], (err3, rows) => {
            if (err3) {
              console.error("DB error 3 (tickets):", err3);
              return res.status(500).json({ message: "Database error" });
            }

            res.setHeader(
              "Content-Disposition",
              `attachment; filename=attendees_event_${eventId}.csv`
            );
            res.setHeader("Content-Type", "text/csv");

            const csvStream = format({ headers: true });
            csvStream.pipe(res);
            rows.forEach((row) => csvStream.write(row));
            csvStream.end();
          });
        }
      );
    }
  );
});

// check-in by QR
eventsRouter.post("/check-in", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  const { payload, event_id } = req.body;

  if (!payload || !event_id) {
    return res.status(400).json({ message: "Payload/event ID missing" });
  }

  const getOrganizerSQL =
    "SELECT id FROM users WHERE clerk_id = ? AND role = 'organizer'";

  db.query(getOrganizerSQL, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (rows.length === 0) {
      return res
        .status(403)
        .json({ message: "User not authorized as organizer" });
    }
    const organizerId = rows[0].id;

    const checkEventSQL =
      "SELECT organizer_id FROM events WHERE id = ? and organizer_id = ?";

    db.query(checkEventSQL, [event_id, organizerId], (err2, eventRows) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: "Database error" });
      }
      if (eventRows.length === 0) {
        return res.status(403).json({
          message:
            "You do not have permission to check in tickets for this event.",
        });
      }

      db.query(
        "SELECT id, event_id, checked_in FROM tickets WHERE qr_payload = ?",
        [payload],
        (err3, rows2) => {
          if (err3) {
            console.error(err3);
            return res.status(500).json({ message: "Database error" });
          }

          if (rows2.length === 0) {
            return res.status(404).json({
              message: "Ticket not found",
              status: "invalid",
            });
          }
          const tk = rows2[0];

          if (tk.event_id !== parseInt(event_id, 10)) {
            return res.status(403).json({
              message: "Ticket does not belong to this event",
              status: "invalid",
            });
          }

          if (tk.checked_in === 1) {
            return res.status(200).json({
              status: "already",
              message: "Ticket already checked in",
            });
          }

          db.query(
            "UPDATE tickets SET checked_in = 1 WHERE id = ?",
            [tk.id],
            (updateErr) => {
              if (updateErr) {
                console.error(updateErr);
                return res.status(500).json({ message: "Database error" });
              }
              return res.status(200).json({
                status: "checked_in",
                message: "Ticket successfully checked in",
              });
            }
          );
        }
      );
    });
  });
});

module.exports = eventsRouter;
