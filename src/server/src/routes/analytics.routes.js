const { Router } = require("express");
const { pool } = require("../db");

const analyticsRouter = Router();

analyticsRouter.get("/summary", async (_req, res, next) => {
  try {
    const [[{ c: events }]] = await pool.query("SELECT COUNT(*) c FROM events");
    const [[{ c: tickets }]] = await pool.query("SELECT COUNT(*) c FROM tickets");
    const [[{ issued, checked }]] = await pool.query(
      `SELECT 
         COUNT(*) issued,
         SUM(CASE WHEN checked_in=1 THEN 1 ELSE 0 END) checked
       FROM tickets`
    );
    const participationRate =
      Number(issued || 0) > 0 ? Number(checked || 0) / Number(issued || 0) : 0;
    res.json({ events: Number(events || 0), tickets: Number(tickets || 0), participationRate });
  } catch (e) {
    next(e);
  }
});

analyticsRouter.get("/participation", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         DATE(e.event_date) AS date,
         e.title AS eventTitle,
         COUNT(t.id) AS issued,
         SUM(CASE WHEN t.checked_in=1 THEN 1 ELSE 0 END) AS checkedIn
       FROM events e
       LEFT JOIN tickets t ON t.event_id = e.id
       WHERE e.event_date >= CURDATE() - INTERVAL 30 DAY
       GROUP BY DATE(e.event_date), e.id
       ORDER BY DATE(e.event_date), e.event_date`
    );
    res.json(
      rows.map(r => ({
        date: r.date,
        eventTitle: r.eventTitle,
        issued: Number(r.issued || 0),
        checkedIn: Number(r.checkedIn || 0),
      }))
    );
  } catch (e) {
    next(e);
  }
});

module.exports = analyticsRouter;
