import crypto from 'crypto';
import dotenv from 'dotenv';
import { prisma, pool } from '../db.js';
import { seedDatabase } from '../seed.js';
import { seedUser } from '../seedUser.js';
import { seedTransactions } from '../seedTransactions.js';

dotenv.config();

// Convert a 24-character MongoDB hex ObjectId into a deterministic RFC 4122 v4 UUID
function objectIdToUuid(hexId) {
  if (!hexId) return crypto.randomUUID();
  const hex = String(hexId).replace(/[^0-9a-fA-F]/g, '').padEnd(32, '0').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`.toLowerCase();
}

async function runMigration() {
  console.log('--- MongoDB to PostgreSQL Migration Script ---');
  const mongoUri = process.env.OLD_MONGODB_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('No OLD_MONGODB_URI or MONGODB_URI found in environment.');
    console.log('Skipping Mongo import. Seeding PostgreSQL with initial datasets instead...');
    await seedUser();
    await seedDatabase();
    await seedTransactions();
    console.log('Seeding completed successfully.');
    return;
  }

  let mongoClient = null;
  try {
    console.log(`Attempting to connect to MongoDB: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    // Attempt dynamic import if mongodb driver is available
    const mongodbModule = await import('mongodb').catch(() => null);
    if (!mongodbModule) {
      console.warn('mongodb driver not installed in this environment. Falling back to seeding default data.');
      await seedUser();
      await seedDatabase();
      await seedTransactions();
      return;
    }

    const { MongoClient } = mongodbModule;
    mongoClient = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
    await mongoClient.connect();
    console.log('Connected to MongoDB successfully.');

    const mongoDb = mongoClient.db();

    // 1. Migrate Users
    console.log('Migrating Users...');
    const mongoUsers = await mongoDb.collection('users').find().toArray();
    console.log(`Found ${mongoUsers.length} users in MongoDB.`);

    let migratedUsersCount = 0;
    const userIdMap = new Map();

    for (const u of mongoUsers) {
      const newId = objectIdToUuid(u._id);
      userIdMap.set(String(u._id), newId);

      await prisma.user.upsert({
        where: { email: u.email.toLowerCase() },
        update: {
          name: u.name,
          password: u.password,
        },
        create: {
          id: newId,
          name: u.name,
          email: u.email.toLowerCase(),
          password: u.password,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        },
      });
      migratedUsersCount++;
    }
    console.log(`Users migrated: Source=${mongoUsers.length}, Destination=${migratedUsersCount}`);

    // 2. Migrate Stocks
    console.log('Migrating Stocks...');
    const mongoStocks = await mongoDb.collection('stocks').find().toArray();
    console.log(`Found ${mongoStocks.length} stocks in MongoDB.`);

    let migratedStocksCount = 0;
    for (const s of mongoStocks) {
      await prisma.stock.upsert({
        where: { symbol: s.symbol.toUpperCase() },
        update: {
          name: s.name,
          price: s.price,
          change: s.change,
          changePercent: s.changePercent,
          volume: s.volume,
          marketCap: s.marketCap,
          aiPrediction: s.aiPrediction,
          historicalData: s.historicalData,
        },
        create: {
          id: objectIdToUuid(s._id),
          symbol: s.symbol.toUpperCase(),
          name: s.name,
          price: s.price,
          change: s.change,
          changePercent: s.changePercent,
          volume: s.volume,
          marketCap: s.marketCap,
          aiPrediction: s.aiPrediction,
          historicalData: s.historicalData,
          createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
        },
      });
      migratedStocksCount++;
    }
    console.log(`Stocks migrated: Source=${mongoStocks.length}, Destination=${migratedStocksCount}`);

    // 3. Migrate Transactions
    console.log('Migrating Transactions...');
    const mongoTx = await mongoDb.collection('transactions').find().toArray();
    console.log(`Found ${mongoTx.length} transactions in MongoDB.`);

    let migratedTxCount = 0;
    for (const t of mongoTx) {
      const postgresUserId = userIdMap.get(String(t.userId)) || objectIdToUuid(t.userId);
      const userExists = await prisma.user.findUnique({ where: { id: postgresUserId } });

      if (!userExists) {
        console.warn(`Skipping transaction ${t._id}: user ${postgresUserId} not found.`);
        continue;
      }

      await prisma.transaction.upsert({
        where: { id: objectIdToUuid(t._id) },
        update: {
          symbol: t.symbol.toUpperCase(),
          type: t.type.toLowerCase(),
          quantity: t.quantity,
          price: t.price,
        },
        create: {
          id: objectIdToUuid(t._id),
          userId: postgresUserId,
          symbol: t.symbol.toUpperCase(),
          type: t.type.toLowerCase(),
          quantity: t.quantity,
          price: t.price,
          timestamp: t.timestamp ? new Date(t.timestamp) : new Date(),
        },
      });
      migratedTxCount++;
    }
    console.log(`Transactions migrated: Source=${mongoTx.length}, Destination=${migratedTxCount}`);
    console.log('Data migration finished successfully.');

  } catch (error) {
    console.warn('MongoDB connection / migration failed (Atlas may be offline/exhausted):', error.message);
    console.log('Falling back to populating PostgreSQL with seed datasets...');
    await seedUser();
    await seedDatabase();
    await seedTransactions();
  } finally {
    if (mongoClient) {
      await mongoClient.close().catch(() => {});
    }
    await prisma.$disconnect();
    await pool.end().catch(() => {});
  }
}

runMigration().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});

