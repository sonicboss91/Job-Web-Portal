import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

router.post('/signup', async (req, res) => {
  const allowSelfSignup = process.env.ALLOW_SELF_SIGNUP === 'true';

  if (!allowSelfSignup) {
    return res.status(403).json({ message: 'Self-signup is disabled for this internal admin portal.' });
  }

  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Provide a valid email and a password with at least 6 characters.' });
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());

  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = db
    .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    .run(email.toLowerCase(), passwordHash);

  const user = { id: result.lastInsertRowid, email: email.toLowerCase() };
  const token = createToken(user);

  return res.status(201).json({ token, user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createToken({ id: user.id, email: user.email });

  return res.json({ token, user: { id: user.id, email: user.email } });
});

export default router;
