import mongoose from 'mongoose';
import { Transaction } from './models/Transaction.js';
import { User } from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_finance_app';

async function seedTransactions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for transaction seeding...');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found to seed transactions for. Please sign up first.');
      process.exit(0);
    }

    // Clear existing transactions for this user
    await Transaction.deleteMany({ userId: user._id });

    const dummyTransactions = [
      { userId: user._id, symbol: 'AAPL', type: 'buy', quantity: 10, price: 175.50, timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { userId: user._id, symbol: 'TSLA', type: 'buy', quantity: 5, price: 240.20, timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { userId: user._id, symbol: 'BTC', type: 'buy', quantity: 0.5, price: 42000, timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
      { userId: user._id, symbol: 'AAPL', type: 'sell', quantity: 2, price: 185.00, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    ];

    await Transaction.insertMany(dummyTransactions);
    console.log('Successfully seeded dummy transactions.');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedTransactions();
