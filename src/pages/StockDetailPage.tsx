import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Brain, TrendingUp, TrendingDown, Activity, Zap,
  DollarSign, BarChart, ShieldCheck, Building2, Users, Calendar,
  Globe, PieChart, ArrowUpRight, ArrowDownRight, AlertTriangle, Search
} from 'lucide-react';
import { fetchStocks, formatHistoryToPricePoints } from '@/lib/api';
import StockChart from '@/components/dashboard/StockChart';
import ThemeToggle from '@/components/ThemeToggle';

/* ── Company Info Mock Data ── */
const COMPANY_INFO: Record<string, {
  description: string; sector: string; industry: string; founded: string; ceo: string; headquarters: string; employees: string;
  shareholders: { name: string; pct: number }[];
  metrics: { peRatio: number; eps: number; divYield: number; beta: number; high52w: number; low52w: number; ytdReturn: number };
}> = {
  AAPL: {
    description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, and wearables. Known for its ecosystem of products and services including iPhone, Mac, iPad, and Apple Watch.',
    sector: 'Technology', industry: 'Consumer Electronics', founded: '1976', ceo: 'Tim Cook', headquarters: 'Cupertino, CA', employees: '164,000+',
    shareholders: [{ name: 'Vanguard Group', pct: 8.5 }, { name: 'BlackRock', pct: 6.9 }, { name: 'Berkshire Hathaway', pct: 5.8 }, { name: 'State Street', pct: 3.7 }],
    metrics: { peRatio: 29.4, eps: 6.42, divYield: 0.53, beta: 1.24, high52w: 199.62, low52w: 124.17, ytdReturn: 8.2 },
  },
  MSFT: {
    description: 'Microsoft develops and licenses consumer and enterprise software including Windows, Office 365, Azure cloud platform, and LinkedIn. A leader in cloud computing and AI.',
    sector: 'Technology', industry: 'Software - Infrastructure', founded: '1975', ceo: 'Satya Nadella', headquarters: 'Redmond, WA', employees: '228,000+',
    shareholders: [{ name: 'Vanguard Group', pct: 8.8 }, { name: 'BlackRock', pct: 7.2 }, { name: 'State Street', pct: 3.9 }, { name: 'Fidelity', pct: 2.1 }],
    metrics: { peRatio: 35.8, eps: 11.53, divYield: 0.72, beta: 0.89, high52w: 430.82, low52w: 310.22, ytdReturn: 12.1 },
  },
  NVDA: {
    description: 'NVIDIA designs GPU-accelerated computing platforms. A dominant force in AI chips, gaming GPUs, data center solutions, and autonomous driving technology.',
    sector: 'Technology', industry: 'Semiconductors', founded: '1993', ceo: 'Jensen Huang', headquarters: 'Santa Clara, CA', employees: '29,600+',
    shareholders: [{ name: 'Vanguard Group', pct: 8.2 }, { name: 'BlackRock', pct: 7.1 }, { name: 'Fidelity', pct: 4.5 }, { name: 'State Street', pct: 3.6 }],
    metrics: { peRatio: 64.2, eps: 13.85, divYield: 0.02, beta: 1.72, high52w: 974.00, low52w: 390.00, ytdReturn: 42.5 },
  },
  TSLA: {
    description: 'Tesla designs, develops, and manufactures electric vehicles, battery energy storage, and solar panels. A pioneer in sustainable energy and autonomous driving.',
    sector: 'Automotive', industry: 'Electric Vehicles', founded: '2003', ceo: 'Elon Musk', headquarters: 'Austin, TX', employees: '140,000+',
    shareholders: [{ name: 'Elon Musk', pct: 12.9 }, { name: 'Vanguard Group', pct: 7.2 }, { name: 'BlackRock', pct: 5.8 }, { name: 'State Street', pct: 3.4 }],
    metrics: { peRatio: 48.5, eps: 3.62, divYield: 0, beta: 2.08, high52w: 299.29, low52w: 138.80, ytdReturn: -15.2 },
  },
  AMZN: {
    description: 'Amazon is a global technology company focused on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence. The world\'s largest online marketplace.',
    sector: 'Technology', industry: 'Internet Retail', founded: '1994', ceo: 'Andy Jassy', headquarters: 'Seattle, WA', employees: '1,500,000+',
    shareholders: [{ name: 'Andy Jassy', pct: 0.1 }, { name: 'Vanguard Group', pct: 7.0 }, { name: 'BlackRock', pct: 6.2 }, { name: 'State Street', pct: 3.3 }],
    metrics: { peRatio: 58.3, eps: 3.06, divYield: 0, beta: 1.14, high52w: 201.00, low52w: 118.35, ytdReturn: 18.7 },
  },
  META: {
    description: 'Meta Platforms builds technologies that help people connect through social media platforms including Facebook, Instagram, WhatsApp, and is investing heavily in the metaverse.',
    sector: 'Technology', industry: 'Social Media', founded: '2004', ceo: 'Mark Zuckerberg', headquarters: 'Menlo Park, CA', employees: '67,300+',
    shareholders: [{ name: 'Mark Zuckerberg', pct: 13.6 }, { name: 'Vanguard Group', pct: 8.1 }, { name: 'BlackRock', pct: 6.7 }, { name: 'Fidelity', pct: 3.2 }],
    metrics: { peRatio: 24.6, eps: 20.41, divYield: 0.39, beta: 1.28, high52w: 542.81, low52w: 274.38, ytdReturn: 28.4 },
  },
  GOOGL: {
    description: 'Alphabet is the parent company of Google, specializing in internet services, advertising technology, search engines, cloud computing, and AI through DeepMind.',
    sector: 'Technology', industry: 'Internet Content', founded: '1998', ceo: 'Sundar Pichai', headquarters: 'Mountain View, CA', employees: '182,000+',
    shareholders: [{ name: 'Vanguard Group', pct: 7.5 }, { name: 'BlackRock', pct: 6.3 }, { name: 'Sundar Pichai', pct: 0.03 }, { name: 'State Street', pct: 3.4 }],
    metrics: { peRatio: 25.1, eps: 6.20, divYield: 0, beta: 1.06, high52w: 180.00, low52w: 115.83, ytdReturn: 15.9 },
  },
  BTC: {
    description: 'Bitcoin is the first decentralized cryptocurrency. It operates on a peer-to-peer network using blockchain technology without the need for intermediaries or a central authority.',
    sector: 'Cryptocurrency', industry: 'Digital Currency', founded: '2009', ceo: 'N/A (Decentralized)', headquarters: 'Global', employees: 'N/A',
    shareholders: [{ name: 'Satoshi Nakamoto', pct: 5.0 }, { name: 'Grayscale BTC Trust', pct: 3.2 }, { name: 'MicroStrategy', pct: 1.1 }, { name: 'Public Miners', pct: 2.5 }],
    metrics: { peRatio: 0, eps: 0, divYield: 0, beta: 2.5, high52w: 73800, low52w: 25000, ytdReturn: -8.4 },
  },
  ETH: {
    description: 'Ethereum is a decentralized blockchain platform that enables smart contracts and decentralized applications (dApps). ETH is its native cryptocurrency.',
    sector: 'Cryptocurrency', industry: 'Smart Contract Platform', founded: '2015', ceo: 'N/A (Vitalik Buterin, co-founder)', headquarters: 'Global', employees: 'N/A',
    shareholders: [{ name: 'Ethereum Foundation', pct: 0.3 }, { name: 'Vitalik Buterin', pct: 0.2 }, { name: 'Grayscale ETH Trust', pct: 2.1 }, { name: 'Staking Validators', pct: 15.0 }],
    metrics: { peRatio: 0, eps: 0, divYield: 0, beta: 2.8, high52w: 4870, low52w: 1520, ytdReturn: -12.1 },
  },
  ADBE: {
    description: 'Adobe is a leader in creative software, including Photoshop, Illustrator, and Acrobat. It also provides digital marketing and document management solutions.',
    sector: 'Technology', industry: 'Software - Infrastructure', founded: '1982', ceo: 'Shantanu Narayen', headquarters: 'San Jose, CA', employees: '29,000+',
    shareholders: [{ name: 'Vanguard Group', pct: 8.5 }, { name: 'BlackRock', pct: 7.2 }],
    metrics: { peRatio: 45.2, eps: 12.35, divYield: 0, beta: 1.15, high52w: 638.25, low52w: 433.97, ytdReturn: -5.4 },
  },
  DIS: {
    description: 'The Walt Disney Company is a global entertainment leader, covering media networks, theme parks, and studio entertainment (Disney, Pixar, Marvel, Star Wars).',
    sector: 'Consumer', industry: 'Entertainment', founded: '1923', ceo: 'Bob Iger', headquarters: 'Burbank, CA', employees: '225,000+',
    shareholders: [{ name: 'Vanguard Group', pct: 7.8 }, { name: 'BlackRock', pct: 6.5 }],
    metrics: { peRatio: 24.5, eps: 4.62, divYield: 0.62, beta: 1.25, high52w: 123.74, low52w: 78.73, ytdReturn: 18.2 },
  },
  WMT: {
    description: 'Walmart is the world\'s largest retailer, operating a chain of hypermarkets, discount department stores, and grocery stores. It is the largest private employer globally.',
    sector: 'Consumer', industry: 'Retail', founded: '1962', ceo: 'Doug McMillon', headquarters: 'Bentonville, AR', employees: '2,100,000+',
    shareholders: [{ name: 'Walton Family', pct: 45.0 }, { name: 'Vanguard Group', pct: 4.5 }],
    metrics: { peRatio: 28.3, eps: 2.12, divYield: 1.34, beta: 0.49, high52w: 61.54, low52w: 48.12, ytdReturn: 12.5 },
  },
  ORCL: {
    description: 'Oracle Corporation is a multinational computer technology corporation that sells database software and technology, cloud engineered systems, and enterprise software products.',
    sector: 'Technology', industry: 'Software - Infrastructure', founded: '1977', ceo: 'Safra Catz', headquarters: 'Austin, TX', employees: '164,000+',
    shareholders: [{ name: 'Larry Ellison', pct: 42.5 }, { name: 'Vanguard Group', pct: 5.2 }],
    metrics: { peRatio: 32.4, eps: 3.82, divYield: 1.25, beta: 0.94, high52w: 132.74, low52w: 98.17, ytdReturn: 14.2 },
  },
  CRM: {
    description: 'Salesforce is the global leader in Customer Relationship Management (CRM), helping companies connect with their customers in a whole new way through cloud, mobile, social, and AI.',
    sector: 'Technology', industry: 'Software - Application', founded: '1999', ceo: 'Marc Benioff', headquarters: 'San Francisco, CA', employees: '72,000+',
    shareholders: [{ name: 'Marc Benioff', pct: 4.2 }, { name: 'Vanguard Group', pct: 8.1 }],
    metrics: { peRatio: 48.2, eps: 8.42, divYield: 0.45, beta: 1.18, high52w: 318.52, low52w: 198.17, ytdReturn: 18.2 },
  },
  AVGO: {
    description: 'Broadcom Inc. is a global technology leader that designs, develops and supplies a broad range of semiconductor and infrastructure software solutions.',
    sector: 'Technology', industry: 'Semiconductors', founded: '1961', ceo: 'Hock Tan', headquarters: 'Palo Alto, CA', employees: '20,000+',
    shareholders: [{ name: 'Vanguard Group', pct: 7.9 }, { name: 'BlackRock', pct: 6.5 }],
    metrics: { peRatio: 42.5, eps: 34.22, divYield: 1.62, beta: 1.14, high52w: 1438.17, low52w: 780.22, ytdReturn: 28.4 },
  },
  COST: {
    description: 'Costco Wholesale Corporation operates an international chain of membership warehouses that carry quality, brand-name merchandise at substantially lower prices than typical retail outlets.',
    sector: 'Consumer', industry: 'Retail', founded: '1983', ceo: 'Ron Vachris', headquarters: 'Issaquah, WA', employees: '310,000+',
    shareholders: [{ name: 'Vanguard Group', pct: 8.2 }, { name: 'BlackRock', pct: 6.9 }],
    metrics: { peRatio: 46.8, eps: 15.42, divYield: 0.62, beta: 0.78, high52w: 787.32, low52w: 472.17, ytdReturn: 12.5 },
  },
  UBER: {
    description: 'Uber Technologies, Inc. is a technology platform that uses a massive network, leading technology, operational excellence and product expertise to power movement from A to B.',
    sector: 'Technology', industry: 'Software - Application', founded: '2009', ceo: 'Dara Khosrowshahi', headquarters: 'San Francisco, CA', employees: '30,000+',
    shareholders: [{ name: 'Vanguard Group', pct: 7.2 }, { name: 'BlackRock', pct: 6.1 }],
    metrics: { peRatio: 82.4, eps: 0.92, divYield: 0, beta: 1.45, high52w: 82.14, low52w: 38.17, ytdReturn: 24.2 },
  },
};

const DEFAULT_INFO = {
  description: 'This company is a publicly traded entity in global financial markets. Detailed information about this company is being compiled.',
  sector: 'Various', industry: 'General', founded: 'N/A', ceo: 'N/A', headquarters: 'N/A', employees: 'N/A',
  shareholders: [{ name: 'Institutional Investors', pct: 65.0 }, { name: 'Retail Investors', pct: 25.0 }, { name: 'Insiders', pct: 10.0 }],
  metrics: { peRatio: 20.0, eps: 5.00, divYield: 1.5, beta: 1.0, high52w: 0, low52w: 0, ytdReturn: 0 },
};

const StockDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState('10');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    const loadStock = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const stocks = await fetchStocks();
        const found = stocks.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase());
        if (found) {
          setStock(found);
        } else {
          setError(`Stock symbol "${symbol}" not found in our database.`);
        }
      } catch (err) {
        setError('Failed to load stock data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadStock();
  }, [symbol]);

  const priceHistory = useMemo(() => {
    if (stock?.rawHistory) return formatHistoryToPricePoints(stock.rawHistory, stock.price);
    return [];
  }, [stock]);

  const info = (symbol && COMPANY_INFO[symbol]) || DEFAULT_INFO;

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const qty = parseInt(amount) || 0;
      const futurePrice = stock.price * (1 + (Math.random() * 0.4 - 0.1));
      const profit = (futurePrice - stock.price) * qty;
      setSimResult({ futurePrice, profit, roi: (profit / (qty * stock.price)) * 100 });
      setIsSimulating(false);
    }, 1500);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="relative mb-12">
        {/* Bioluminescent Pulse rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full animate-ping opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full animate-ping opacity-10 [animation-delay:0.5s]" />
        
        <div className="relative w-24 h-24 border-4 border-primary/10 rounded-full shadow-[0_0_30px_rgba(var(--primary),0.1)] flex items-center justify-center bg-card">
          <div className="w-full h-full border-b-4 border-primary rounded-full animate-spin absolute top-0 left-0" />
          <div className="flex flex-col items-center">
            <Activity className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4 max-w-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
          <Zap className="w-3.5 h-3.5 text-primary animate-bounce" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Market Data Analysis Pulse</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Analyzing Intelligence</h2>
        <p className="text-muted-foreground leading-relaxed">
          Retrieving real-time metrics, sentiment scores, and <span className="text-primary font-semibold">AI projections</span> for <span className="font-mono font-bold text-foreground">{symbol}</span>...
        </p>
      </div>
      
      {/* Loading progress bar */}
      <div className="mt-10 w-64 h-1.5 bg-secondary rounded-full overflow-hidden border border-border/50">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  if (error || !stock) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-card/50 backdrop-blur-xl border border-border p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-bearish/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
        
        <div className="w-20 h-20 bg-bearish/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-bearish/20 shadow-xl shadow-bearish/5">
          <Search className="w-10 h-10 text-bearish" />
        </div>
        
        <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Stock Not Found</h2>
        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
          The symbol <span className="px-2 py-0.5 bg-secondary rounded font-mono font-bold text-foreground border border-border">{symbol}</span> isn't in our active watchlists or supported exchanges yet.
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:shadow-[0_10px_30px_rgba(var(--primary),0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
            Back to Global Markets
          </button>
          
          <div className="mt-8 pt-8 border-t border-border/50 flex flex-col gap-4">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Recommended Actions</p>
            <div className="flex justify-center gap-3">
              {['NVDA', 'AAPL', 'TSLA'].map(s => (
                <button 
                  key={s}
                  onClick={() => navigate(`/stock/${s}`)}
                  className="px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-xl text-xs font-bold transition-colors"
                >
                  View {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{stock.symbol}</h1>
              <span className="text-sm text-muted-foreground">{stock.name}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* ── Price + Chart ── */}
        <div className="grid grid-cols-12 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-12 lg:col-span-8 bg-card border border-border rounded-2xl p-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-4xl font-mono font-bold">${stock.price.toFixed(2)}</span>
                <span className={`ml-3 font-mono text-sm ${stock.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block uppercase">Market Status</span>
                <span className="text-sm text-bullish flex items-center gap-1.5 justify-end">
                  <Activity className="w-3.5 h-3.5" /> OPEN
                </span>
              </div>
            </div>
            <div className="h-[350px]">
              <StockChart data={priceHistory} />
            </div>
          </motion.div>

          {/* Simulation Engine */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary">AI Simulation Engine</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Number of Units</label>
                  <div className="relative">
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full h-10 px-3 bg-card border border-primary/30 rounded-xl font-mono text-foreground focus:outline-none focus:border-primary transition-all" />
                    <ShieldCheck className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-primary/50" />
                  </div>
                  <span className="text-xs text-muted-foreground block mt-1">Total Cost: ${(parseFloat(amount) * stock.price || 0).toFixed(2)}</span>
                </div>
                <button onClick={handleSimulate} disabled={isSimulating} className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  {isSimulating ? <><div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Running Models...</> : <><Zap className="w-4 h-4" /> Simulate Future ROI</>}
                </button>
                {simResult && !isSimulating && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-xl p-4 space-y-2 border-l-4 border-l-bullish">
                    <div className="flex justify-between text-xs font-semibold text-bullish uppercase">
                      <span>12-Month Projection</span><span>AI Match: 94%</span>
                    </div>
                    <div className="flex justify-between"><span className="text-xs text-muted-foreground">Future Value</span><span className="font-mono text-sm font-bold">${simResult.futurePrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-muted-foreground">Est. Profit</span><span className={`font-mono text-sm font-bold ${simResult.profit >= 0 ? 'text-bullish' : 'text-bearish'}`}>{simResult.profit >= 0 ? '+' : ''}${simResult.profit.toFixed(2)}</span></div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Technical Matrix */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-muted-foreground" /><h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Technical Matrix</h3></div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50"><span className="text-muted-foreground">RSI (14)</span><span className="font-mono">58.4 (Neutral)</span></div>
                <div className="flex justify-between py-2 border-b border-border/50"><span className="text-muted-foreground">Support</span><span className="font-mono">${(stock.price * 0.92).toFixed(2)}</span></div>
                <div className="flex justify-between py-2"><span className="text-muted-foreground">Resistance</span><span className="font-mono">${(stock.price * 1.08).toFixed(2)}</span></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Company Info + Shareholders + Metrics ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-12 gap-6">
          {/* Company About */}
          <div className="col-span-12 lg:col-span-6 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">About {stock.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{info.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2"><span className="text-muted-foreground">Sector:</span><span className="font-medium">{info.sector}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground">Industry:</span><span className="font-medium">{info.industry}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground">Founded:</span><span className="font-medium">{info.founded}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground">CEO:</span><span className="font-medium">{info.ceo}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground">HQ:</span><span className="font-medium">{info.headquarters}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground">Employees:</span><span className="font-medium">{info.employees}</span></div>
            </div>
          </div>

          {/* Major Shareholders */}
          <div className="col-span-12 lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Major Holders</h3>
            </div>
            <div className="space-y-3">
              {info.shareholders.map((sh, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{sh.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(sh.pct * 5, 100)}%` }} />
                    </div>
                    <span className="font-mono text-xs font-semibold w-12 text-right">{sh.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="col-span-12 lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Key Metrics</h3>
            </div>
            <div className="space-y-3 text-sm">
              {info.metrics.peRatio !== 0 && <div className="flex justify-between"><span className="text-muted-foreground">P/E Ratio</span><span className="font-mono font-semibold">{info.metrics.peRatio}x</span></div>}
              {info.metrics.eps !== 0 && <div className="flex justify-between"><span className="text-muted-foreground">EPS</span><span className="font-mono font-semibold">${info.metrics.eps}</span></div>}
              {info.metrics.divYield > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Div. Yield</span><span className="font-mono font-semibold">{info.metrics.divYield}%</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Beta</span><span className="font-mono font-semibold">{info.metrics.beta}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">52W High</span><span className="font-mono font-semibold text-bullish">${info.metrics.high52w.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">52W Low</span><span className="font-mono font-semibold text-bearish">${info.metrics.low52w.toLocaleString()}</span></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">YTD Return</span>
                <span className={`font-mono font-semibold ${info.metrics.ytdReturn >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {info.metrics.ytdReturn >= 0 ? '+' : ''}{info.metrics.ytdReturn}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StockDetailPage;
