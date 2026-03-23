import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Target, Zap, Globe, MessageSquare, Share2, ArrowLeft } from 'lucide-react';
import { newsItems } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const NewsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="font-semibold text-lg">Market Intelligence</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">News & Sentiment Analysis</h1>
          <p className="text-muted-foreground mt-1">Real-time global news sentiment and market impact</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main News Feed */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {newsItems.map((item, i) => (
              <motion.article
                key={item.id}
                onClick={() => navigate(`/news/${item.id}`)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group p-5 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg ${
                    item.sentiment === 'positive' ? 'bg-bullish/10 text-bullish' : 
                    item.sentiment === 'negative' ? 'bg-bearish/10 text-bearish' : 
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {item.sentiment.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                  <div className="h-1 w-1 bg-border rounded-full" />
                  <span className="text-xs text-primary font-medium">{item.source}</span>
                </div>

                <h2 className="text-lg font-semibold mb-2 leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Global markets are reacting strongly to this development. Analysts suggest that the immediate impact on related sectors could be significant over the next 48 hours.
                </p>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Zap className="w-3 h-3" /> IMPACT: HIGH</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MessageSquare className="w-3 h-3" /> 12 COMMENTS</span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Market Pulse</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Index Volatility</span><span className="font-mono text-bearish font-semibold">18.4 +2.5%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Sentiment Score</span><span className="font-mono text-bullish font-semibold">62/100</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Volume Index</span><span className="font-mono text-primary font-semibold">1.2x Avg</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Global Events</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 border-l-2 border-primary bg-primary/5 rounded-r-xl">
                  <span className="text-xs text-primary block font-semibold mb-1">LIVE</span>
                  <p className="text-sm leading-tight">European Central Bank interest rate decision in 2 hours.</p>
                </div>
                <div className="p-3 border-l-2 border-border bg-secondary/20 rounded-r-xl">
                  <span className="text-xs text-muted-foreground block font-semibold mb-1">UPCOMING</span>
                  <p className="text-sm leading-tight opacity-75">US Tech Sector earnings reports released after market close.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
