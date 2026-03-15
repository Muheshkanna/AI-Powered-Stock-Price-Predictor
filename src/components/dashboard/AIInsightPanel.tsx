import React from 'react';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';

interface Insight {
  stock: string;
  signal: 'bullish' | 'bearish';
  confidence: number;
  explanation: string;
  factors: string[];
}

const AIInsightPanel: React.FC<{ insights: Insight[] }> = ({ insights }) => {
  const [selected, setSelected] = React.useState(0);
  const insight = insights[selected];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-meta font-mono uppercase tracking-wider text-muted-foreground">AI Insight Engine</h3>
      </div>

      <div className="flex gap-1 mb-3">
        {insights.map((ins, i) => (
          <button
            key={ins.stock}
            onClick={() => setSelected(i)}
            className={`px-2 py-1 rounded-sm text-meta font-mono transition-colors ${
              i === selected ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-transparent hover:bg-secondary/80'
            }`}
          >
            {ins.stock}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-meta font-mono font-semibold ${
            insight.signal === 'bullish' ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'
          }`}>
            {insight.signal === 'bullish' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {insight.signal.toUpperCase()}
          </span>
          <span className="font-mono text-meta text-primary">Confidence: {insight.confidence}%</span>
        </div>

        <p className="text-ui text-secondary-foreground leading-relaxed" style={{ textWrap: 'pretty' }}>
          {insight.explanation}
        </p>

        <div className="space-y-1">
          <span className="text-meta font-mono text-muted-foreground uppercase tracking-wider">Key Factors</span>
          <div className="flex flex-wrap gap-1">
            {insight.factors.map((factor, i) => (
              <span key={i} className="px-2 py-0.5 bg-secondary border border-border/50 rounded-sm text-meta text-foreground">
                {factor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightPanel;
