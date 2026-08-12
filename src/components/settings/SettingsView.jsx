import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Sliders, Bell, Map, ShieldCheck, Cpu, Sun, Moon } from 'lucide-react';

export const SettingsView = () => {
  const { 
    severityWeight, 
    setSeverityWeight, 
    agingWeight, 
    setAgingWeight,
    theme,
    toggleTheme 
  } = useSimulation();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          SYSTEM PARAMETERS & CONFIGURATION
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Deterministic ESI queue weights, alert thresholds, theme appearance, and integration settings
        </p>
      </div>

      {/* Theme Appearance Section */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-400" />}
            <span>Interface Theme Appearance</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between Apple-level crisp Light mode and Cyber Medical Dark mode
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-all shadow-sm flex items-center gap-2"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
        </button>
      </div>

      {/* Algorithm Tuning Section */}
      <div className="glass-card p-6 space-y-6">
        <div className="border-b border-slate-200/60 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-600" />
            <span>Priority Engine Tuning Weights</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Formula: Priority = (6 - ESI) × Severity Weight + (Wait Time × Aging Weight / 10)
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Severity Level Weight multiplier</span>
              <span className="font-mono text-sm text-rose-600">{severityWeight}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={severityWeight}
              onChange={(e) => setSeverityWeight(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1x (Low Priority)</span>
              <span>10x (Standard ESI)</span>
              <span>20x (Extreme Emergency Priority)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Wait Time Aging Weight multiplier (Prevents Starvation)</span>
              <span className="font-mono text-sm text-blue-600">{agingWeight}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={agingWeight}
              onChange={(e) => setAgingWeight(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.1x (Slow Escalation)</span>
              <span>0.5x (Standard)</span>
              <span>2.0x (Rapid Escalation)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200/60 pb-2">
            Notification Rules
          </h3>
          <div className="space-y-2 text-xs text-slate-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-slate-900" />
              <span>Broadcast Twilio SMS on Level 1 & 2 cases</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-slate-900" />
              <span>Trigger alert when ICU capacity reaches &gt;85%</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-slate-900" />
              <span>Enable 15-min outbreak surge anomaly detection</span>
            </label>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200/60 pb-2">
            Integrations & Backend API Status
          </h3>
          <div className="text-xs text-slate-600 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Database Connection:</span>
              <strong className="text-emerald-700">PostgreSQL Connected</strong>
            </div>
            <div className="flex justify-between">
              <span>SSE Real-time Stream:</span>
              <strong className="text-emerald-700">Active (ws://stream:8080)</strong>
            </div>
            <div className="flex justify-between">
              <span>Twilio SMS Gateway:</span>
              <strong className="text-emerald-700">Verified & Active</strong>
            </div>
            <div className="flex justify-between">
              <span>Maps Routing Engine:</span>
              <strong className="text-blue-700">Live Feasibility Matrix</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
