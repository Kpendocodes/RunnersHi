const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// ⭐ MIDDLEWARE MUST BE HERE - BEFORE ROUTES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Routes - MUST COME AFTER MIDDLEWARE
const routes = require('./routes')(db);
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
