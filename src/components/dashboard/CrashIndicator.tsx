import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface CrashData {
  overall: number;
  factors: { name: string; value: number; status: 'normal' | 'warning' | 'critical' }[];
}

const CrashIndicator: React.FC<{ data: CrashData }> = ({ data }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-semibold text-foreground">{data.overall}%</span>
          <span className="text-meta text-muted-foreground">crash probability</span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-meta font-mono ${
          data.overall < 15 ? 'bg-bullish/10 text-bullish' :
          data.overall < 40 ? 'bg-warning/10 text-warning' :
          'bg-bearish/10 text-bearish'
        }`}>
          <Shield className="w-3 h-3" />
          {data.overall < 15 ? 'STABLE' : data.overall < 40 ? 'ELEVATED' : 'HIGH RISK'}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="h-2 bg-secondary rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${data.overall}%`,
            background: data.overall < 15
              ? 'hsl(150 50% 45%)'
              : data.overall < 40
              ? 'hsl(40 80% 55%)'
              : 'hsl(0 65% 50%)',
          }}
        />
      </div>

      <div className="space-y-2">
        {data.factors.map(factor => (
          <div key={factor.name} className="flex items-center justify-between">
            <span className="text-meta text-muted-foreground">{factor.name}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-meta text-foreground">{factor.value}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${
                factor.status === 'normal' ? 'bg-bullish' :
                factor.status === 'warning' ? 'bg-warning' : 'bg-bearish'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrashIndicator;
