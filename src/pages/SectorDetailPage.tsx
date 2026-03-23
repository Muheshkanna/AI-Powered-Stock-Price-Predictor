import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, PieChart, TrendingUp, TrendingDown, 
  Activity, Zap, Info, ArrowUpRight, ArrowDownRight,
  Filter, Download, LayoutGrid, List
} from 'lucide-react';
import { watchlistStocks, sectorHeatmap } from '@/lib/mockData';
import ThemeToggle from '@/components/ThemeToggle';

const SectorDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  
  const sectorData = sectorHeatmap.find(s => s.name === name);
  const sectorStocks = watchlistStocks.filter(s => s.sector === name);

  if (!sectorData) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Sector Not Found</h2>
      <button onClick={() => navigate('/dashboard')} className="text-primary hover:underline">Return to Dashboard</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-lg text-xs font-medium border border-border">
              <PieChart className="w-3.5 h-3.5 text-primary" />
              Sector Focus
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Sector Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-4">
                {name} <span className="text-muted-foreground/30 font-light">Sector</span>
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                Real-time performance analysis and institutional flow monitoring for the {name} sector. Showing {sectorStocks.length} tracked assets.
              </p>
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-card border border-border rounded-2xl">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Day Performance</span>
                <div className={`text-2xl font-bold mt-1 ${sectorData.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {sectorData.change > 0 ? '+' : ''}{sectorData.change.toFixed(2)}%
                </div>
              </div>
              <div className="p-4 bg-card border border-border rounded-2xl">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Market Status</span>
                <div className="text-2xl font-bold mt-1 text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  ACTIVE
                </div>
              </div>
              <div className="p-4 bg-card border border-border rounded-2xl">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Sentiment</span>
                <div className="text-2xl font-bold mt-1 text-primary">BULLISH</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:row-span-2">
            <div className="h-full p-6 bg-primary/5 border border-primary/20 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary uppercase tracking-wider text-xs">Sector Technicals</h3>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: 'Relative Strength', value: 82, color: 'bg-bullish' },
                  { label: 'Volitality Index', value: 45, color: 'bg-warning' },
                  { label: 'Institutional Buy Flow', value: 68, color: 'bg-primary' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase">
                      <span>{item.label}</span>
                      <span className="font-mono text-primary">{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-primary/10">
                <div className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Institutional positions in <span className="text-foreground font-semibold">{name}</span> have increased by 12.4% over the last 30 trading days, signaling long-term accumulation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Asset List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                Sector Components
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors"><Filter className="w-4 h-4 text-muted-foreground" /></button>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors"><Download className="w-4 h-4 text-muted-foreground" /></button>
              </div>
            </div>

            <div className="space-y-3">
              {sectorStocks.map((stock) => (
                <motion.div 
                  key={stock.symbol}
                  whileHover={{ x: 5 }}
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                  className="group p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {stock.symbol}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{stock.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono uppercase">Vol: {stock.volume}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden md:block">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Price</div>
                      <div className="font-mono font-bold">${stock.price.toFixed(2)}</div>
                    </div>
                    <div className="text-right w-24">
                      <div className={`flex items-center justify-end gap-1 font-mono font-bold ${stock.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                        {stock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SectorDetailPage;
