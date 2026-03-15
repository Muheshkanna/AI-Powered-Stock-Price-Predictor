import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PricePoint } from '@/lib/mockData';

interface StockChartProps {
  data: PricePoint[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const last30 = data.slice(-45);

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={last30} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(220 60% 55%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(220 60% 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(220 60% 55%)" stopOpacity={0.08} />
              <stop offset="100%" stopColor="hsl(220 60% 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 10% 25%)" strokeOpacity={0.5} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: 'hsl(215 12% 50%)', fontFamily: 'Geist Mono, monospace' }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(230 10% 25%)' }}
            tickFormatter={(val: string) => val.slice(5)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(215 12% 50%)', fontFamily: 'Geist Mono, monospace' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(val: number) => `$${val.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(230 12% 17%)',
              border: '1px solid hsl(230 10% 25%)',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: 'Geist Mono, monospace',
              color: 'hsl(210 20% 90%)',
            }}
            formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
          />
          {/* Confidence band */}
          <Area type="monotone" dataKey="confidenceHigh" stroke="none" fill="url(#confidenceGradient)" />
          <Area type="monotone" dataKey="confidenceLow" stroke="none" fill="url(#confidenceGradient)" />
          {/* Actual price */}
          <Area type="monotone" dataKey="close" stroke="hsl(220 60% 55%)" strokeWidth={1.5} fill="url(#priceGradient)" />
          {/* AI Prediction */}
          <Area type="monotone" dataKey="predicted" stroke="hsl(220 60% 55%)" strokeWidth={1.5} strokeDasharray="6 3" fill="none" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-meta font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-px bg-primary inline-block" /> Price
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-px bg-primary inline-block" style={{ borderTop: '1.5px dashed hsl(220 60% 55%)' }} /> AI Prediction
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-2 bg-primary/10 inline-block rounded-sm" /> Confidence Band
        </span>
      </div>
    </div>
  );
};

export default StockChart;
