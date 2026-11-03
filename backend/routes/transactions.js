import express from 'express';
import { Transaction } from '../models/Transaction.js';

const router = express.Router();

// GET portfolio summary (defined before /:userId so "summary" is not caught as a userId)
router.get('/summary/:userId', async (req, res) => {
  try {
    const summary = await Transaction.getPortfolioSummary(req.params.userId);
    res.json(summary);
  } catch (error) {
    console.error('Error calculating portfolio summary:', error.message || error);
    res.status(500).json({ message: 'Error calculating portfolio' });
  }
});

// GET user transactions
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.findByUserId(req.params.userId);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message || error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// POST create new transaction
router.post('/', async (req, res) => {
  try {
    const { userId, symbol, type, quantity, price } = req.body;

    if (!userId || !symbol || !type || quantity == null || price == null) {
      return res.status(400).json({ message: 'userId, symbol, type, quantity, and price are required' });
    }

    const transaction = await Transaction.create({
      userId,
      symbol,
      type,
      quantity: Number(quantity),
      price: Number(price),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error.message || error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

export default router;
