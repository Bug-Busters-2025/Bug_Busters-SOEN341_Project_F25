const express = require('express');
const { format } = require('@fast-csv/format');
const db = require('../config/db');

const router = express.Router();

// This export route provides a CSV with the required attendee columns:
// student name, email address, ticket claim status, and check-in status. (#25)

router.get('/:id/export', async (req, res) => {
  const eventId = req.params.id;

  try {
    // Query attendee info for this event
    const [rows] = await db.query(
      `SELECT s.name        AS student_name,
              s.email       AS email,
              t.status      AS ticket_status,
              t.checked_in  AS checked_in
       FROM tickets t
       JOIN students s ON t.student_id = s.id
       WHERE t.event_id = ?`,
      [eventId]
    );

   
    res.setHeader('Content-Disposition', `attachment; filename=attendees_event_${eventId}.csv`);
    res.setHeader('Content-Type', 'text/csv');

    // Stream the CSV directly to the response
    const csvStream = format({ headers: true });
    csvStream.pipe(res);
    rows.forEach(row => csvStream.write(row));
    csvStream.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export attendee list' });
  }
});

//Implemented CSV export for Task #24 

module.exports = router;
