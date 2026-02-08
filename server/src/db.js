import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'clearjunk.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    job_reference TEXT,
    customer_name TEXT,
    title TEXT,
    address TEXT NOT NULL,
    postcode TEXT,
    job_date TEXT,
    window_start TEXT,
    window_end TEXT,
    estimated_volume_yd3 REAL,
    price_ex_vat REAL,
    vat_amount REAL,
    total_price_inc_vat REAL,
    notes TEXT,
    scheduled_at TEXT,
    volume TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

function ensureColumn(columnName, definition) {
  const columns = db.prepare('PRAGMA table_info(jobs)').all();
  const exists = columns.some((column) => column.name === columnName);
  if (!exists) {
    db.exec(`ALTER TABLE jobs ADD COLUMN ${columnName} ${definition}`);
  }
}

ensureColumn('job_reference', 'TEXT');
ensureColumn('customer_name', 'TEXT');
ensureColumn('postcode', 'TEXT');
ensureColumn('job_date', 'TEXT');
ensureColumn('window_start', 'TEXT');
ensureColumn('window_end', 'TEXT');
ensureColumn('estimated_volume_yd3', 'REAL');
ensureColumn('price_ex_vat', 'REAL');
ensureColumn('vat_amount', 'REAL');
ensureColumn('total_price_inc_vat', 'REAL');
ensureColumn('notes', 'TEXT');

export default db;
