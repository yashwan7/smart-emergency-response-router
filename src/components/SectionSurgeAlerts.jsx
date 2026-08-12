import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  BellRing, 
  Flame, 
  Smartphone, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Send,
  Zap,
  Activity,
  Radio
} from 'lucide-react';

export const SectionSurgeAlerts = () => {
  const { alerts, triggerSurgeSimulation } = useSimulation();

  // Simulated 15-minute window arrival history data
  const [arrivalData] = useState([
    { window: '09:00 - 09:15', count: 4, baseline: 5, threshold: 9 },
    { window: '09:15 - 09:30', count: 6, baseline: 5, threshold: 9 },
    { window: '09:30 - 09:45', count: 3, baseline: 5, threshold: 9 },
    { window: '09:45 - 10:00', count: 5, baseline: 5, threshold: 9 },
    { window: '10:00 - 10:15', count: 7, baseline: 5, threshold: 9 },
    { window: '10:15 - 10:30 (Current)', count: 18, baseline: 5, threshold: 9, isBreach: true }
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="glass-pill text-[var(--color-purple)] border-[var(--color-purple)]/30">
              STEP 10 & STEP 11 Engine
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">15-min Window Moving Average & Twilio SMS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Anomaly Surge Detection & Twilio Broadcast
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Person 3 component: Monitors 15-minute emergency arrival rate against historical moving average baseline (+2σ trigger).
          </p>
        </div>

        <button
          onClick={triggerSurgeSimulation}
          className="btn-purple text-xs font-bold py-3 px-5 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <Flame className="w-4 h-4" />
          <span>Simulate Outbreak Surge (+3.1σ Spike)</span>
        </button>
      </div>

      {/* Anomaly Detection Formula & Chart Banner */}
      <div className="glass-panel p-6 sm:p-8 space-y-6 relative overflow-hidden border-t-2 border-t-[var(--color-purple)]">
        
        {/* Formula Display */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-[var(--color-purple)] uppercase tracking-wider">
              Z-Score Anomaly Trigger Formula
            </span>
            <p className="text-sm font-mono text-white">
              flag_surge = (current_arrivals &gt; baseline_avg + 2 × stddev)
            </p>
          </div>
          <span className="glass-pill text-[var(--color-emergency)] border-[var(--color-emergency)]/30 font-extrabold">
            Status: Outbreak Detection Active
          </span>
        </div>

        {/* 15-Minute Window Arrival Visualizer Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
            <span>15-Minute Window Emergency Influx Tracker</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[var(--color-primary)] inline-block" /> Actual Arrivals</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[var(--text-muted)] inline-block" /> Historical Baseline (5.0)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#ff3b5c] inline-block" /> +2σ Threshold (9.0)</span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-4 rounded-xl bg-white/[0.02] border border-[var(--border-glass)] relative">
            
            {/* Threshold Line at 9 */}
            <div className="absolute left-0 right-0 top-[40%] border-b-2 border-dashed border-[#ff3b5c]/60 pointer-events-none flex items-center justify-end pr-4">
              <span className="text-[10px] font-bold text-[#ff3b5c] bg-[#0a0d14] px-1.5 py-0.5 rounded border border-[#ff3b5c]/30">
                +2σ Surge Threshold (9.0)
              </span>
            </div>

            {arrivalData.map((d, i) => {
              const heightPercent = Math.min(100, (d.count / 20) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group">
                  <span className={`text-xs font-mono font-bold ${d.isBreach ? 'text-[#ff6b81]' : 'text-white'}`}>
                    {d.count}
                  </span>

                  <div className="w-full max-w-[48px] bg-white/10 rounded-t-lg relative overflow-hidden flex flex-col justify-end" style={{ height: '80%' }}>
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        d.isBreach 
                          ? 'bg-gradient-to-t from-red-600 via-[#ff3b5c] to-amber-400 shadow-[0_0_20px_rgba(255,59,92,0.5)]' 
                          : 'bg-gradient-to-t from-[var(--color-blue)] to-[var(--color-primary)]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-[10px] text-[var(--text-muted)] font-mono text-center truncate max-w-full">
                    {d.window.split(' ')[0]}
                  </span>
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* Grid: Twilio Mobile Broadcast Visualizer & Alert Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Twilio Mobile Broadcast Simulator */}
        <div className="glass-panel p-6 space-y-4 border-l-4 border-l-[var(--color-purple)]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[var(--color-purple)]" />
            <h3 className="text-base font-bold text-white">Twilio Outbreak SMS Broadcast</h3>
          </div>
          
          <p className="text-xs text-[var(--text-secondary)]">
            Simulated Twilio REST API integration sending SMS alerts to emergency response personnel when surge threshold is breached.
          </p>

          {/* Simulated Mobile Screen */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 font-sans">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1"><Radio className="w-3 h-3 text-emerald-400" /> Twilio Emergency Alert</span>
              <span>Just now</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-purple-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> 🚨 SURGE OUTBREAK ALERT
              </div>
              <p className="text-[11px] leading-relaxed">
                Emergency arrivals spiked to 18 cases in 15min window (+3.1σ). Hospital capacities set to Priority Reserve.
              </p>
              <div className="text-[9px] text-purple-400 font-mono pt-1">
                From: +1 (800) TWILIO-ALERT • Status: DELIVERED
              </div>
            </div>
          </div>
        </div>

        {/* Live Alert History Log */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[var(--color-warning)]" />
              <h3 className="text-base font-bold text-white">System Alert History Database Log</h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">{alerts.length} Total Alerts</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {alerts.map((alt) => (
              <div 
                key={alt.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-[var(--border-glass)] hover:border-white/20 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{alt.id}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      alt.type === 'CRITICAL' 
                        ? 'bg-red-500/20 text-[#ff6b81] border border-red-500/30' 
                        : alt.type === 'SURGE' 
                          ? 'bg-purple-500/20 text-[#c084fc] border border-purple-500/30' 
                          : 'bg-amber-500/20 text-[#ffb300] border border-amber-500/30'
                    }`}>
                      {alt.type}
                    </span>
                    <h4 className="text-xs font-bold text-white">{alt.title}</h4>
                  </div>
                  
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{alt.timestamp}</span>
                </div>

                <p className="text-xs text-[var(--text-secondary)]">
                  {alt.message}
                </p>

                <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] pt-1">
                  <span>Channel: <strong className="text-white">{alt.channel}</strong></span>
                  {alt.sentTwilio && (
                    <span className="text-[var(--color-success)] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Twilio SMS Dispatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
