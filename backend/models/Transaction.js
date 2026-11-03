import { prisma } from '../db.js';

export class TransactionModel {
  static format(tx) {
    if (!tx) return null;
    return {
      id: tx.id,
      _id: tx.id,
      userId: tx.userId,
      symbol: tx.symbol,
      type: tx.type,
      quantity: Number(tx.quantity),
      price: Number(tx.price),
      timestamp: tx.timestamp,
    };
  }

  static async findByUserId(userId) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
    return transactions.map(TransactionModel.format);
  }

  static async create({ userId, symbol, type, quantity, price, timestamp }) {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        symbol: symbol.toUpperCase(),
        type: type.toLowerCase(),
        quantity,
        price,
        ...(timestamp ? { timestamp: new Date(timestamp) } : {}),
      },
    });
    return TransactionModel.format(transaction);
  }

  static async getPortfolioSummary(userId) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    const holdings = {};
    for (const t of transactions) {
      const symbol = t.symbol;
      const qty = Number(t.quantity);
      const prc = Number(t.price);

      if (!holdings[symbol]) {
        holdings[symbol] = { quantity: 0, totalCost: 0 };
      }

      if (t.type === 'buy') {
        holdings[symbol].quantity += qty;
        holdings[symbol].totalCost += qty * prc;
      } else {
        holdings[symbol].quantity -= qty;
        holdings[symbol].totalCost -= qty * prc;
      }
    }

    return Object.keys(holdings)
      .filter((symbol) => holdings[symbol].quantity > 0)
      .map((symbol) => ({
        symbol,
        quantity: holdings[symbol].quantity,
        avgPrice: holdings[symbol].quantity > 0 ? holdings[symbol].totalCost / holdings[symbol].quantity : 0,
      }));
  }
}

export const Transaction = TransactionModel;
export default TransactionModel;
