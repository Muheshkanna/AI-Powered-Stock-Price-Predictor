import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, TrendingUp, TrendingDown, Clock, PieChart, Activity,
  Zap, ArrowUpRight, ArrowDownRight, ArrowLeft, Plus, X, ShoppingCart,
  RefreshCw, Brain, Calendar, BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions, fetchPortfolioSummary, createTransaction } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';

// ----- Seed prices -----
const DEFAULT_SEED_PRICES: Record<string, number> = {
  AAPL: 189.5, MSFT: 415.2, GOOGL: 175.8, AMZN: 198.4, NVDA: 875.3,
  META: 515.6, TSLA: 178.9, JPM: 215.4, BAC: 38.7, NFLX: 625.1,
};

const AVAILABLE_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'JPM', name: 'JPMorgan' },
  { symbol: 'BAC', name: 'Bank of America' },
  { symbol: 'NFLX', name: 'Netflix' },
];

interface Holding { symbol: string; quantity: number; avgPrice: number; }
interface LiveHolding extends Holding {
  marketPrice: number; prevPrice: number; pnl: number; pnlPct: number;
  totalValue: number; trending: 'up' | 'down' | 'neutral';
}
interface Projection { period: string; price: number; pnl: number; pnlPct: number; }

const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [liveHoldings, setLiveHoldings] = useState<LiveHolding[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buy modal
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buySymbol, setBuySymbol] = useState('AAPL');
  const [buyQty, setBuyQty] = useState('1');
  const [isBuying, setIsBuying] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [buySuccess, setBuySuccess] = useState('');

  // Projection state
  const [projections, setProjections] = useState<Record<string, Projection[]>>({});
  const [runningProjection, setRunningProjection] = useState<string | null>(null);

  // Live sim
  const simRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const livePricesRef = useRef<Record<string, number>>({});

  const seedLivePrices = useCallback((rawHoldings: Holding[]) => {
    rawHoldings.forEach(h => {
      if (!livePricesRef.current[h.symbol]) {
        livePricesRef.current[h.symbol] = DEFAULT_SEED_PRICES[h.symbol] ?? h.avgPrice * 1.05;
      }
    });
  }, []);

  const buildLiveHoldings = useCallback((rawHoldings: Holding[]): LiveHolding[] => {
    return rawHoldings.map(h => {
      const mp = livePricesRef.current[h.symbol] ?? h.avgPrice;
      const pnl = (mp - h.avgPrice) * h.quantity;
      const pnlPct = ((mp - h.avgPrice) / h.avgPrice) * 100;
      return { ...h, marketPrice: mp, prevPrice: mp, pnl, pnlPct, totalValue: mp * h.quantity, trending: 'neutral' };
    });
  }, []);

  const loadPortfolio = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [txData, holdData] = await Promise.all([fetchTransactions(user.id), fetchPortfolioSummary(user.id)]);
      setTransactions(txData);
      setHoldings(holdData);
      seedLivePrices(holdData);
      setLiveHoldings(buildLiveHoldings(holdData));
    } catch (err) { console.error('Failed to load portfolio:', err); }
    finally { setIsLoading(false); }
  }, [user, seedLivePrices, buildLiveHoldings]);

  useEffect(() => { loadPortfolio(); }, [loadPortfolio]);

  // Live price tick every 2s
  useEffect(() => {
    if (simRef.current) clearInterval(simRef.current);
    if (holdings.length === 0) return;
    simRef.current = setInterval(() => {
      holdings.forEach(h => {
        const prev = livePricesRef.current[h.symbol] ?? h.avgPrice;
        const delta = prev * (Math.random() * 0.003 - 0.0015);
        livePricesRef.current[h.symbol] = Math.max(prev + delta, 0.01);
      });
      setLiveHoldings(prev => prev.map(h => {
        const mp = livePricesRef.current[h.symbol] ?? h.avgPrice;
        const pnl = (mp - h.avgPrice) * h.quantity;
        const pnlPct = ((mp - h.avgPrice) / h.avgPrice) * 100;
        return { ...h, prevPrice: h.marketPrice, marketPrice: mp, pnl, pnlPct, totalValue: mp * h.quantity, trending: mp > h.marketPrice ? 'up' : mp < h.marketPrice ? 'down' : 'neutral' };
      }));
    }, 2000);
    return () => { if (simRef.current) clearInterval(simRef.current); };
  }, [holdings]);

  const totalPortfolioValue = liveHoldings.reduce((acc, h) => acc + h.totalValue, 0);
  const totalPnL = liveHoldings.reduce((acc, h) => acc + h.pnl, 0);
  const totalInvested = holdings.reduce((acc, h) => acc + h.avgPrice * h.quantity, 0);
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const handleBuy = async () => {
    if (!user) return;
    setBuyError(''); setBuySuccess('');
    const qty = parseInt(buyQty);
    if (!qty || qty <= 0) { setBuyError('Enter a valid quantity.'); return; }
    const price = DEFAULT_SEED_PRICES[buySymbol] ?? 100;
    setIsBuying(true);
    try {
      await createTransaction({ userId: user.id, symbol: buySymbol, type: 'buy', quantity: qty, price });
      setBuySuccess(`✓ Bought ${qty} × ${buySymbol} @ $${price.toFixed(2)}`);
      setBuyQty('1');
      await loadPortfolio();
      setTimeout(() => { setShowBuyModal(false); setBuySuccess(''); }, 1500);
    } catch (err: any) { setBuyError(err.message || 'Transaction failed.'); }
    finally { setIsBuying(false); }
  };

  /* ── Run projection for a stock (3mo, 6mo, 1yr) ── */
  const runProjection = (symbol: string, currentPrice: number, avgPrice: number, qty: number) => {
    setRunningProjection(symbol);
    setTimeout(() => {
      const periods = [
        { label: '3 Months', months: 3 },
        { label: '6 Months', months: 6 },
        { label: '1 Year', months: 12 },
      ];
      const results: Projection[] = periods.map(p => {
        // Monte Carlo-like: simulate random walk with slight upward bias
        let price = currentPrice;
        for (let i = 0; i < p.months * 22; i++) { // ~22 trading days/month
          const dailyReturn = (Math.random() - 0.48) * 0.025; // slight bullish bias
          price *= (1 + dailyReturn);
        }
        const pnl = (price - avgPrice) * qty;
        const pnlPct = ((price - avgPrice) / avgPrice) * 100;
        return { period: p.label, price, pnl, pnlPct };
      });
      setProjections(prev => ({ ...prev, [symbol]: results }));
      setRunningProjection(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="font-semibold text-lg">Portfolio</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground hidden md:inline">{user?.email}</span>
            <button onClick={loadPortfolio} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => { setShowBuyModal(true); setBuyError(''); setBuySuccess(''); }}
              className="flex items-center gap-1.5 h-9 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
              <Plus className="w-4 h-4" /> Buy Stock
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2 font-medium">Total Portfolio Value</span>
            <span className="text-3xl font-mono font-bold">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-2xl p-5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2 font-medium">Total Gain / Loss</span>
            <span className={`text-3xl font-mono font-bold ${totalPnL >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2 font-medium">Return %</span>
            <span className={`text-3xl font-mono font-bold ${totalPnLPct >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {totalPnLPct >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%
            </span>
          </motion.div>
        </div>

        {/* ── Live Holdings ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <PieChart className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Live Holdings</h3>
            <span className="text-xs text-muted-foreground ml-1">— prices update every 2s</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-primary font-medium animate-pulse">
              <Activity className="w-3 h-3" /> LIVE
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse">Loading portfolio…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3">Asset</th>
                    <th className="px-5 py-3">Qty</th>
                    <th className="px-5 py-3">Avg. Cost</th>
                    <th className="px-5 py-3">Market Price</th>
                    <th className="px-5 py-3">Total Value</th>
                    <th className="px-5 py-3">P&L</th>
                    <th className="px-5 py-3 text-right">Projection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-sm">
                  {liveHoldings.length > 0 ? liveHoldings.map(h => (
                    <React.Fragment key={h.symbol}>
                      <motion.tr
                        className="hover:bg-secondary/20 transition-colors"
                        animate={
                          h.trending === 'up' ? { backgroundColor: ['rgba(34,197,94,0.06)', 'transparent'] }
                          : h.trending === 'down' ? { backgroundColor: ['rgba(239,68,68,0.06)', 'transparent'] }
                          : {}
                        }
                        transition={{ duration: 0.6 }}
                      >
                        <td className="px-5 py-4"><span className="font-bold text-base">{h.symbol}</span></td>
                        <td className="px-5 py-4 text-muted-foreground">{h.quantity}</td>
                        <td className="px-5 py-4 text-muted-foreground font-mono">${h.avgPrice.toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span className={`font-mono font-semibold ${h.trending === 'up' ? 'text-bullish' : h.trending === 'down' ? 'text-bearish' : ''}`}>
                            ${h.marketPrice.toFixed(2)}
                            {h.trending === 'up' && <TrendingUp className="inline w-3.5 h-3.5 ml-1" />}
                            {h.trending === 'down' && <TrendingDown className="inline w-3.5 h-3.5 ml-1" />}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono">${h.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-5 py-4">
                          <span className={`font-mono font-semibold ${h.pnl >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                            {h.pnl >= 0 ? '+' : ''}${h.pnl.toFixed(2)}
                            <span className="text-xs font-normal ml-1">({h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(2)}%)</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => runProjection(h.symbol, h.marketPrice, h.avgPrice, h.quantity)}
                            disabled={runningProjection === h.symbol}
                            className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all font-medium disabled:opacity-50"
                          >
                            {runningProjection === h.symbol ? (
                              <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Running...</span>
                            ) : (
                              <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> AI Forecast</span>
                            )}
                          </button>
                        </td>
                      </motion.tr>

                      {/* Projection results row */}
                      <AnimatePresence>
                        {projections[h.symbol] && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <td colSpan={7} className="px-5 py-0">
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-4 mb-2"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <Calendar className="w-3.5 h-3.5 text-primary" />
                                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Projection for {h.symbol} ({h.quantity} units)</span>
                                  <button
                                    onClick={() => setProjections(prev => { const n = { ...prev }; delete n[h.symbol]; return n; })}
                                    className="ml-auto text-muted-foreground hover:text-foreground p-0.5"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  {projections[h.symbol].map(p => (
                                    <div key={p.period} className={`p-3.5 rounded-xl border ${p.pnl >= 0 ? 'bg-bullish/5 border-bullish/20' : 'bg-bearish/5 border-bearish/20'}`}>
                                      <span className="text-xs text-muted-foreground block mb-1 font-medium">{p.period}</span>
                                      <div className="font-mono text-lg font-bold">${p.price.toFixed(2)}</div>
                                      <div className={`font-mono text-sm mt-1 flex items-center gap-1 ${p.pnl >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                                        {p.pnl >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                        {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}
                                        <span className="text-xs">({p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(1)}%)</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground italic">
                        No positions yet. Click <strong className="text-primary">Buy Stock</strong> to start investing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* ── Transaction History ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border text-muted-foreground">
            <Clock className="w-4 h-4" />
            <h3 className="font-semibold text-foreground">Transaction History</h3>
          </div>
          <div className="p-5 space-y-2 max-h-80 overflow-y-auto">
            {transactions.length > 0 ? transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/20 border border-border/50 rounded-xl hover:border-border transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.type === 'buy' ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'}`}>
                    {t.type === 'buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-semibold block">{t.symbol}</span>
                    <span className="text-xs text-muted-foreground uppercase">{t.type} · {new Date(t.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm block">{t.quantity} Units</span>
                  <span className="text-xs text-muted-foreground font-mono">@ ${t.price.toFixed(2)}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground/50 italic border-2 border-dashed border-border/30 rounded-xl">No transactions yet.</div>
            )}
          </div>
        </motion.div>
      </main>

      {/* ── Buy Stock Modal ── */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowBuyModal(false); }}
          >
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Buy Stock</h2>
                </div>
                <button onClick={() => setShowBuyModal(false)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2 font-medium">Stock</label>
                  <select value={buySymbol} onChange={e => setBuySymbol(e.target.value)}
                    className="w-full h-10 px-3 bg-secondary border border-border rounded-xl font-mono text-foreground focus:outline-none focus:border-primary transition-colors">
                    {AVAILABLE_STOCKS.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} – {s.name}</option>)}
                  </select>
                </div>
                <div className="p-3 bg-secondary/50 border border-border/50 rounded-xl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Market Price</span>
                    <span className="text-primary font-mono font-bold">${(DEFAULT_SEED_PRICES[buySymbol] ?? 100).toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2 font-medium">Quantity</label>
                  <input type="number" min="1" value={buyQty} onChange={e => setBuyQty(e.target.value)}
                    className="w-full h-10 px-3 bg-secondary border border-border rounded-xl font-mono text-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-mono font-bold">
                      ${((DEFAULT_SEED_PRICES[buySymbol] ?? 100) * (parseInt(buyQty) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                {buyError && <p className="text-xs text-bearish bg-bearish/10 border border-bearish/30 px-3 py-2 rounded-xl">{buyError}</p>}
                {buySuccess && <p className="text-xs text-bullish bg-bullish/10 border border-bullish/30 px-3 py-2 rounded-xl">{buySuccess}</p>}
                <button onClick={handleBuy} disabled={isBuying}
                  className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {isBuying ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing…</> : <><ShoppingCart className="w-4 h-4" /> Confirm Buy</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioPage;
