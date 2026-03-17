import { StockData } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Minus, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WatchlistTableProps {
  stocks: StockData[];
  onSelect: (stock: StockData) => void;
  selectedSymbol: string;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ stocks, onSelect, selectedSymbol }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-auto max-h-[280px]">
      <table className="w-full text-meta">
        <thead>
          <tr className="text-muted-foreground font-mono uppercase tracking-wider border-b border-border">
            <th className="text-left py-2 pr-2">Symbol</th>
            <th className="text-right py-2 px-2">Price</th>
            <th className="text-right py-2 px-2">Change</th>
            <th className="text-right py-2 px-2">Vol</th>
            <th className="text-center py-2 pl-2">AI</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr
              key={stock.symbol}
              onClick={() => {
                onSelect(stock);
                navigate(`/stock/${stock.symbol}`);
              }}
              className={`cursor-pointer border-b border-border/50 transition-colors ${
                selectedSymbol === stock.symbol ? 'bg-primary/10' : 'hover:bg-secondary/50'
              }`}
            >
              <td className="py-2 pr-2">
                <div>
                  <span className="font-mono font-semibold text-foreground">{stock.symbol}</span>
                  <p className="text-muted-foreground truncate max-w-[100px]">{stock.name}</p>
                </div>
              </td>
              <td className="text-right py-2 px-2 font-mono text-foreground">${stock.price.toFixed(2)}</td>
              <td className={`text-right py-2 px-2 font-mono ${stock.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                <div className="flex items-center justify-end gap-1">
                  {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
              </td>
              <td className="text-right py-2 px-2 font-mono text-muted-foreground">{stock.volume}</td>
              <td className="text-center py-2 pl-2">
                <div className="flex items-center justify-center">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-meta font-mono ${
                    stock.aiPrediction === 'bullish' ? 'bg-bullish/10 text-bullish' :
                    stock.aiPrediction === 'bearish' ? 'bg-bearish/10 text-bearish' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Brain className="w-3 h-3" />
                    {stock.aiConfidence.toFixed(0)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WatchlistTable;
