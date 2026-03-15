import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const indices = [
  { name: 'S&P 500', value: 5234.18, change: 0.87 },
  { name: 'NASDAQ', value: 16742.39, change: 1.24 },
  { name: 'DOW', value: 39127.14, change: 0.34 },
  { name: 'VIX', value: 14.2, change: -3.21 },
];

const topMovers = [
  { symbol: 'SMCI', change: 12.4 },
  { symbol: 'MSTR', change: 8.7 },
  { symbol: 'PLTR', change: 6.2 },
  { symbol: 'SNAP', change: -9.1 },
  { symbol: 'BYND', change: -7.3 },
];

const MarketSummary: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Market Overview</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {indices.map(idx => (
          <div key={idx.name} className="p-2.5 bg-secondary/50 border border-border/50 rounded-sm">
            <div className="text-meta text-muted-foreground mb-0.5">{idx.name}</div>
            <div className="font-mono text-ui text-foreground">{idx.value.toLocaleString()}</div>
            <div className={`flex items-center gap-0.5 font-mono text-meta ${idx.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {idx.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {idx.change >= 0 ? '+' : ''}{idx.change}%
            </div>
          </div>
        ))}
      </div>

      <div>
        <span className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Top Movers</span>
        <div className="mt-2 space-y-1">
          {topMovers.map(m => (
            <div key={m.symbol} className="flex items-center justify-between py-1">
              <span className="font-mono text-meta font-semibold text-foreground">{m.symbol}</span>
              <span className={`font-mono text-meta ${m.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                {m.change >= 0 ? '+' : ''}{m.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketSummary;
