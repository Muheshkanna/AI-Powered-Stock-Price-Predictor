-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable users
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable stocks
CREATE TABLE IF NOT EXISTS "stocks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "symbol" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(18,4) NOT NULL,
    "change" DECIMAL(18,4) NOT NULL,
    "change_percent" DECIMAL(10,4) NOT NULL,
    "volume" VARCHAR(50) NOT NULL,
    "market_cap" VARCHAR(50) NOT NULL,
    "ai_prediction" JSONB NOT NULL,
    "historical_data" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable transactions
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "symbol" VARCHAR(20) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "price" DECIMAL(18,4) NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_transaction_type" CHECK ("type" IN ('buy', 'sell')),
    CONSTRAINT "chk_transaction_quantity" CHECK ("quantity" > 0),
    CONSTRAINT "chk_transaction_price" CHECK ("price" >= 0)
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "stocks_symbol_key" ON "stocks"("symbol");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "stocks_change_percent_idx" ON "stocks"("change_percent");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "transactions_user_id_timestamp_idx" ON "transactions"("user_id", "timestamp" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "transactions_symbol_idx" ON "transactions"("symbol");

-- AddForeignKey
ALTER TABLE "transactions" 
    DROP CONSTRAINT IF EXISTS "transactions_user_id_fkey",
    ADD CONSTRAINT "transactions_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

