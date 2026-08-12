import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Activity, Clock, ShieldCheck, Zap, AlertTriangle, Layers } from 'lucide-react';

export const SystemActivityTimeline = ({ limit = 6 }) => {
  const { systemEvents = [] } = useSimulation();

  const displayEvents = systemEvents.slice(0, limit);

  return (
    <div className="glass-panel p-5 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Operational Activity & Decision Timeline
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Real System State Log
        </span>
      </div>

      {/* Timeline Stream List */}
      <div className="space-y-3">
        {displayEvents.map((evt) => {
          let badgeBg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
          if (evt.type === 'ALLOCATION') badgeBg = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
          if (evt.type === 'SCHEDULER') badgeBg = 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
          if (evt.type === 'ALERT') badgeBg = 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';

          return (
            <div 
              key={evt.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3 transition-all hover:border-slate-300 dark:hover:border-slate-600"
            >
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {evt.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {evt.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {evt.description}
                </p>
              </div>

              <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border ${badgeBg} font-mono shrink-0 hidden sm:inline-block`}>
                {evt.badge || evt.type}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
