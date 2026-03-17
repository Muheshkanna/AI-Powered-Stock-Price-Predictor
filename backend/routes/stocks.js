import express from 'express';
import { Stock } from '../models/Stock.js';

const router = express.Router();

// GET all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ marketCap: -1 });
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET a specific stock by symbol
router.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const stock = await Stock.findOne({ symbol });
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    res.json(stock);
  } catch (error) {
    console.error(`Error fetching stock ${req.params.symbol}:`, error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET top gainers
router.get('/market/top-gainers', async (req, res) => {
  try {
    const gainers = await Stock.find().sort({ changePercent: -1 }).limit(5);
    res.json(gainers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET top losers
router.get('/market/top-losers', async (req, res) => {
  try {
    const losers = await Stock.find().sort({ changePercent: 1 }).limit(5);
    res.json(losers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
