const express = require('express');
const app = express();
const exportRouter = require('./routes/export');
const eventsRouter = require('./routes/events');
const db = require('./config/db');



app.get('/api/test-db', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT 1 + 1 AS result');
      res.json({ message: 'DB Connected', result: rows[0].result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Database connection failed' });
    }
  });

app.get("/api", (req,res)=> {
    res.json({"users": ["userOne","userTwo","userThree"]})


})
app.use('/api/events', exportRouter);
app.use('/api/events', eventsRouter);
app.listen(5001,()=> {console.log("server started on port 5001")})