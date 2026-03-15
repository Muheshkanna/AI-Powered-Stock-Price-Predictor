import React from 'react';
import { AlertTriangle, Zap } from 'lucide-react';

interface Anomaly {
  symbol: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  time: string;
}

const AnomalyTicker: React.FC<{ anomalies: Anomaly[] }> = ({ anomalies }) => {
  const hasHigh = anomalies.some(a => a.severity === 'high');

  return (
    <div className={`h-7 flex items-center overflow-hidden border-b text-meta font-mono ${
      hasHigh ? 'bg-bearish/5 border-bearish/20' : 'bg-card border-border'
    }`}>
      <div className="flex items-center gap-1.5 px-3 shrink-0 border-r border-border">
        {hasHigh && <span className="w-1.5 h-1.5 rounded-full bg-bearish animate-pulse-glow" />}
        <Zap className="w-3 h-3 text-muted-foreground" />
        <span className="text-muted-foreground">ALERTS</span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="animate-ticker flex items-center gap-6 whitespace-nowrap">
          {[...anomalies, ...anomalies].map((a, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${
                a.severity === 'high' ? 'bg-bearish' : a.severity === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
              }`} />
              <span className="text-foreground font-semibold">{a.symbol}</span>
              <span className="text-muted-foreground">{a.message}</span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground/50">{a.time}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnomalyTicker;
