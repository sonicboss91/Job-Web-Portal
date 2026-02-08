import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import { requireAuth } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'clearjunk-dev-secret-change-me';
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', requireAuth, jobRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`ClearJunk API listening on port ${PORT}`);
});
