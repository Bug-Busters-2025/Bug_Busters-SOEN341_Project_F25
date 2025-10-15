const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
   database: process.env.DB_NAME,
});

connection.connect((err) => {
   if (err) {
      console.error("Error connecting to mySQL:", err);
      return;
   }
   console.log("Connected to mySQL database");
});

module.exports = connection;
