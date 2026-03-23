import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  time: string;
  source: string;
  content?: string;
}

const NewsFeed: React.FC<{ news: NewsItem[] }> = ({ news }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 max-h-[400px] overflow-auto pr-2 scrollbar-thin">
      {news.map((item) => (
        <div 
          key={item.id} 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/news/${item.id}`);
          }}
          className="p-3.5 bg-secondary/30 border border-border/50 rounded-xl hover:bg-secondary/60 transition-all cursor-pointer group hover:border-primary/30"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-foreground leading-snug flex-1 group-hover:text-primary transition-colors">{item.title}</p>
            <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-transform duration-300 group-hover:scale-105 ${
              item.sentiment === 'positive' ? 'bg-bullish/10 text-bullish' : 
              item.sentiment === 'negative' ? 'bg-bearish/10 text-bearish' : 
              'bg-muted/10 text-muted-foreground'
            }`}>
              {item.sentiment === 'positive' ? <TrendingUp className="w-3 h-3" /> : 
               item.sentiment === 'negative' ? <TrendingDown className="w-3 h-3" /> : 
               <Minus className="w-3 h-3" />}
              {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            <span className="text-primary/70">{item.source}</span>
            <span className="opacity-30">·</span>
            <span>{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
