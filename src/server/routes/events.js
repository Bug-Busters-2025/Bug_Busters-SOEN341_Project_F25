const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Get events by organizer ID
router.get('/organizer/:id', async (req, res) => {
  const organizerId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT id, title 
       FROM events
       WHERE organizer_id = ?`,
      [organizerId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching organizer events:', err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

module.exports = router;