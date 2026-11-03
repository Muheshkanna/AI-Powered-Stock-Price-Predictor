import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_finance_app';

const poolMax = parseInt(process.env.PG_POOL_MAX || '10', 10);
const sslConfig = connectionString.includes('sslmode=require') || process.env.PG_SSL === 'true'
  ? { rejectUnauthorized: false }
  : undefined;

// Create pg.Pool with pooling parameters tailored for serverless / pooled deployments
const pgPool = new pg.Pool({
  connectionString,
  max: poolMax,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: sslConfig,
});

// Singleton pattern for PrismaClient on globalThis to survive hot reloads and serverless lambdas
const globalForPrisma = globalThis;

if (!globalForPrisma.prismaInstance) {
  const adapter = new PrismaPg(pgPool);
  globalForPrisma.prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
  globalForPrisma.pgPoolInstance = pgPool;
}

export const prisma = globalForPrisma.prismaInstance;
export const pool = globalForPrisma.pgPoolInstance;

// Helper to check database connectivity on startup with retry & exponential backoff
export async function verifyConnection(maxRetries = 3, initialDelayMs = 1000) {
  let delay = initialDelayMs;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log('PostgreSQL database connected successfully');
      return true;
    } catch (error) {
      console.warn(`Database connection attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }
  console.error('Warning: Could not connect to PostgreSQL on startup. Requests will attempt reconnect on demand.');
  return false;
}

export default prisma;

