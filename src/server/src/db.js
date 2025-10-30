const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const isTestEnv = process.env.NODE_ENV === "test";

const connection = mysql.createConnection({
   host: process.env.DB_HOST || "localhost",
   user: process.env.DB_USER || "root",
   password: process.env.DB_PASSWORD || "",
   port: process.env.DB_PORT || 3306,
   database: process.env.DB_NAME || "campusevents",
 });

if (!isTestEnv) {
   connection.connect((err) => {
     if (err) {
       console.error("Error connecting to MySQL:", err);
       return;
     }
     console.log("Connected to MySQL database");
   });
 }
module.exports = connection;
