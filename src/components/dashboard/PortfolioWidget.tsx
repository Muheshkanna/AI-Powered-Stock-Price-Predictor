import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioData {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  positions: { symbol: string; shares: number; avgCost: number; currentPrice: number; value: number }[];
}

const PortfolioWidget: React.FC<{ data: PortfolioData }> = ({ data }) => {
  return (
    <div>
      <div className="mb-3">
        <div className="font-mono text-xl font-semibold text-foreground">${data.totalValue.toLocaleString()}</div>
        <div className={`flex items-center gap-1 font-mono text-meta ${data.dailyChange >= 0 ? 'text-bullish' : 'text-bearish'}`}>
          {data.dailyChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {data.dailyChange >= 0 ? '+' : ''}${data.dailyChange.toFixed(2)} ({data.dailyChangePercent.toFixed(2)}%) today
        </div>
      </div>
      <div className="space-y-1.5 max-h-[200px] overflow-auto">
        {data.positions.map(pos => {
          const pnl = (pos.currentPrice - pos.avgCost) * pos.shares;
          const pnlPercent = ((pos.currentPrice - pos.avgCost) / pos.avgCost) * 100;
          return (
            <div key={pos.symbol} className="flex items-center justify-between py-1.5 border-b border-border/50">
              <div>
                <span className="font-mono text-ui font-semibold text-foreground">{pos.symbol}</span>
                <span className="text-meta text-muted-foreground ml-2">{pos.shares} shares</span>
              </div>
              <div className="text-right">
                <div className="font-mono text-meta text-foreground">${pos.value.toLocaleString()}</div>
                <div className={`font-mono text-meta ${pnl >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioWidget;
