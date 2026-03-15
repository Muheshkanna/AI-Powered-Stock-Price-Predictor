import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3, Brain, AlertTriangle, Search, LogOut, Bell, Briefcase, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { watchlistStocks, sectorHeatmap, newsItems, aiInsights, portfolioData, anomalies, crashProbability, generatePriceHistory } from '@/lib/mockData';
import StockChart from '@/components/dashboard/StockChart';
import WatchlistTable from '@/components/dashboard/WatchlistTable';
import SectorHeatmap from '@/components/dashboard/SectorHeatmap';
import NewsFeed from '@/components/dashboard/NewsFeed';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';
import PortfolioWidget from '@/components/dashboard/PortfolioWidget';
import AnomalyTicker from '@/components/dashboard/AnomalyTicker';
import CrashIndicator from '@/components/dashboard/CrashIndicator';
import MarketSummary from '@/components/dashboard/MarketSummary';

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};
const fadeIn = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as const } },
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedStock, setSelectedStock] = React.useState(watchlistStocks[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const priceHistory = React.useMemo(() => generatePriceHistory(selectedStock.price), [selectedStock.symbol]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-mono text-ui font-semibold tracking-wider text-foreground">AETHELGARD</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search ticker... (⌘K)"
              maxLength={20}
              className="h-8 w-64 pl-8 pr-3 bg-secondary border border-border rounded-sm text-meta text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-meta font-mono text-muted-foreground">{user?.email}</span>
          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 h-7 px-2.5 bg-secondary border border-border rounded-sm text-meta text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Anomaly ticker tape */}
      <AnomalyTicker anomalies={anomalies} />

      {/* Main grid */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="p-2 grid grid-cols-12 gap-px bg-border"
      >
        {/* Main chart area */}
        <motion.div variants={fadeIn} className="col-span-8 row-span-2 bg-card p-4 rounded-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h2 className="font-mono text-lg font-semibold text-foreground">{selectedStock.symbol}</h2>
              <span className="text-meta text-muted-foreground">{selectedStock.name}</span>
              <span className={`font-mono text-ui ${selectedStock.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                ${selectedStock.price.toFixed(2)} {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-meta font-mono text-primary">
                <Brain className="w-3.5 h-3.5" />
                AI Forecast ON
              </span>
            </div>
          </div>
          <StockChart data={priceHistory} />
        </motion.div>

        {/* Market Summary */}
        <motion.div variants={fadeIn} className="col-span-4 bg-card p-4 rounded-sm">
          <MarketSummary />
        </motion.div>

        {/* AI Insight */}
        <motion.div variants={fadeIn} className="col-span-4 bg-card p-4 rounded-sm">
          <AIInsightPanel insights={aiInsights} />
        </motion.div>

        {/* Watchlist */}
        <motion.div variants={fadeIn} className="col-span-5 bg-card p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Watchlist</h3>
          </div>
          <WatchlistTable stocks={watchlistStocks} onSelect={setSelectedStock} selectedSymbol={selectedStock.symbol} />
        </motion.div>

        {/* Portfolio */}
        <motion.div variants={fadeIn} className="col-span-3 bg-card p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Portfolio</h3>
          </div>
          <PortfolioWidget data={portfolioData} />
        </motion.div>

        {/* Crash Indicator */}
        <motion.div variants={fadeIn} className="col-span-4 bg-card p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Risk Monitor</h3>
          </div>
          <CrashIndicator data={crashProbability} />
        </motion.div>

        {/* Sector Heatmap */}
        <motion.div variants={fadeIn} className="col-span-4 bg-card p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Sector Heatmap</h3>
          </div>
          <SectorHeatmap sectors={sectorHeatmap} />
        </motion.div>

        {/* News */}
        <motion.div variants={fadeIn} className="col-span-4 bg-card p-4 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">News Sentiment</h3>
          </div>
          <NewsFeed news={newsItems} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
