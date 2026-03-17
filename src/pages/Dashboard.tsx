import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, BarChart3, Brain,
  AlertTriangle, Search, LogOut, Briefcase, Zap, Newspaper,
  ArrowRight, DollarSign, PieChart, Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchStocks, formatHistoryToPricePoints } from '@/lib/api';
import {
  watchlistStocks, sectorHeatmap, newsItems, aiInsights,
  portfolioData, crashProbability, generatePriceHistory
} from '@/lib/mockData';
import StockChart from '@/components/dashboard/StockChart';
import WatchlistTable from '@/components/dashboard/WatchlistTable';
import SectorHeatmap from '@/components/dashboard/SectorHeatmap';
import NewsFeed from '@/components/dashboard/NewsFeed';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';
import PortfolioWidget from '@/components/dashboard/PortfolioWidget';
import CrashIndicator from '@/components/dashboard/CrashIndicator';
import TopMovers from '@/components/dashboard/TopMovers';
import ThemeToggle from '@/components/ThemeToggle';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/* Greeting helper */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/* Market indices mock */
const indices = [
  { name: 'S&P 500', value: '5,234.18', change: +0.87 },
  { name: 'NASDAQ', value: '16,742', change: +1.24 },
  { name: 'DOW', value: '39,127', change: +0.34 },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = React.useState(watchlistStocks);
  const [selectedStock, setSelectedStock] = React.useState(watchlistStocks[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      const fetchedStocks = await fetchStocks();
      if (fetchedStocks && fetchedStocks.length > 0) {
        setStocks(fetchedStocks);
        setSelectedStock(fetchedStocks[0]);
      }
    };
    loadData();
  }, []);

  const priceHistory = React.useMemo(() => {
    if ((selectedStock as any).rawHistory) {
      return formatHistoryToPricePoints((selectedStock as any).rawHistory, selectedStock.price);
    }
    return generatePriceHistory(selectedStock.price);
  }, [selectedStock.symbol, selectedStock]);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════ HEADER ═══════════ */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-foreground">Insight<span className="text-primary">AI</span></span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowSearch(e.target.value.length > 0); }}
                onFocus={() => setShowSearch(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                placeholder="Search stocks, e.g. AAPL, Tesla..."
                maxLength={30}
                className="h-9 w-80 pl-10 pr-4 bg-secondary/60 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              {showSearch && (
                <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 py-2 overflow-hidden">
                  {stocks
                    .filter(s => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 6)
                    .map(s => (
                      <button
                        key={s.symbol}
                        onClick={() => navigate(`/stock/${s.symbol}`)}
                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="font-mono text-xs font-bold text-primary">{s.symbol.slice(0, 2)}</span>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-sm text-foreground">{s.symbol}</div>
                            <div className="text-xs text-muted-foreground">{s.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">${s.price.toFixed(2)}</div>
                          <div className={`font-mono text-xs ${s.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                            {s.change >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </button>
                    ))}
                  {stocks.filter(s => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="px-4 py-6 text-center text-muted-foreground text-sm">No stocks found for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Theme + User + Logout */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <span className="text-sm text-muted-foreground hidden md:inline">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <motion.main
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-[1440px] mx-auto px-6 py-6 space-y-6"
      >
        {/* ── Welcome Banner + Quick Stats ── */}
        <motion.section variants={fadeUp} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {getGreeting()}, <span className="gradient-text">{user?.name || 'Investor'}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here's your market overview for today.</p>
          </div>
          <div className="flex items-center gap-3">
            {indices.map(idx => (
              <div key={idx.name} className="px-4 py-2 bg-card border border-border rounded-xl flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{idx.name}</span>
                <span className="font-mono text-sm font-semibold">{idx.value}</span>
                <span className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${idx.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {idx.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {idx.change >= 0 ? '+' : ''}{idx.change}%
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Quick Stat Cards ── */}
        <motion.section variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/portfolio')}
            className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Portfolio Value</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="font-mono text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</div>
            <div className={`font-mono text-sm mt-1 flex items-center gap-1 ${portfolioData.dailyChange >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {portfolioData.dailyChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {portfolioData.dailyChange >= 0 ? '+' : ''}${portfolioData.dailyChange.toFixed(2)} ({portfolioData.dailyChangePercent.toFixed(2)}%) today
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Market Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bullish opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bullish"></span>
              </span>
              <span className="font-semibold text-lg">Markets Open</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">NYSE & NASDAQ are currently active</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI Confidence</span>
            </div>
            <div className="font-mono text-2xl font-bold">84%</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Models predict bullish trend today
            </div>
          </div>
        </motion.section>

        {/* ── Main Chart + Market Summary (2-col) ── */}
        <motion.section variants={fadeUp} className="grid grid-cols-12 gap-5">
          {/* Chart area */}
          <div className="col-span-12 lg:col-span-8 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedStock.symbol}</h2>
                  <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold">${selectedStock.price.toFixed(2)}</span>
                  <span className={`font-mono text-sm font-semibold px-2 py-0.5 rounded-md ${selectedStock.change >= 0 ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'}`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">AI Forecast ON</span>
              </div>
            </div>
            <StockChart data={priceHistory} />

            {/* Signal cards below chart */}
            <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1.5 uppercase tracking-wider font-medium">Trading Signal</span>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-bullish" />
                  <span className="font-mono text-sm font-bold text-bullish">STRONG BUY</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1.5 uppercase tracking-wider font-medium">Market Sentiment</span>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm font-bold">84% BULLISH</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1.5 uppercase tracking-wider font-medium">Price Target</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-bullish" />
                  <span className="font-mono text-sm font-bold">${(selectedStock.price * 1.15).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar: Top Movers */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <TopMovers />
            </div>
            {/* Risk Monitor */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Risk Monitor</h3>
              </div>
              <CrashIndicator data={crashProbability} />
            </div>
          </div>
        </motion.section>

        {/* ── Widget Row: Portfolio / Watchlist / News ── */}
        <motion.section variants={fadeUp} className="grid grid-cols-12 gap-5">
          {/* Portfolio — clickable → /portfolio */}
          <div
            onClick={() => navigate('/portfolio')}
            className="col-span-12 md:col-span-4 bg-card border border-border rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold">My Portfolio</h3>
              </div>
              <span className="text-xs text-primary/70 group-hover:text-primary flex items-center gap-1 font-medium transition-colors">
                View All <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <PortfolioWidget data={portfolioData} />
          </div>

          {/* Watchlist — inline */}
          <div className="col-span-12 md:col-span-4 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-chart-4" />
              </div>
              <h3 className="font-semibold">Watchlist</h3>
            </div>
            <WatchlistTable stocks={stocks} onSelect={setSelectedStock} selectedSymbol={selectedStock.symbol} />
          </div>

          {/* News — clickable → /news */}
          <div
            onClick={() => navigate('/news')}
            className="col-span-12 md:col-span-4 bg-card border border-border rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-chart-5/10 flex items-center justify-center">
                  <Newspaper className="w-4 h-4 text-chart-5" />
                </div>
                <h3 className="font-semibold">News & Insights</h3>
              </div>
              <span className="text-xs text-primary/70 group-hover:text-primary flex items-center gap-1 font-medium transition-colors">
                View All <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <NewsFeed news={newsItems} />
          </div>
        </motion.section>

        {/* ── Bottom Row: Sector Heatmap + AI Insights ── */}
        <motion.section variants={fadeUp} className="grid grid-cols-12 gap-5 pb-8">
          <div className="col-span-12 lg:col-span-6 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-chart-1" />
              </div>
              <h3 className="font-semibold">Sector Heatmap</h3>
            </div>
            <SectorHeatmap sectors={sectorHeatmap} />
          </div>

          <div className="col-span-12 lg:col-span-6 bg-card border border-border rounded-2xl p-5">
            <AIInsightPanel insights={aiInsights} />
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Dashboard;
