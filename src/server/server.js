const express = require('express');
const app = express();
const db = require('./db.js');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

app.use(express.json());
app.use(cors());

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

app.get('/events', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err){
      console.error(err);
      res.status(500).send('Database error');
      return;
    }
    res.status(200).json(results);
  })
})

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));