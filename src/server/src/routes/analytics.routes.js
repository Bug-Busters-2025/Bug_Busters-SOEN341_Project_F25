const { Router } = require("express");
const { pool } = require("../db");

const analyticsRouter = Router();

analyticsRouter.get("/summary", async (req, res, next) => {
   try {
      const { organizer_id, event_id } = req.query;

      let eventWhere = "";
      let ticketWhere = "";
      let eventParam = null;
      let ticketParam = null;

      if (event_id) {
         eventWhere = "WHERE e.id = ?";
         ticketWhere = "WHERE t.event_id = ?";
         eventParam = event_id;
         ticketParam = event_id;
      } else if (organizer_id) {
         eventWhere = "WHERE e.organizer_id = ?";
         ticketWhere =
            "WHERE t.event_id IN (SELECT id FROM events WHERE organizer_id = ?)";
         eventParam = organizer_id;
         ticketParam = organizer_id;
      }

      const eventsQuery = eventWhere
         ? `SELECT COUNT(*) c FROM events e ${eventWhere}`
         : "SELECT COUNT(*) c FROM events";

      const ticketsQuery = ticketWhere
         ? `SELECT COUNT(*) c FROM tickets t ${ticketWhere}`
         : "SELECT COUNT(*) c FROM tickets";

      const participationQuery = ticketWhere
         ? `SELECT 
           COUNT(*) issued,
           SUM(CASE WHEN checked_in=1 THEN 1 ELSE 0 END) checked
         FROM tickets t ${ticketWhere}`
         : `SELECT 
           COUNT(*) issued,
           SUM(CASE WHEN checked_in=1 THEN 1 ELSE 0 END) checked
         FROM tickets`;

      const [[{ c: events }]] = await pool.query(
         eventsQuery,
         eventParam ? [eventParam] : []
      );
      const [[{ c: tickets }]] = await pool.query(
         ticketsQuery,
         ticketParam ? [ticketParam] : []
      );
      const [[{ issued, checked }]] = await pool.query(
         participationQuery,
         ticketParam ? [ticketParam] : []
      );

      const participationRate =
         Number(issued || 0) > 0
            ? Number(checked || 0) / Number(issued || 0)
            : 0;
      res.json({
         events: Number(events || 0),
         tickets: Number(tickets || 0),
         participationRate,
      });
   } catch (e) {
      next(e);
   }
});

analyticsRouter.get("/participation", async (req, res, next) => {
   try {
      const { organizer_id, event_id } = req.query;

      let whereClause = "WHERE e.event_date >= CURDATE() - INTERVAL 30 DAY";
      const params = [];

      if (event_id) {
         whereClause += " AND e.id = ?";
         params.push(event_id);
      } else if (organizer_id) {
         whereClause += " AND e.organizer_id = ?";
         params.push(organizer_id);
      }

      const [rows] = await pool.query(
         `SELECT 
         DATE(e.event_date) AS date,
         e.title AS eventTitle,
         e.id AS eventId,
         COUNT(t.id) AS issued,
         SUM(CASE WHEN t.checked_in=1 THEN 1 ELSE 0 END) AS checkedIn
       FROM events e
       LEFT JOIN tickets t ON t.event_id = e.id
       ${whereClause}
       GROUP BY DATE(e.event_date), e.id
       ORDER BY DATE(e.event_date), e.event_date`,
         params
      );
      res.json(
         rows.map((r) => ({
            date: r.date,
            eventTitle: r.eventTitle,
            eventId: r.eventId,
            issued: Number(r.issued || 0),
            checkedIn: Number(r.checkedIn || 0),
         }))
      );
   } catch (e) {
      next(e);
   }
});

module.exports = analyticsRouter;
