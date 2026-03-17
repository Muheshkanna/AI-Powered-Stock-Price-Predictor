import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { fetchTopGainers, fetchTopLosers } from '@/lib/api';
import { StockData } from '@/lib/mockData';

const TopMovers: React.FC = () => {
  const [gainers, setGainers] = React.useState<StockData[]>([]);
  const [losers, setLosers] = React.useState<StockData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadMovers = async () => {
      setLoading(true);
      const [gData, lData] = await Promise.all([fetchTopGainers(), fetchTopLosers()]);
      setGainers(gData);
      setLosers(lData);
      setLoading(false);
    };
    loadMovers();
  }, []);

  return (
    <div className="w-full flex gap-4 mt-2">
      {/* Top Gainers */}
      <div className="flex-1 bg-card border border-border/50 rounded-sm p-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-bullish/5 blur-3xl rounded-full" />
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-bullish/10">
              <TrendingUp className="w-4 h-4 text-bullish" />
            </div>
            <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Top Gainers</h3>
          </div>
          {loading && <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin" />}
        </div>
        <div className="space-y-2 relative z-10">
          {gainers.slice(0, 3).map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-sm bg-background/50 hover:bg-secondary transition-colors border border-transparent hover:border-border/50 group cursor-default">
              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold text-foreground group-hover:text-bullish transition-colors">{stock.symbol}</span>
                <span className="text-meta text-muted-foreground truncate w-24 hidden lg:inline-block">{stock.name}</span>
              </div>
              <div className="text-right">
                <div className="font-mono text-ui">${stock.price.toFixed(2)}</div>
                <div className="font-mono text-meta text-bullish">+{stock.changePercent.toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="flex-1 bg-card border border-border/50 rounded-sm p-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-bearish/5 blur-3xl rounded-full" />
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-bearish/10">
              <TrendingDown className="w-4 h-4 text-bearish" />
            </div>
            <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Top Losers</h3>
          </div>
          {loading && <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin" />}
        </div>
        <div className="space-y-2 relative z-10">
          {losers.slice(0, 3).map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-sm bg-background/50 hover:bg-secondary transition-colors border border-transparent hover:border-border/50 group cursor-default">
              <div className="flex items-center gap-3">
                <span className="font-mono font-semibold text-foreground group-hover:text-bearish transition-colors">{stock.symbol}</span>
                <span className="text-meta text-muted-foreground truncate w-24 hidden lg:inline-block">{stock.name}</span>
              </div>
              <div className="text-right">
                <div className="font-mono text-ui">${stock.price.toFixed(2)}</div>
                <div className="font-mono text-meta text-bearish">{stock.changePercent.toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;
