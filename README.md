# AI-Powered Stock Price Predictor & Finance Dashboard

A full-stack financial portfolio tracker and stock price predictor application featuring real-time market simulations, AI trend projections, and portfolio analytics.

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS + Radix UI / shadcn
- **Backend**: Node.js + Express.js
- **Database Layer**: PostgreSQL via Prisma ORM & `pg` driver pooling
- **Deployment**: Vercel Serverless

---

## Architecture Overview

The database layer has been migrated from MongoDB Atlas to a relational **PostgreSQL** schema managed with **Prisma ORM**:

- **`users` table**: Stores registered accounts with bcrypt-hashed credentials and UUID primary keys.
- **`stocks` table**: Stores stock market prices, volume, capitalization, AI prediction metadata, and historical time-series data with indexed performance metrics.
- **`transactions` table**: Tracks user buy/sell transactions with strict decimal accuracy (`NUMERIC(18, 4)`), check constraints, and cascade deletion tied to `user_id`.

---

## Environment Variables

Copy `.env.example` to `backend/.env`:

```env
# PostgreSQL connection string (Works with Neon, Supabase, Railway, Render, or local Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_finance_app?schema=public"

# Port configuration
PORT=5000

# JWT Authentication
JWT_SECRET="your_jwt_secret_key_here"

# Connection Pool settings
PG_POOL_MAX=10
PG_SSL=false
```

---

## Quickstart (Local Development)

### 1. Start Local PostgreSQL with Docker Compose

A local PostgreSQL 16 container with automatic schema initialization is provided:

```bash
docker compose up -d
```

This starts PostgreSQL on port `5432` and applies initial schema migrations from `backend/prisma/migrations/0_init/migration.sql`.

### 2. Install Dependencies & Generate Prisma Client

```bash
# In the root directory (Frontend)
npm install

# In the backend directory
cd backend
npm install
npm run db:generate
```

### 3. Apply Schema & Seed Database

```bash
cd backend

# Push schema directly to PostgreSQL or run migrations
npm run db:push

# Seed stocks, demo user (test@example.com / password123), and sample transactions
npm run seed
npm run seed:user
npm run seed:transactions
```

### 4. Run Development Servers

- **Backend API**:
  ```bash
  cd backend
  npm run dev
  ```
  API runs on `http://localhost:5000`.

- **Frontend UI**:
  ```bash
  npm run dev
  ```
  App opens on `http://localhost:8080` (or `http://localhost:5173`).

---

## Testing

- **Backend Database Tests**:
  ```bash
  cd backend
  npm test
  ```
- **Frontend Build & Typecheck**:
  ```bash
  npm run build
  ```

---

## Health Check Endpoint

A dedicated health check endpoint verifies database connectivity:
- `GET /health` or `GET /api/health`
- Response: `{"status": "ok", "database": "connected"}`

---

## Data Migration from MongoDB

If you have historical data in MongoDB Atlas to migrate:
1. Set `OLD_MONGODB_URI` in `backend/.env`.
2. Run the idempotent migration script:
   ```bash
   cd backend
   npm run migrate:mongo
   ```
   *Note: If MongoDB Atlas is offline or credentials have expired, the script safely falls back to seeding default financial market data.*

---

## Production Deployment (Vercel)

1. Provision a PostgreSQL instance (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app), or [Render](https://render.com)).
2. Set `DATABASE_URL` and `JWT_SECRET` in your Vercel project environment variables.
   * If using Neon or Supabase connection poolers (PgBouncer), use the pooled connection string with `?sslmode=require`.
3. Deploy directly with git push or Vercel CLI. Build commands automatically run `npm run db:generate`.
