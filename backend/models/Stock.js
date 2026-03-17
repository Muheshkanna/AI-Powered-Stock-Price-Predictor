import mongoose from 'mongoose';

const dataPointSchema = new mongoose.Schema({
  time: { type: String, required: true },
  value: { type: Number, required: true }
}, { _id: false });

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, required: true },
  changePercent: { type: Number, required: true },
  volume: { type: String, required: true },
  marketCap: { type: String, required: true },
  aiPrediction: {
    trend: { type: String, enum: ['bullish', 'bearish', 'neutral'], required: true },
    confidence: { type: Number, required: true },
    targetPrice: { type: Number, required: true }
  },
  historicalData: [dataPointSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Stock = mongoose.model('Stock', stockSchema);
