require('dotenv').config();
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

console.log('app.js loaded');

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
process.on('unhandledRejection', (reason, promise) => {
console.error('Unhandled Rejection:', reason);
});
// Add a new user
app.post('/users', async (req, res) => {
    try {
      console.log('POST /users endpoint hit');

      console.log('POST /users called with body:', req.body);
      const { email, wallet_address } = req.body;
      if (!email || !wallet_address) {
        throw new Error('Missing email or wallet_address');
      }
      const result = await pool.query(
        'INSERT INTO users (email, wallet_address) VALUES ($1, $2) RETURNING *',
        [email, wallet_address]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error in /users:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

// Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('API is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/test', (req, res) => {
    res.json({ message: 'Test route works!' });
  });