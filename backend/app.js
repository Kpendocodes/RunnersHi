const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// Middleware - CRUCIAL for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for React Native
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '08162006',
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

// Pass db connection to routes
const routes = require('./routes')(db);
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
