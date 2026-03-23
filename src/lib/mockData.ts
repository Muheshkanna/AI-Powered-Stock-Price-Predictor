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
  { symbol: 'NFLX', name: 'Netflix Inc', price: 625.12, change: 15.42, changePercent: 2.53, volume: '4.2M', marketCap: '270B', sector: 'Consumer', aiPrediction: 'bullish', aiConfidence: 82.1, riskRating: 'medium' },
  { symbol: 'ADBE', name: 'Adobe Inc', price: 512.45, change: -4.21, changePercent: -0.81, volume: '2.8M', marketCap: '230B', sector: 'Technology', aiPrediction: 'neutral', aiConfidence: 61.5, riskRating: 'low' },
  { symbol: 'PYPL', name: 'PayPal Holdings', price: 64.32, change: 1.25, changePercent: 1.98, volume: '12.4M', marketCap: '70B', sector: 'Finance', aiPrediction: 'bullish', aiConfidence: 71.2, riskRating: 'medium' },
  { symbol: 'INTC', name: 'Intel Corp', price: 42.15, change: -0.54, changePercent: -1.26, volume: '35.2M', marketCap: '178B', sector: 'Technology', aiPrediction: 'bearish', aiConfidence: 68.4, riskRating: 'medium' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 181.24, change: 5.67, changePercent: 3.23, volume: '58.1M', marketCap: '292B', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 79.8, riskRating: 'high' },
  { symbol: 'CSCO', name: 'Cisco Systems', price: 48.76, change: 0.32, changePercent: 0.66, volume: '15.7M', marketCap: '198B', sector: 'Technology', aiPrediction: 'neutral', aiConfidence: 52.4, riskRating: 'low' },
  { symbol: 'PEP', name: 'PepsiCo Inc', price: 172.45, change: 1.12, changePercent: 0.65, volume: '4.5M', marketCap: '236B', sector: 'Consumer', aiPrediction: 'bullish', aiConfidence: 74.2, riskRating: 'low' },
  { symbol: 'KO', name: 'Coca-Cola Co', price: 61.23, change: 0.45, changePercent: 0.74, volume: '11.2M', marketCap: '265B', sector: 'Consumer', aiPrediction: 'neutral', aiConfidence: 58.9, riskRating: 'low' },
  { symbol: 'WMT', name: 'Walmart Inc', price: 60.12, change: -0.23, changePercent: -0.38, volume: '14.8M', marketCap: '484B', sector: 'Consumer', aiPrediction: 'bullish', aiConfidence: 72.1, riskRating: 'low' },
  { symbol: 'DIS', name: 'Walt Disney Co', price: 112.56, change: 2.34, changePercent: 2.12, volume: '8.9M', marketCap: '206B', sector: 'Consumer', aiPrediction: 'bullish', aiConfidence: 76.5, riskRating: 'medium' },
  { symbol: 'V', name: 'Visa Inc', price: 282.45, change: 3.12, changePercent: 1.12, volume: '6.2M', marketCap: '580B', sector: 'Finance', aiPrediction: 'bullish', aiConfidence: 84.3, riskRating: 'low' },
  { symbol: 'MA', name: 'Mastercard Inc', price: 475.32, change: 4.56, changePercent: 0.97, volume: '2.5M', marketCap: '445B', sector: 'Finance', aiPrediction: 'bullish', aiConfidence: 81.7, riskRating: 'low' },
  { symbol: 'CRM', name: 'Salesforce Inc', price: 301.24, change: 5.67, changePercent: 1.92, volume: '5.2M', marketCap: '292B', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 78.4, riskRating: 'medium' },
  { symbol: 'AVGO', name: 'Broadcom Inc', price: 1245.32, change: 12.45, changePercent: 1.01, volume: '2.1M', marketCap: '580B', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 85.2, riskRating: 'low' },
  { symbol: 'COST', name: 'Costco Wholesale', price: 725.45, change: -3.21, changePercent: -0.44, volume: '2.8M', marketCap: '320B', sector: 'Consumer', aiPrediction: 'neutral', aiConfidence: 64.1, riskRating: 'low' },
  { symbol: 'ORCL', name: 'Oracle Corp', price: 125.67, change: 2.34, changePercent: 1.90, volume: '12.4M', marketCap: '345B', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 72.8, riskRating: 'medium' },
  { symbol: 'TMUS', name: 'T-Mobile US', price: 162.45, change: 0.87, changePercent: 0.54, volume: '4.2M', marketCap: '192B', sector: 'Telecom', aiPrediction: 'neutral', aiConfidence: 58.2, riskRating: 'low' },
  { symbol: 'CAT', name: 'Caterpillar Inc', price: 342.12, change: -4.56, changePercent: -1.31, volume: '3.1M', marketCap: '172B', sector: 'Industrial', aiPrediction: 'bearish', aiConfidence: 65.4, riskRating: 'medium' },
  { symbol: 'IBM', name: 'IBM Corp', price: 192.34, change: 1.23, changePercent: 0.64, volume: '4.8M', marketCap: '175B', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 69.1, riskRating: 'low' },
  { symbol: 'GE', name: 'GE Aerospace', price: 158.76, change: 3.42, changePercent: 2.20, volume: '8.2M', marketCap: '170B', sector: 'Industrial', aiPrediction: 'bullish', aiConfidence: 81.5, riskRating: 'medium' },
  { symbol: 'UBER', name: 'Uber Technologies', price: 78.42, change: 2.12, changePercent: 2.78, volume: '22.4M', marketCap: '162B', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 76.4, riskRating: 'high' },
  { symbol: 'ABNB', name: 'Airbnb Inc', price: 162.34, change: -2.34, changePercent: -1.42, volume: '5.8M', marketCap: '102B', sector: 'Consumer', aiPrediction: 'bearish', aiConfidence: 62.7, riskRating: 'medium' },
  { symbol: 'SHOP', name: 'Shopify Inc', price: 78.12, change: 3.45, changePercent: 4.62, volume: '12.8M', marketCap: '100B', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 84.2, riskRating: 'high' },
  { symbol: 'SQ', name: 'Block Inc', price: 82.45, change: 1.67, changePercent: 2.07, volume: '8.4M', marketCap: '50B', sector: 'Finance', aiPrediction: 'bullish', aiConfidence: 71.5, riskRating: 'high' },
  { symbol: 'PYPL', name: 'PayPal Holdings', price: 64.32, change: 1.25, changePercent: 1.98, volume: '12.4M', marketCap: '70B', sector: 'Finance', aiPrediction: 'bullish', aiConfidence: 71.2, riskRating: 'medium' },
  { symbol: 'SNAP', name: 'Snap Inc', price: 11.23, change: -0.45, changePercent: -3.85, volume: '35.2M', marketCap: '18B', sector: 'Technology', aiPrediction: 'bearish', aiConfidence: 78.2, riskRating: 'high' },
  { symbol: 'PINS', name: 'Pinterest Inc', price: 34.56, change: 0.78, changePercent: 2.31, volume: '11.4M', marketCap: '23B', sector: 'Technology', aiPrediction: 'bullish', aiConfidence: 68.4, riskRating: 'medium' },
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
  { id: '1', title: 'NVIDIA Announces Next-Gen AI Chips at GTC 2026', sentiment: 'positive' as const, score: 0.92, time: '2h ago', source: 'Reuters', content: 'NVIDIA CEO Jensen Huang unveiled the new "Rubin" architecture today, promising a 3x leap in AI training efficiency. The chips are expected to ship late 2026, solidifying NVIDIA\'s lead in the AI hardware market.' },
  { id: '2', title: 'Fed Signals Potential Rate Cut in Q2', sentiment: 'positive' as const, score: 0.78, time: '4h ago', source: 'Bloomberg', content: 'The Federal Reserve hinted at a more dovish stance in its latest meeting minutes. Jerome Powell noted that inflation is cooling faster than anticipated, opening the door for a 25bps cut in June.' },
  { id: '3', title: 'Tesla Recalls 200K Vehicles Over Software Glitch', sentiment: 'negative' as const, score: -0.65, time: '6h ago', source: 'WSJ', content: 'Tesla is issuing a voluntary recall for Model 3 and Model Y vehicles produced between 2023 and 2024. The issue relates to a rearview camera delay, which will be fixed via an over-the-air (OTA) update.' },
  { id: '4', title: 'Apple Vision Pro Sales Below Expectations', sentiment: 'negative' as const, score: -0.43, time: '8h ago', source: 'CNBC', content: 'Supply chain reports suggest Apple has cut production targets for the Vision Pro by 40%. Consumer interest in the high-end spatial computing headset appears to be waning at the $3,499 price point.' },
  { id: '5', title: 'Microsoft Azure Revenue Beats Estimates by 12%', sentiment: 'positive' as const, score: 0.85, time: '12h ago', source: 'MarketWatch', content: 'Microsoft reported stellar Q3 earnings, driven by a 31% surge in Azure cloud revenue. The integration of OpenAI\'s models into the cloud platform has boosted enterprise adoption significantly.' },
  { id: '6', title: 'Oil Prices Surge Amid Middle East Tensions', sentiment: 'negative' as const, score: -0.71, time: '14h ago', source: 'FT', content: 'Brent Crude climbed to $92 per barrel this morning following renewed geopolitical instability. Analysts warn that sustained high energy costs could reignite inflationary pressures globally.' },
  { id: '7', title: 'JP Morgan CEO Warns of "Sticky" Inflation', sentiment: 'neutral' as const, score: 0.12, time: '16h ago', source: 'CNBC', content: 'Jamie Dimon expressed caution regarding the market\'s optimism for rate cuts. He cited government spending and the green energy transition as long-term inflationary drivers.' },
  { id: '8', title: 'Disney to Invest $30B in Theme Parks Expansion', sentiment: 'positive' as const, score: 0.64, time: '1d ago', source: 'Reuters', content: 'The Walt Disney Company announced a massive 10-year investment plan for its global theme parks. This includes new lands themed around "Frozen" and "Zootopia" in various international locations.' },
  { id: '9', title: 'Google Unveils Gemini 2.0 Real-Time Assistant', sentiment: 'positive' as const, score: 0.88, time: '1d ago', source: 'The Verge', content: 'Google I/O 2026 showcased the next evolution of AI. Gemini 2.0 can now process multi-modal inputs in millisecond latency, bringing it closer to true human-like interaction.' },
  { id: '10', title: 'Meta Announces First Dividend for Shareholders', sentiment: 'positive' as const, score: 0.95, time: '2d ago', source: 'Bloomberg', content: 'Mark Zuckerberg declared a quarterly dividend of $0.50 per share, a milestone for the social media giant. This move signals Meta\'s transition into a mature, cash-generating powerhouse.' },
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
