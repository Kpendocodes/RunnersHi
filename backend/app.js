const express = require('express');
const mysql = require('mysql2');
const routes = require('./routes'); // <-- This imports your router
const app = express();
const PORT = 3000;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '08162006', // your password
  database: 'runnertrack_db',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Tell Express to use your router
app.use('/', routes); // Now /hello works!

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
