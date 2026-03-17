import express from 'express';
import { Transaction } from '../models/Transaction.js';
import { Stock } from '../models/Stock.js';

const router = express.Router();

// Get user transactions
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { userId, symbol, type, quantity, price } = req.body;
    const transaction = new Transaction({ userId, symbol, type, quantity, price });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

// Get portfolio summary
router.get('/summary/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    
    // Simple aggregator for holdings
    const holdings = {};
    transactions.forEach(t => {
      if (!holdings[t.symbol]) holdings[t.symbol] = { quantity: 0, totalCost: 0 };
      if (t.type === 'buy') {
        holdings[t.symbol].quantity += t.quantity;
        holdings[t.symbol].totalCost += t.quantity * t.price;
      } else {
        holdings[t.symbol].quantity -= t.quantity;
        holdings[t.symbol].totalCost -= t.quantity * t.price; // This is a simplification
      }
    });

    // Remove zeroed holdings
    const activeHoldings = Object.keys(holdings)
      .filter(symbol => holdings[symbol].quantity > 0)
      .map(symbol => ({
        symbol,
        quantity: holdings[symbol].quantity,
        avgPrice: holdings[symbol].totalCost / holdings[symbol].quantity
      }));

    res.json(activeHoldings);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating portfolio' });
  }
});

export default router;
