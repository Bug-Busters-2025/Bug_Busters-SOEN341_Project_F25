const { Router } = require("express");
const { requireAuth, getAuth } = require("@clerk/express");
const eventsRouter = Router();
const db = require("../db.js");

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
    console.log("🧑 Clerk user:", userId);
  
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
  
    // Validate inputs (no organizer_id needed)
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
  
    // Step 1 — Find MySQL user by Clerk ID
    const findUserSQL = "SELECT id FROM users WHERE clerk_id = ?";
    db.query(findUserSQL, [userId], (err, rows) => {
      if (err) {
        console.error("❌ Database lookup error:", err);
        return res.status(500).json({ message: "Database lookup error", error: err });
      }
  
      if (rows.length === 0) {
        console.warn("⚠️ No user found for Clerk ID:", userId);
        return res.status(404).json({ message: "No user found for this Clerk ID" });
      }
  
      const organizer_id = rows[0].id;
      const formattedDate = event_date.replace("T", " "); // Convert to SQL DATETIME
      const lowerTicketType = ticket_type.toLowerCase();
  
      // 🧱 DEBUG PRINT — place this RIGHT BEFORE db.query()
      console.log("🧱 INSERTING EVENT:", {
        organizer_id,
        formattedDate,
        lowerTicketType,
        ticket_capacity,
        remaining_tickets,
        title,
        category,
      });
  
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
            console.error("❌ SQL INSERT ERROR:", err2);
            console.error("💾 Full SQL:", insertSQL);
            console.error("🧱 Values:", [
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
            ]);
            return res.status(500).json({ message: "Database error", error: err2.sqlMessage });
          }
  
          console.log("✅ Event created successfully by organizer:", organizer_id);
          res.status(201).json({ message: "✅ Event created successfully", results });
        }
      );
    });
  });

// update event
eventsRouter.put("/:event_id", (req, res) => {
    const { event_id } = req.params;
    const {
        title, description, category, imageUrl, event_date,
        location, ticket_capacity, remaining_tickets, ticket_type,
    } = req.body;

    if (
        !event_id || !title || !description || !category || !imageUrl ||
        !event_date || !location || !ticket_capacity ||
        !remaining_tickets || !ticket_type
    ) return res.status(400).send("All fields are required");

    const sql = `
        UPDATE events 
        SET title=?, description=?, category=?, imageUrl=?, event_date=?, location=?, 
            ticket_capacity=?, remaining_tickets=?, ticket_type=? 
        WHERE id=?
    `;

    db.query(sql, [
        title, description, category, imageUrl, event_date, location,
        ticket_capacity, remaining_tickets, ticket_type, event_id,
    ], (err, results) => {
        if (err) return res.status(500).send("Database error");
        res.status(200).json(results);
    });
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
eventsRouter.post("/save-event", (req, res) => {
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id) return res.status(400).send("User ID and event ID are required");

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
eventsRouter.delete("/delete-event", (req, res) => {
    const { user_id, event_id } = req.body;
    if (!user_id || !event_id) return res.status(400).send("User ID and event ID are required");

    db.query(
        `DELETE FROM userSavedEvents WHERE user_id = ? AND event_id = ?`,
        [user_id, event_id],
        (err, results) => {
            if (err) return res.status(500).send("Database error");
                res.status(200).json(results);
        }
    );
});


module.exports = eventsRouter;
