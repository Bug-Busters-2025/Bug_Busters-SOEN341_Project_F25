const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',          
  password: '', 
  database: 'campus_events_db'  
});

module.exports = db;