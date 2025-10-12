const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const express = require("express");
const cors = require("cors");
const { clerkMiddleware, requireAuth, getAuth } = require("@clerk/express");
const db = require("./db.js");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(clerkMiddleware());

// public/protected samples
app.get("/api/public", (_req, res) => res.json({ ok: true }));
app.get("/api/protected", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  res.json({ ok: true, userId });
});

// get list of users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send("Database error");
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
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

// get event by id
app.get("/event/:event_id", (req, res) => {
  const { event_id } = req.params;
  if (!event_id) return res.status(400).send("Event ID is required");

  const sql = `
    SELECT events.*, users.name AS organizer_name, users.email AS organizer_email
    FROM events
    JOIN users ON events.organizer_id = users.id
    WHERE events.id = ?
  `;
  db.query(sql, [event_id], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

// create event
app.post("/event", (req, res) => {
  const {
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
  } = req.body;

  if (
    !organizer_id ||
    !title || !description || !category || !imageUrl ||
    !event_date || !location || !ticket_capacity ||
    !remaining_tickets || !ticket_type
  ) return res.status(400).send("All fields are required");

  const sql = `
    INSERT INTO events 
      (organizer_id, title, description, category, imageUrl, event_date, location, ticket_capacity, remaining_tickets, ticket_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    organizer_id, title, description, category, imageUrl,
    event_date, location, ticket_capacity, remaining_tickets, ticket_type,
  ], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

// update event
app.put("/event/:event_id", (req, res) => {
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
app.delete("/event/:event_id", (req, res) => {
  const { event_id } = req.params;
  if (!event_id) return res.status(400).send("Event ID is required");

  db.query(`DELETE FROM events WHERE id = ?`, [event_id], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

// get list of saved events by user id
app.get("/events/:user_id", (req, res) => {
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
app.post("/save-event", (req, res) => {
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
app.delete("/delete-event", (req, res) => {
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
