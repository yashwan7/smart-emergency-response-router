import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  Info,
  Building2,
  TrendingUp
} from 'lucide-react';

export const AlertCenter = () => {
  const { alerts, setAlerts, surgeState, triggerSurgeSimulation } = useSimulation();

  const [activeCategory, setActiveCategory] = useState('ALL');

  let filteredAlerts = [...alerts];
  if (activeCategory !== 'ALL') {
    filteredAlerts = filteredAlerts.filter(a => a.type === activeCategory);
  }

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            REAL-TIME ALERT CENTER
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational alerts, capacity breach warnings, and surge detection broadcasts
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors shrink-0"
        >
          Mark All Read
        </button>
      </div>

      {/* Emergency Surge Monitor Card (Section 17 requirement!) */}
      <div className="glass-card p-5 border-l-4 border-l-amber-500 relative overflow-hidden bg-gradient-to-r from-amber-50/50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                Surge Anomaly Engine
              </span>
              {surgeState.isSurge && (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> SURGE DETECTED
                </span>
              )}
            </div>
            
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              Emergency Surge Monitor
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compares current 15-minute emergency count against historical baseline
            </p>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-6 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Current (15-min)</div>
              <div className="text-xl font-black font-mono text-slate-900">{surgeState.currentArrivals}</div>
            </div>

            <div className="w-px h-8 bg-slate-200" />

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Baseline</div>
              <div className="text-xl font-black font-mono text-slate-500">{surgeState.baseline}</div>
            </div>

            <div className="w-px h-8 bg-slate-200" />

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Deviation</div>
              <div className="text-xl font-black font-mono text-amber-600">+{surgeState.deviation}%</div>
            </div>

            <button
              onClick={triggerSurgeSimulation}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm shadow-amber-500/30 flex items-center gap-1.5 ml-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Surge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="glass-card p-4 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'CRITICAL', label: 'Critical' },
          { id: 'CAPACITY', label: 'Capacity' },
          { id: 'SURGE', label: 'Surge Anomaly' },
          { id: 'SYSTEM', label: 'System' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card p-12 text-center text-xs text-slate-400 font-medium">
            No alerts match the selected category.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            let iconBg = 'bg-blue-50 text-blue-600 border-blue-200';
            let Icon = Info;
            let borderStyle = 'border-slate-200';

            if (alert.type === 'CRITICAL') {
              iconBg = 'bg-rose-50 text-rose-600 border-rose-200';
              Icon = AlertTriangle;
              borderStyle = 'border-rose-200 bg-rose-50/30';
            } else if (alert.type === 'CAPACITY') {
              iconBg = 'bg-amber-50 text-amber-600 border-amber-200';
              Icon = Building2;
              borderStyle = 'border-amber-200 bg-amber-50/30';
            } else if (alert.type === 'SURGE') {
              iconBg = 'bg-amber-100 text-amber-800 border-amber-300';
              Icon = TrendingUp;
              borderStyle = 'border-amber-300 bg-amber-50/50';
            }

            return (
              <div
                key={alert.id}
                className={`glass-card p-4 flex items-start justify-between gap-4 transition-all ${borderStyle} ${
                  !alert.read ? 'ring-2 ring-slate-900/10 font-medium' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                        {alert.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-medium">
                      {alert.message}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{alert.timestamp}</span>
                      {alert.sentTwilio && (
                        <span className="ml-2 px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-sans">
                          Twilio SMS Sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {!alert.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" title="Unread Alert" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
