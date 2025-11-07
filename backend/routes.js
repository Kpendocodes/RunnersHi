const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = (db) => {
  
  // ========== USER ENDPOINTS ==========
  
  router.post('/users/register', async (req, res) => {
    console.log('Request body:', req.body); // Debug
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
      
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
          message: 'User created successfully', 
          userId: result.insertId 
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);
      
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      
      res.json({ 
        message: 'Login successful', 
        userId: user.id, 
        username: user.username 
      });
    });
  });
  
  // ========== RUN TRACKING ENDPOINTS ==========
  
  router.post('/runs/start', (req, res) => {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }
    
    const query = 'INSERT INTO runs (user_id, start_time) VALUES (?, NOW())';
    
    db.query(query, [user_id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        runId: result.insertId, 
        message: 'Run started' 
      });
    });
  });
  
  router.put('/runs/:runId/stop', (req, res) => {
    const { runId } = req.params;
    const { distance, duration, pace, calories, is_simulated } = req.body;
    
    const query = `UPDATE runs 
                   SET end_time = NOW(), distance = ?, duration = ?, 
                       pace = ?, calories = ?, is_simulated = ? 
                   WHERE id = ?`;
    
    db.query(query, [distance, duration, pace, calories, is_simulated || false, runId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Run completed' });
    });
  });
  
  router.get('/runs/user/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `SELECT * FROM runs 
                   WHERE user_id = ? 
                   ORDER BY start_time DESC`;
    
    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ runs: results });
    });
  });
  
  // ========== BADGE ENDPOINTS ==========
  
  router.get('/badges', (req, res) => {
    db.query('SELECT * FROM badges', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ badges: results });
    });
  });
  
  router.get('/badges/user/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `SELECT b.*, ub.earned_at 
                   FROM badges b 
                   JOIN user_badges ub ON b.id = ub.badge_id 
                   WHERE ub.user_id = ?
                   ORDER BY ub.earned_at DESC`;
    
    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ badges: results });
    });
  });
  
  // ========== STATS ENDPOINTS ==========
  
  router.get('/stats/user/:userId', (req, res) => {
    const { userId } = req.params;
    
    const query = `SELECT 
                    COUNT(*) as total_runs,
                    SUM(distance) as total_distance,
                    SUM(duration) as total_duration,
                    AVG(pace) as avg_pace,
                    SUM(calories) as total_calories
                   FROM runs 
                   WHERE user_id = ? AND end_time IS NOT NULL`;
    
    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ stats: results[0] });
    });
  });
  
  return router;
};
