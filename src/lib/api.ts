import { StockData, PricePoint } from './mockData'; // to reuse the types

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchStocks = async (): Promise<StockData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks`);
    if (!response.ok) throw new Error('Failed to fetch stocks');
    const data = await response.json();
    return data.map((stock: any) => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      volume: stock.volume,
      marketCap: stock.marketCap,
      sector: 'Technology', // Default or could add to backend
      aiPrediction: stock.aiPrediction?.trend || 'neutral',
      aiConfidence: stock.aiPrediction?.confidence || 50,
      riskRating: 'medium', // Mock
      rawHistory: stock.historicalData,
    }));
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

export const fetchTopGainers = async (): Promise<StockData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/market/top-gainers`);
    if (!response.ok) throw new Error('Failed to fetch gainers');
    const data = await response.json();
    return data.map((stock: any) => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      aiPrediction: stock.aiPrediction?.trend || 'neutral',
    }));
  } catch (error) {
    return [];
  }
};

export const fetchTopLosers = async (): Promise<StockData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/market/top-losers`);
    if (!response.ok) throw new Error('Failed to fetch losers');
    const data = await response.json();
    return data.map((stock: any) => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      aiPrediction: stock.aiPrediction?.trend || 'neutral',
    }));
  } catch (error) {
    return [];
  }
};

// Map backend history format to frontend PricePoint format for Recharts
export const formatHistoryToPricePoints = (rawHistory: any[], currentPrice: number): PricePoint[] => {
  if (!rawHistory) return [];
  
  // Create prediction tail
  const mapped = rawHistory.map((point: any, index: number) => {
    const isPrediction = index >= rawHistory.length - 15;
    const val = point.value;
    return {
      time: point.time,
      open: val,
      high: val * 1.01,
      low: val * 0.99,
      close: val,
      volume: 1000000,
      ...(isPrediction && {
        predicted: val * 1.02,
        confidenceHigh: val * 1.05,
        confidenceLow: val * 0.95,
      })
    };
  });
  return mapped;
};

export const loginUser = async (email: string, password: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const signupUser = async (name: string, email: string, password: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Signup failed');
  return data;
};

export const fetchTransactions = async (userId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

export const fetchPortfolioSummary = async (userId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/summary/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch portfolio summary');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

export const createTransaction = async (txData: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Transaction failed');
  return data;
};
