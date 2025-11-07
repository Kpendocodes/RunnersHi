const express = require('express');
const router = express.Router();

// Define your routes
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// Export the router so app.js can use it
module.exports = router;
