import React from 'react';

export const CapacityBar = ({ occupied, total, label, compact = false }) => {
  const percent = total > 0 ? Math.min(100, Math.round((occupied / total) * 100)) : 0;
  const available = Math.max(0, total - occupied);

  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700';

  if (percent >= 85) {
    barColor = 'bg-red-500';
    textColor = 'text-red-700';
  } else if (percent >= 65) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-700';
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="w-16 text-slate-500 truncate">{label}</span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={`font-mono font-medium ${textColor}`}>
          {occupied} / {total}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className={`font-mono font-semibold ${textColor}`}>
          {occupied} occupied / {total} total ({available} free)
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`} 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
