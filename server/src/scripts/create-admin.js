import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from '../db.js';

dotenv.config();

const [, , email, password] = process.argv;

if (!email || !password) {
  // eslint-disable-next-line no-console
  console.error('Usage: node src/scripts/create-admin.js <email> <password>');
  process.exit(1);
}

if (password.length < 6) {
  // eslint-disable-next-line no-console
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());

if (existing) {
  // eslint-disable-next-line no-console
  console.error('User already exists.');
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 10);

const result = db
  .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
  .run(email.toLowerCase(), passwordHash);

// eslint-disable-next-line no-console
console.log(`Admin user created with id ${result.lastInsertRowid}.`);
