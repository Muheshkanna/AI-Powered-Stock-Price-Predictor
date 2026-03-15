import React from 'react';

interface Sector {
  name: string;
  change: number;
  stocks: number;
}

const SectorHeatmap: React.FC<{ sectors: Sector[] }> = ({ sectors }) => {
  const maxAbs = Math.max(...sectors.map(s => Math.abs(s.change)));

  return (
    <div className="grid grid-cols-3 gap-1">
      {sectors.map(sector => {
        const intensity = Math.abs(sector.change) / maxAbs;
        return (
          <div
            key={sector.name}
            className="p-2.5 rounded-sm cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: sector.change >= 0
                ? `hsl(150 50% 30% / ${0.15 + intensity * 0.4})`
                : `hsl(0 65% 35% / ${0.15 + intensity * 0.4})`,
            }}
          >
            <div className="text-meta font-medium text-foreground truncate">{sector.name}</div>
            <div className={`font-mono text-meta ${sector.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
            </div>
            <div className="text-meta text-muted-foreground font-mono">{sector.stocks} stocks</div>
          </div>
        );
      })}
    </div>
  );
};

export default SectorHeatmap;
