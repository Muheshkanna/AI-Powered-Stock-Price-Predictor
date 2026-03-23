import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MessageSquare, Send, Calendar, 
  Share2, Bookmark, TrendingUp, TrendingDown, 
  Minus, Zap, Brain, Shield 
} from 'lucide-react';
import { newsItems } from '@/lib/mockData';
import ThemeToggle from '@/components/ThemeToggle';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{user: string, text: string, time: string}[]>([]);
  
  const news = newsItems.find(n => n.id === id);

  useEffect(() => {
    // Mock loading comments from "DB"
    const saved = localStorage.getItem(`comments_${id}`);
    if (saved) setComments(JSON.parse(saved));
    else {
      setComments([
        { user: 'MarketWatcher', text: 'This is a huge move for the sector. Expecting volatility.', time: '1h ago' },
        { user: 'AlphaTrader', text: 'The AI integration seems a bit overhyped but the revenue is real.', time: '45m ago' }
      ]);
    }
  }, [id]);

  const handlePostComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      user: 'You',
      text: comment,
      time: 'Just now'
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
    setComment('');
  };

  if (!news) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">News Not Found</h2>
      <button onClick={() => navigate('/dashboard')} className="text-primary hover:underline">Return to Dashboard</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            <Share2 className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            <Bookmark className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10 pb-24">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              news.sentiment === 'positive' ? 'bg-bullish/10 text-bullish border border-bullish/20' : 
              news.sentiment === 'negative' ? 'bg-bearish/10 text-bearish border border-bearish/20' : 
              'bg-secondary text-muted-foreground border border-border'
            }`}>
              {news.sentiment} Sentiment
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {news.time}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
            {news.title}
          </h1>
          
          <div className="flex items-center gap-4 py-4 border-y border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {news.source.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-foreground">{news.source} Business News</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Market Impact Score: <span className="font-mono font-bold text-primary">{news.score > 0 ? '+' : ''}{news.score.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8 space-y-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:mr-2">
                {news.content || "Full article content is currently being processed by our AI systems. Check back soon for the complete report."}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                This development is expected to have significant implications for institutional investors and retail traders alike. Our proprietary sentiment engine suggests a strong correlation between these headlines and upcoming volatility trends.
              </p>
            </div>

            {/* Commenting System */}
            <section className="space-y-6 pt-10 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Community Insights ({comments.length})
                </h3>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 shadow-inner">
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your analysis with the community..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm min-h-[100px] resize-none"
                />
                <div className="flex justify-end mt-2 pt-2 border-t border-border/50">
                  <button 
                    onClick={handlePostComment}
                    className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Comment
                  </button>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                {comments.map((c, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={i} 
                    className="p-4 bg-secondary/20 border border-border/50 rounded-2xl space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{c.user}</span>
                      <span className="text-[10px] text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-sm text-foreground/90">{c.text}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-6">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-primary uppercase tracking-wider text-xs">AI Impact Analysis</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50">
                  <span className="text-xs text-muted-foreground">Market Sentiment</span>
                  <div className={`flex items-center gap-1 font-mono text-xs font-bold ${news.sentiment === 'positive' ? 'text-bullish' : 'text-bearish'}`}>
                    {news.sentiment === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {news.sentiment.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50">
                  <span className="text-xs text-muted-foreground">Volatility Index</span>
                  <span className="font-mono text-xs font-bold text-warning">MEDIUM</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Predicted Sector Correlation</span>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '84%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>Weak</span>
                    <span>Strong (84%)</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed italic border-t border-primary/10 pt-4">
                "This news event correlates with 92% of historical price surges in the Technology sector over the last 5 years."
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-[2rem] space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <h4 className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Verification Pulse</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                This information has been verified across <span className="text-foreground font-semibold">12 independent financial data streams</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NewsDetailPage;
