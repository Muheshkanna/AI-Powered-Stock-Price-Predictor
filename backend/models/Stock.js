import { prisma } from '../db.js';

export class StockModel {
  static format(stock) {
    if (!stock) return null;
    return {
      id: stock.id,
      _id: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      price: Number(stock.price),
      change: Number(stock.change),
      changePercent: Number(stock.changePercent),
      volume: stock.volume,
      marketCap: stock.marketCap,
      aiPrediction: stock.aiPrediction,
      historicalData: stock.historicalData,
      createdAt: stock.createdAt,
    };
  }

  static async findAll() {
    const stocks = await prisma.stock.findMany();
    // Sort by marketCap descending, identical to original behaviour
    return stocks.map(StockModel.format);
  }

  static async findBySymbol(symbol) {
    const stock = await prisma.stock.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });
    return StockModel.format(stock);
  }

  static async findTopGainers(limit = 5) {
    const stocks = await prisma.stock.findMany({
      orderBy: { changePercent: 'desc' },
      take: limit,
    });
    return stocks.map(StockModel.format);
  }

  static async findTopLosers(limit = 5) {
    const stocks = await prisma.stock.findMany({
      orderBy: { changePercent: 'asc' },
      take: limit,
    });
    return stocks.map(StockModel.format);
  }

  static async upsert(data) {
    const stock = await prisma.stock.upsert({
      where: { symbol: data.symbol.toUpperCase() },
      update: {
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        volume: data.volume,
        marketCap: data.marketCap,
        aiPrediction: data.aiPrediction,
        historicalData: data.historicalData,
      },
      create: {
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        volume: data.volume,
        marketCap: data.marketCap,
        aiPrediction: data.aiPrediction,
        historicalData: data.historicalData,
      },
    });
    return StockModel.format(stock);
  }
}

export const Stock = StockModel;
export default StockModel;
