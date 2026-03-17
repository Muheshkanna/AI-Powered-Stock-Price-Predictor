import mongoose from 'mongoose';
import { Stock } from './models/Stock.js';
import dotenv from 'dotenv';
dotenv.config();

// Generate some realistic looking mock chart data
const generateChartData = (startPrice, volatility, numPoints = 100) => {
  const data = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = numPoints; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const changePercent = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + changePercent);
    
    data.push({
      time: time,
      value: parseFloat(currentPrice.toFixed(2))
    });
  }
  return data;
};

const seedData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 185.92,
    change: 2.34,
    changePercent: 1.27,
    volume: '52.4M',
    marketCap: '2.9T',
    aiPrediction: { trend: 'bullish', confidence: 85, targetPrice: 200.00 },
    historicalData: generateChartData(150, 0.02)
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 412.32,
    change: -1.23,
    changePercent: -0.30,
    volume: '22.1M',
    marketCap: '3.1T',
    aiPrediction: { trend: 'neutral', confidence: 60, targetPrice: 420.00 },
    historicalData: generateChartData(350, 0.015)
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 890.54,
    change: 45.67,
    changePercent: 5.41,
    volume: '65.2M',
    marketCap: '2.2T',
    aiPrediction: { trend: 'bullish', confidence: 92, targetPrice: 1000.00 },
    historicalData: generateChartData(500, 0.04)
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 175.22,
    change: -5.41,
    changePercent: -3.00,
    volume: '95.4M',
    marketCap: '550B',
    aiPrediction: { trend: 'bearish', confidence: 75, targetPrice: 150.00 },
    historicalData: generateChartData(250, 0.05)
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.15,
    change: 1.05,
    changePercent: 0.59,
    volume: '40.6M',
    marketCap: '1.8T',
    aiPrediction: { trend: 'bullish', confidence: 80, targetPrice: 195.00 },
    historicalData: generateChartData(130, 0.02)
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    price: 502.50,
    change: 12.30,
    changePercent: 2.51,
    volume: '15.9M',
    marketCap: '1.3T',
    aiPrediction: { trend: 'bullish', confidence: 88, targetPrice: 550.00 },
    historicalData: generateChartData(300, 0.03)
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 155.60,
    change: -0.80,
    changePercent: -0.51,
    volume: '25.3M',
    marketCap: '1.9T',
    aiPrediction: { trend: 'neutral', confidence: 65, targetPrice: 165.00 },
    historicalData: generateChartData(120, 0.02)
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 68500.40,
    change: 2500.20,
    changePercent: 3.78,
    volume: '45.2B',
    marketCap: '1.3T',
    aiPrediction: { trend: 'bullish', confidence: 78, targetPrice: 75000.00 },
    historicalData: generateChartData(40000, 0.06)
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3850.10,
    change: -50.25,
    changePercent: -1.28,
    volume: '20.1B',
    marketCap: '460B',
    aiPrediction: { trend: 'neutral', confidence: 55, targetPrice: 4000.00 },
    historicalData: generateChartData(2000, 0.07)
  }
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_finance_app';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Stock.deleteMany({});
    console.log('Cleared existing stocks data');

    // Insert seeded data
    await Stock.insertMany(seedData);
    console.log(`Successfully seeded ${seedData.length} stocks into the database`);
    
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
