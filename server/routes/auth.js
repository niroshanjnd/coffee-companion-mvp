import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM application_users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});


router.post('/register', async (req, res) => {
  const { name, email, password, suburb, mobile, preferences, age_category } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO application_users (name, email, password_hash, suburb, mobile, preferences, age_category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, email, hashedPassword, suburb, mobile, preferences, age_category]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
