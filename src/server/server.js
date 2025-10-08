import express from 'express';
import db from './db.js';

const app = express();

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));