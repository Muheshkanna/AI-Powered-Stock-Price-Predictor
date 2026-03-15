import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsItem {
  title: string;
  sentiment: 'positive' | 'negative';
  score: number;
  time: string;
  source: string;
}

const NewsFeed: React.FC<{ news: NewsItem[] }> = ({ news }) => {
  return (
    <div className="space-y-2 max-h-[280px] overflow-auto">
      {news.map((item, i) => (
        <div key={i} className="p-2.5 bg-secondary/50 border border-border/50 rounded-sm hover:bg-secondary transition-colors cursor-pointer">
          <div className="flex items-start justify-between gap-2">
            <p className="text-ui text-foreground leading-snug flex-1">{item.title}</p>
            <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-meta font-mono ${
              item.sentiment === 'positive' ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'
            }`}>
              {item.sentiment === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-meta text-muted-foreground font-mono">
            <span>{item.source}</span>
            <span>·</span>
            <span>{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
