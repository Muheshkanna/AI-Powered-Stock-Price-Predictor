import express from 'express';
import { Stock } from '../models/Stock.js';

const router = express.Router();

// GET all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error.message || error);
    res.status(500).json({ message: 'Server Error fetching stocks' });
  }
});

// GET top gainers (defined before /:symbol to avoid route shadowing)
router.get('/market/top-gainers', async (req, res) => {
  try {
    const gainers = await Stock.findTopGainers(5);
    res.json(gainers);
  } catch (error) {
    console.error('Error fetching top gainers:', error.message || error);
    res.status(500).json({ message: 'Server Error fetching top gainers' });
  }
});

// GET top losers (defined before /:symbol to avoid route shadowing)
router.get('/market/top-losers', async (req, res) => {
  try {
    const losers = await Stock.findTopLosers(5);
    res.json(losers);
  } catch (error) {
    console.error('Error fetching top losers:', error.message || error);
    res.status(500).json({ message: 'Server Error fetching top losers' });
  }
});

// GET a specific stock by symbol
router.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const stock = await Stock.findBySymbol(symbol);

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json(stock);
  } catch (error) {
    console.error(`Error fetching stock ${req.params.symbol}:`, error.message || error);
    res.status(500).json({ message: 'Server Error fetching stock' });
  }
});

export default router;
