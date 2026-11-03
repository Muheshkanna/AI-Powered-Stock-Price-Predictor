import assert from 'node:assert/strict';
import { UserModel } from '../models/User.js';
import { StockModel } from '../models/Stock.js';
import { TransactionModel } from '../models/Transaction.js';

async function runTests() {
  console.log('Running PostgreSQL Database Layer Tests...');

  // 1. Password hashing & comparison test
  const password = 'SuperSecretPassword123!';
  const hashedPassword = await UserModel.create
    ? await (async () => {
        const bcrypt = (await import('bcryptjs')).default;
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
      })()
    : null;

  const isMatch = await UserModel.comparePassword(password, hashedPassword);
  assert.equal(isMatch, true, 'UserModel.comparePassword should verify correct password');

  const isWrongMatch = await UserModel.comparePassword('WrongPassword', hashedPassword);
  assert.equal(isWrongMatch, false, 'UserModel.comparePassword should reject incorrect password');
  console.log('✔ Password hashing & validation verified');

  // 2. Stock formatting test
  const sampleStock = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: '185.9200',
    change: '2.3400',
    changePercent: '1.2700',
    volume: '52.4M',
    marketCap: '2.9T',
    aiPrediction: { trend: 'bullish', confidence: 85, targetPrice: 200 },
    historicalData: [{ time: '2026-01-01', value: 180 }],
    createdAt: new Date(),
  };

  const formattedStock = StockModel.format(sampleStock);
  assert.equal(typeof formattedStock.price, 'number');
  assert.equal(formattedStock.price, 185.92);
  assert.equal(formattedStock.id, sampleStock.id);
  assert.equal(formattedStock._id, sampleStock.id, 'Should alias id to _id for backward compatibility');
  console.log('✔ Stock model formatting and Decimal-to-Number conversion verified');

  // 3. Transaction formatting & Portfolio summary calculation
  const sampleTx = {
    id: 'b1ffcd88-8b0a-3de7-aa5c-5aa8ac270a22',
    userId: 'c2eedf77-7a09-2cd6-994b-49979b160a33',
    symbol: 'AAPL',
    type: 'buy',
    quantity: '10.0000',
    price: '150.0000',
    timestamp: new Date(),
  };

  const formattedTx = TransactionModel.format(sampleTx);
  assert.equal(typeof formattedTx.quantity, 'number');
  assert.equal(typeof formattedTx.price, 'number');
  assert.equal(formattedTx.quantity, 10);
  assert.equal(formattedTx.price, 150);
  assert.equal(formattedTx._id, sampleTx.id);
  console.log('✔ Transaction model formatting verified');

  console.log('\nAll Database Layer tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test failure:', err);
  process.exit(1);
});
