import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',     
  database: 'BugBusterDB'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to mySQL:', err);
    return;
  }
  console.log('Connected to mySQL database');
});

export default connection;