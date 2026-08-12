import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const KpiCard = ({ icon: Icon, title, value, unit = '', trend, trendType = 'up', sparklineColor = '#3b82f6', iconBg = 'bg-blue-50 text-blue-600' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth count animation on mount / value change
  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const duration = 800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const isNumeric = typeof value === 'number' || !isNaN(parseInt(value, 10));

  return (
    <div className="glass-card glass-card-hover p-4 relative overflow-hidden flex flex-col justify-between group">
      {/* Top icon and trend */}
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2.5 rounded-xl border border-slate-200/50 shadow-2xs ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            trendType === 'up' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : trendType === 'down' 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            {trendType === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
            {trendType === 'down' && <TrendingDown className="w-3 h-3 text-blue-600" />}
            {trendType === 'neutral' && <Minus className="w-3 h-3 text-slate-400" />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Main Number & Title */}
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1 font-mono">
          <span>{isNumeric ? displayValue : value}</span>
          {unit && <span className="text-sm font-normal text-slate-500 font-sans">{unit}</span>}
        </div>
        <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
          {title}
        </div>
      </div>

      {/* Subtle animated mini sparkline SVG background */}
      <div className="absolute bottom-1 right-2 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none">
        <svg width="64" height="24" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M2 18C10 18 14 6 22 12C30 18 38 4 46 10C54 16 58 2 62 6" 
            stroke={sparklineColor} 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
