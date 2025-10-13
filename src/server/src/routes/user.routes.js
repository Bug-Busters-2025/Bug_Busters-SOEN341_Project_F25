const express = require("express");
const db = require("../db.js");

const usersRouter = express.Router();

// get list of users
usersRouter.get("", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).send("Database error");
            res.json(results);
    });
});

usersRouter.get("tickets/:user_id", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).send("Database error");
            res.json(results);
    });
});

usersRouter.get("/tickets/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const sql = `
      SELECT
        t.id                    AS ticket_id,
        t.status,
        t.checked_in,
        t.created_at           AS ticket_created_at,

        e.id                   AS event_id,
        e.title                AS event_title,
        e.description          AS event_description,
        e.category             AS event_category,
        e.imageUrl             AS event_imageUrl,
        e.event_date,
        e.location,
        e.ticket_capacity,
        e.remaining_tickets,
        e.ticket_type,

        u.id                   AS organizer_id,
        u.name                 AS organizer_name,
        u.email                AS organizer_email
      FROM tickets t
      JOIN events  e ON t.event_id = e.id
      JOIN users   u ON e.organizer_id = u.id
      WHERE t.user_id = ?
      ORDER BY e.event_date ASC, t.id ASC
    `;

    try {
      const [rows] = await db.execute(sql, [userId]);
      return res.json(rows);
    } catch (err) {
      console.error("DB error (tickets by user):", err);
      return res.status(500).json({ error: "Database error" });
    }
});

module.exports = usersRouter;
