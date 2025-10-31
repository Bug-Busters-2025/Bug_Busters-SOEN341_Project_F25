const { Router } = require("express");
const { requireAuth, getAuth } = require("@clerk/express");
const eventsRouter = Router();
const db = require("../db.js");
const { format } = require("@fast-csv/format");
const QRCode = require("qrcode");

// get list of events
eventsRouter.get("/", (req, res) => {
   const sql = `
        SELECT 
        events.*, 
        users.name AS organizer_name, 
        users.email AS organizer_email
        FROM events
        JOIN users ON events.organizer_id = users.id
    `;
   db.query(sql, (err, results) => {
      if (err) return res.status(500).send("Database error");
      res.status(200).json(results);
   });
});

//
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
   ORDER by event_date ASC`;

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

// get event by id

eventsRouter.post("/create", requireAuth(), (req, res) => {
   const { userId } = getAuth(req); // Clerk user ID

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
   db.query(findUserSQL, [userId], (err, rows) => {
      if (err) {
         console.error("❌ Database lookup error:", err);
         return res
            .status(500)
            .json({ message: "Database lookup error", error: err });
      }

      if (rows.length === 0) {
         console.warn("⚠️ No user found for Clerk ID:", userId);
         return res
            .status(404)
            .json({ message: "No user found for this Clerk ID" });
      }

      const organizer_id = rows[0].id;
      const formattedDate = event_date.replace("T", " ");
      const lowerTicketType = ticket_type.toLowerCase();

      const insertSQL = `
        INSERT INTO events 
        (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
         insertSQL,
         [
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
         ],
         (err2, results) => {
            if (err2) {
               console.error(err2);
               return res
                  .status(500)
                  .json({ message: "Database error", error: err2.sqlMessage });
            }
            res.status(201).json({
               message: "✅ Event created successfully",
               results,
            });
         }
      );
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

// delete event
eventsRouter.delete("/:event_id", (req, res) => {
   const { event_id } = req.params;
   if (!event_id) return res.status(400).send("Event ID is required");

   db.query(`DELETE FROM events WHERE id = ?`, [event_id], (err, results) => {
      if (err) return res.status(500).send("Database error");
      res.status(200).json(results);
   });
});

// get list of saved events by user id
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
      return res
         .status(400)
         .json({ message: "User ID and Event ID are required" });
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
            return res
               .status(400)
               .json({ message: "Already registered for this event" });
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
                        return res
                           .status(500)
                           .json({ message: "Database error" });
                     }

                     if (status === "claimed") {
                        const ticketId = results.insertId;

                        try {
                           const payload = `ticket:${ticketId}-user:${user_id}-event:${event_id}`;
                           console.log("Generating QR for:", payload);
                           const qrDataUrl = await QRCode.toDataURL(payload);
                           console.log(
                              "Generated QR (first 50 chars):",
                              qrDataUrl.slice(0, 50)
                           );

                           db.query(
                              `UPDATE tickets SET qr_code = ?, qr_payload= ? WHERE id = ?`,
                              [qrDataUrl, payload,  ticketId],
                              (err2) => {
                                 if (err2) {
                                    console.error(
                                       "Error saving QR code:",
                                       err2
                                    );
                                    return res
                                       .status(500)
                                       .json({ message: "Error saving QR" });
                                 }

                                 db.query(
                                    `UPDATE events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?`,
                                    [event_id],
                                    (err3) => {
                                       if (err3) {
                                          console.error(
                                             "Database error updating tickets:",
                                             err3
                                          );
                                          return res.status(500).json({
                                             message: "Database error",
                                          });
                                       }

                                       res.status(200).json({
                                          message:
                                             "Successfully registered for event",
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
                           return res
                              .status(500)
                              .json({ message: "QR generation failed" });
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

   console.log("Unregister request received:", { user_id, event_id });

   if (!user_id || !event_id) {
      return res
         .status(400)
         .json({ message: "User ID and Event ID are required" });
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
            return res
               .status(404)
               .json({ message: "Not registered for this event" });
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
                           console.error(
                              "Database error updating tickets:",
                              err
                           );
                           return res
                              .status(500)
                              .json({ message: "Database error" });
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

// get list of registered events for a user
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
         return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(results);
   });
});
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
            return res
               .status(403)
               .json({ message: "User not found in database" });

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
 eventsRouter.post("/check-in", requireAuth(), (req,res) => {
   

   const { userId } = getAuth(req);
   const  {payload, event_id } = req.body;

   if (!payload || !event_id) {
      return res.status(400).json({ message: "Payload/event ID missing" });
   }

   console.log("🧾 Clerk userId:", userId);
   console.log("🧾 event_id:", event_id);

   const getOrganizerSQL = "SELECT id FROM users WHERE clerk_id = ? AND role = 'organizer'";

   db.query(getOrganizerSQL, [userId], (err, rows) => {
      if (err)
      {
         console.error(err);
         return res.status(500).json({ message: "Database error" });
      }
      if (rows.length === 0) {
         return res.status(403).json({ message: "User not authorized as organizer" });
      }
      const organizerId = rows[0].id;
      console.log("✅ Organizer internal ID:", organizerId);

      const checkEventSQL = "SELECT organizer_id FROM events WHERE id = ? and organizer_id = ?";

      db.query(checkEventSQL, [event_id, organizerId], (err2, eventRows) => {
         if (err2)
         {
            console.error(err2);
            return res.status(500).json({ message: "Database error" });
            
         }
         console.log("🧾 Event query result:", eventRows);
         if (eventRows.length === 0) {
            console.log("🚫 Organizer not owner of this event!");
            return res.status(403).json({ message: "You do not have permission to check in tickets for this event." });
         }
         console.log("✅ Organizer owns event — proceeding");
   db.query(
      'SELECT id, event_id, checked_in FROM tickets WHERE qr_payload = ?',
      [payload],
      (err,rows) => {
         if (err)
         {
            
            console.error(err);
            return res.status(500).json({ message: "Database error" });
         }

         if (rows.length === 0) {
            return  res.status(404).json({ message: "Ticket not found",
                                           status: "invalid",
                                          });
         }
         const tk = rows[0];


         if (tk.event_id !== parseInt(event_id)) {
            return res.status(403).json({ message: "Ticket does not belong to this event", status: "invalid",});

         }

         if (tk.checked_in === 1) {
            return res.status(200).json({ status: "already",
                                          message: "Ticket already checked in",
                                          });
         }


         db.query(
            'UPDATE tickets SET checked_in = 1 WHERE id = ?',
            [tk.id],
            (updateErr) => { 
               if (updateErr)
               {
                  console.error(updateErr);
                  return res.status(500).json({ message: "Database error" });
               }
               return res.status(200).json({
                  status: "checked_in",
                  message: "Ticket successfully checked in",
               });
            }
         ); 
      }); 
   }); 
}); 
}); 
module.exports = eventsRouter;
