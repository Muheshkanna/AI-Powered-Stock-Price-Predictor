import { Transaction } from './models/Transaction.js';
import { User } from './models/User.js';
import { prisma, pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

export async function seedTransactions() {
  try {
    console.log('Connecting to PostgreSQL for transaction seeding...');

    let user = await User.findByEmail('test@example.com');
    if (!user) {
      const allUsers = await prisma.user.findMany({ take: 1 });
      user = allUsers[0];
    }

    if (!user) {
      console.log('No user found to seed transactions for. Run seedUser.js first.');
      return;
    }

    // Clear existing transactions for this user
    await prisma.transaction.deleteMany({ where: { userId: user.id } });

    const dummyTransactions = [
      { userId: user.id, symbol: 'AAPL', type: 'buy', quantity: 10, price: 175.50, timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { userId: user.id, symbol: 'TSLA', type: 'buy', quantity: 5, price: 240.20, timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { userId: user.id, symbol: 'BTC', type: 'buy', quantity: 0.5, price: 42000, timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
      { userId: user.id, symbol: 'AAPL', type: 'sell', quantity: 2, price: 185.00, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    ];

    for (const tx of dummyTransactions) {
      await Transaction.create(tx);
    }

    console.log('Successfully seeded dummy transactions.');
  } catch (error) {
    console.error('Seeding transactions error:', error.message || error);
  } finally {
    await prisma.$disconnect();
    await pool.end().catch(() => {});
  }
}

if (process.argv[1] && process.argv[1].endsWith('seedTransactions.js')) {
  seedTransactions();
}
