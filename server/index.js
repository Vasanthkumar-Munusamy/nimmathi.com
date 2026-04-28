import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import audioRoutes from './routes/audio.routes.js';
import matrimonialRoutes from './routes/matrimonial.routes.js';
import qaRoutes from './routes/qa.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect Database ────────────────────────────────────────────────────────
connectDB();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/matrimonial', matrimonialRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/contact', contactRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nimmathi API is running 🕊️' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`\n🕊️  Nimmathi Server running at http://localhost:${PORT}`);
  console.log(`📡  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
