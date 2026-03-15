// Mock stock data for the platform
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
  aiPrediction: 'bullish' | 'bearish' | 'neutral';
  aiConfidence: number;
  riskRating: 'low' | 'medium' | 'high';
}

export interface PricePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  predicted?: number;
  confidenceHigh?: number;
  confidenceLow?: number;
}

export const watchlistStocks: StockData[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 892.47, change: 24.31, changePercent: 2.80, volume: '42.1M', marketCap: '2.2T', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 87.4, riskRating: 'medium' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 178.72, change: -1.23, changePercent: -0.68, volume: '55.3M', marketCap: '2.8T', sector: 'Technology', aiPrediction: 'neutral', aiConfidence: 62.1, riskRating: 'low' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 248.42, change: 12.87, changePercent: 5.47, volume: '98.7M', marketCap: '789B', sector: 'Automotive', aiPrediction: 'bullish', aiConfidence: 74.2, riskRating: 'high' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.56, change: 3.21, changePercent: 0.78, volume: '22.4M', marketCap: '3.1T', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 81.3, riskRating: 'low' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 185.07, change: -2.45, changePercent: -1.31, volume: '48.2M', marketCap: '1.9T', sector: 'Consumer', aiPrediction: 'bearish', aiConfidence: 58.7, riskRating: 'medium' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 156.89, change: 1.67, changePercent: 1.08, volume: '31.5M', marketCap: '1.9T', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 76.9, riskRating: 'low' },
  { symbol: 'META', name: 'Meta Platforms', price: 502.30, change: 8.92, changePercent: 1.81, volume: '18.9M', marketCap: '1.3T', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 83.1, riskRating: 'medium' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: -0.87, changePercent: -0.44, volume: '9.8M', marketCap: '572B', sector: 'Finance', aiPrediction: 'neutral', aiConfidence: 55.4, riskRating: 'low' },
];

export const sectorHeatmap = [
  { name: 'Technology', change: 2.14, stocks: 156 },
  { name: 'Healthcare', change: -0.87, stocks: 89 },
  { name: 'Finance', change: 0.42, stocks: 112 },
  { name: 'Energy', change: -1.56, stocks: 67 },
  { name: 'Consumer', change: 1.23, stocks: 94 },
  { name: 'Industrial', change: 0.78, stocks: 78 },
  { name: 'Real Estate', change: -0.34, stocks: 45 },
  { name: 'Utilities', change: 0.12, stocks: 34 },
  { name: 'Materials', change: -0.67, stocks: 42 },
  { name: 'Telecom', change: 1.89, stocks: 28 },
  { name: 'Automotive', change: 3.21, stocks: 23 },
  { name: 'Crypto', change: -2.45, stocks: 18 },
];

export const generatePriceHistory = (basePrice: number, days: number = 90): PricePoint[] => {
  const data: PricePoint[] = [];
  let price = basePrice * 0.85;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.48) * basePrice * 0.03;
    price = Math.max(price + volatility, basePrice * 0.6);
    const high = price + Math.random() * basePrice * 0.015;
    const low = price - Math.random() * basePrice * 0.015;
    const isPrediction = i <= 14;

    data.push({
      time: date.toISOString().split('T')[0],
      open: +(price - Math.random() * 2).toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +price.toFixed(2),
      volume: Math.floor(Math.random() * 50000000 + 10000000),
      ...(isPrediction && {
        predicted: +(price + (Math.random() - 0.3) * basePrice * 0.05).toFixed(2),
        confidenceHigh: +(price + basePrice * 0.08).toFixed(2),
        confidenceLow: +(price - basePrice * 0.04).toFixed(2),
      }),
    });
  }
  return data;
};

export const newsItems = [
  { title: 'NVIDIA Announces Next-Gen AI Chips at GTC 2026', sentiment: 'positive' as const, score: 0.92, time: '2h ago', source: 'Reuters' },
  { title: 'Fed Signals Potential Rate Cut in Q2', sentiment: 'positive' as const, score: 0.78, time: '4h ago', source: 'Bloomberg' },
  { title: 'Tesla Recalls 200K Vehicles Over Software Glitch', sentiment: 'negative' as const, score: -0.65, time: '6h ago', source: 'WSJ' },
  { title: 'Apple Vision Pro Sales Below Expectations', sentiment: 'negative' as const, score: -0.43, time: '8h ago', source: 'CNBC' },
  { title: 'Microsoft Azure Revenue Beats Estimates by 12%', sentiment: 'positive' as const, score: 0.85, time: '12h ago', source: 'MarketWatch' },
  { title: 'Oil Prices Surge Amid Middle East Tensions', sentiment: 'negative' as const, score: -0.71, time: '14h ago', source: 'FT' },
];

export const aiInsights = [
  {
    stock: 'NVDA',
    signal: 'bullish' as const,
    confidence: 87.4,
    explanation: 'Strong upward momentum detected. LSTM model identifies positive correlation with AI sector growth. Transformer analysis shows institutional accumulation patterns consistent with pre-breakout behavior.',
    factors: ['Earnings beat +18%', 'AI demand surge', 'Institutional buying', 'RSI recovery from oversold'],
  },
  {
    stock: 'TSLA',
    signal: 'bullish' as const,
    confidence: 74.2,
    explanation: 'GRU model detects recovering momentum after consolidation phase. Volume patterns suggest renewed retail interest. Caution: High volatility risk rating.',
    factors: ['Deliveries up 22% QoQ', 'FSD v13 release', 'Energy division growth'],
  },
  {
    stock: 'AMZN',
    signal: 'bearish' as const,
    confidence: 58.7,
    explanation: 'Weakening momentum in cloud growth metrics. MACD crossover suggests short-term downside. However, low confidence indicates mixed signals across models.',
    factors: ['AWS growth slowing', 'Increased competition', 'Margin pressure'],
  },
];

export const portfolioData = {
  totalValue: 124750.00,
  dailyChange: 1847.32,
  dailyChangePercent: 1.50,
  positions: [
    { symbol: 'NVDA', shares: 25, avgCost: 780.00, currentPrice: 892.47, value: 22311.75 },
    { symbol: 'AAPL', shares: 100, avgCost: 165.00, currentPrice: 178.72, value: 17872.00 },
    { symbol: 'MSFT', shares: 50, avgCost: 380.00, currentPrice: 415.56, value: 20778.00 },
    { symbol: 'GOOGL', shares: 120, avgCost: 142.00, currentPrice: 156.89, value: 18826.80 },
    { symbol: 'META', shares: 40, avgCost: 450.00, currentPrice: 502.30, value: 20092.00 },
  ],
};

export const anomalies = [
  { symbol: 'GME', type: 'Volume Spike', severity: 'high' as const, message: 'Trading volume 340% above 30-day average', time: '15m ago' },
  { symbol: 'AMC', type: 'Price Anomaly', severity: 'medium' as const, message: 'Unusual price movement detected outside Bollinger Bands', time: '32m ago' },
  { symbol: 'RIVN', type: 'Sentiment Shift', severity: 'low' as const, message: 'News sentiment rapidly shifting from neutral to positive', time: '1h ago' },
];

export const crashProbability = {
  overall: 8.2,
  factors: [
    { name: 'VIX Volatility', value: 14.2, status: 'normal' as const },
    { name: 'Yield Curve', value: -0.12, status: 'warning' as const },
    { name: 'Market Breadth', value: 67, status: 'normal' as const },
    { name: 'Put/Call Ratio', value: 0.85, status: 'normal' as const },
    { name: 'Credit Spreads', value: 1.24, status: 'normal' as const },
  ],
};
