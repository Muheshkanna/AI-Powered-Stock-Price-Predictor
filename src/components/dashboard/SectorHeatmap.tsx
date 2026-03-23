import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Sector {
  name: string;
  change: number;
  stocks: number;
}

const SectorHeatmap: React.FC<{ sectors: Sector[] }> = ({ sectors }) => {
  const navigate = useNavigate();
  const maxAbs = Math.max(...sectors.map(s => Math.abs(s.change)));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {sectors.map(sector => {
        const intensity = Math.abs(sector.change) / maxAbs;
        return (
          <div
            key={sector.name}
            onClick={() => navigate(`/sector/${sector.name}`)}
            className="p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-xl hover:z-10 group relative overflow-hidden"
            style={{
              backgroundColor: sector.change >= 0
                ? `hsla(150, 80%, 20%, ${0.1 + intensity * 0.4})`
                : `hsla(0, 80%, 20%, ${0.1 + intensity * 0.4})`,
            }}
          >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
                {sector.name}
              </div>
              <div className={`text-xl font-black font-mono tracking-tight ${sector.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
              </div>
              <div className="text-[10px] text-muted-foreground/60 font-medium">{sector.stocks} Tracked Assets</div>
            </div>

            {/* Accent pulse line */}
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full ${
              sector.change >= 0 ? 'bg-bullish shadow-[0_0_10px_rgba(var(--bullish),0.5)]' : 'bg-bearish shadow-[0_0_10px_rgba(var(--bearish),0.5)]'
            }`} />
          </div>
        );
      })}
    </div>
  );
};

export default SectorHeatmap;
