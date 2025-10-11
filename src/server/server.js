const express = require("express");
const app = express();
const db = require("./db.js");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

app.use(express.json());
app.use(cors());

// get list of users
app.get("/users", (req, res) => {
   db.query("SELECT * FROM users", (err, results) => {
      if (err) {
         console.error(err);
         res.status(500).send("Database error");
         return;
      }
      res.json(results);
   });
});

// get list of events
app.get("/events", (req, res) => {
   const sql = `
      SELECT 
        events.*, 
        users.name AS organizer_name, 
        users.email AS organizer_email
      FROM events
      JOIN users ON events.organizer_id = users.id
    `;

   db.query(sql, (err, results) => {
      if (err) {
         console.error(err);
         res.status(500).send("Database error");
         return;
      }
      res.status(200).json(results);
   });
});
app.get("/events/:organizer_id", (req, res) => {

   const organizer_id = req.params;
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
app.get("/event/:event_id", (req, res) => {
   const { event_id } = req.params;

   if (!event_id) {
      res.status(400).send("Event ID is required");
      return;
   }

   const sql = `
      SELECT events.*, users.name AS organizer_name, users.email AS organizer_email
      FROM events
      JOIN users ON events.organizer_id = users.id
      WHERE events.id = ?
      `;

   db.query(sql, [event_id], (err, results) => {
      if (err) {
         console.error(err);
         res.status(500).send("Database error");
         return;
      }
      res.status(200).json(results);
   });
});

// create event // change to const later
app.post("/event", (req, res) => {
   let {
      organizer_id,
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


   // Temporary until authentication is added
   organizer_id = organizer_id || 1;

   // Default remaining_tickets = ticket_capacity
  

   if (
      !organizer_id ||
      !title ||
      !description ||
      !category ||
      !imageUrl ||
      !event_date ||
      !location ||
      !ticket_capacity ||
      !remaining_tickets ||
      !ticket_type
   ) {
      res.status(400).send("All fields are required");
      return;
   }

   const sql = `INSERT INTO events (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
   db.query(
      sql,
      [
         organizer_id,
         title,
         description,
         category,
         imageUrl,
         event_date,
         location,
         ticket_capacity,
         remaining_tickets,
         ticket_type,
      ],
      (err, results) => {
         if (err) {
            console.error(err);
            res.status(500).send("Database error");
            return;
         }
         res.status(200).json(results);
      }
   );
});

// update event
app.put("/event/:event_id", (req, res) => {
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
   ) {
      res.status(400).send("All fields are required");
      return;
   }

   const sql = `UPDATE events SET title = ?, description = ?, category = ?, imageUrl = ?, event_date = ?, location = ?, ticket_capacity = ?, remaining_tickets = ?, ticket_type = ? WHERE id = ?`;
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
         if (err) {
            console.error(err);
            res.status(500).send("Database error");
            return;
         }
         res.status(200).json(results);
      }
   );
});

// delete event
app.delete("/event/:event_id", (req, res) => {
   const { event_id } = req.params;

   if (!event_id) {
      res.status(400).send("Event ID is required");
      return;
   }

   const sql = `DELETE FROM events WHERE id = ?`;
   db.query(sql, [event_id], (err, results) => {
      if (err) {
         console.error(err);
         res.status(500).send("Database error");
         return;
      }
      res.status(200).json(results);
   });
});

// get list of saved events by user id
app.get("/events/:user_id", (req, res) => {
   const { user_id } = req.params;

   if (!user_id) {
      res.status(400).send("User ID is required");
      return;
   }

   const sql = `
      SELECT events.*, users.name AS organizer_name, users.email AS organizer_email
      FROM userSavedEvents 
      JOIN events ON userSavedEvents.event_id = events.id
      JOIN users ON events.organizer_id = users.id
      WHERE user_id = ?
      `;

   db.query(sql, [user_id], (err, results) => {
      if (err) {
         console.error(err);
         res.status(500).send("Database error");
         return;
      }
      res.status(200).json(results);
   });
});

// save event to user saved events
app.post("/save-event", (req, res) => {
   const { user_id, event_id } = req.body;

   if (!user_id || !event_id) {
      res.status(400).send("User ID and event ID are required");
      return;
   }

   const sql = `INSERT INTO userSavedEvents (user_id, event_id) VALUES (?, ?)`;
   db.query(sql, [user_id, event_id], (err, results) => {
      if (err) {
         console.error(err);
         res.status(500).send("Database error");
         return;
      }
      res.status(200).json(results);
   });
});

// delete event from user saved events
app.delete("/delete-event", (req, res) => {
   const { user_id, event_id } = req.body;

   if (!user_id || !event_id) {
      res.status(400).send("User ID and event ID are required");
      return;
   }

   const sql = `DELETE FROM userSavedEvents WHERE user_id = ? AND event_id = ?`;
   db.query(sql, [user_id, event_id], (err, results) => {
      if (err) {
         console.error(err);
         res.status(500).send("Database error");
         return;
      }
      res.status(200).json(results);
   });
});

app.listen(process.env.PORT, () =>
   console.log(`Server running on port ${process.env.PORT}`)
);
