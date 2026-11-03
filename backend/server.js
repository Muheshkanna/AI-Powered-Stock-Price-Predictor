import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, verifyConnection } from './db.js';
import stockRoutes from './routes/stocks.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Verify database connection on startup (non-blocking for serverless/cold starts)
if (process.env.NODE_ENV !== 'production' || process.env.VERIFY_DB_ON_STARTUP === 'true') {
  verifyConnection(3, 1000).catch((err) => {
    console.error('Initial DB verification error:', err.message);
  });
}

// Health check endpoints running SELECT 1
const healthHandler = async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 AS healthy');
    if (result.rows && result.rows[0]?.healthy === 1) {
      return res.status(200).json({ status: 'ok', database: 'connected' });
    }
    return res.status(503).json({ status: 'error', database: 'unhealthy' });
  } catch (error) {
    console.error('Health check database query failed:', error.message);
    return res.status(503).json({ status: 'error', message: 'Database connection failed' });
  }
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('AI Finance Backend API is running');
});

// Centralized error handling: no stack traces leaked to clients
app.use((err, req, res, next) => {
  console.error('Unhandled request error:', err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'Internal server error' : err.message,
  });
});

// Start locally, but don't listen on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
