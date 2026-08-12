import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Activity, 
  ShieldAlert, 
  Hospital, 
  Navigation, 
  Zap, 
  TrendingUp, 
  BellRing, 
  FileCode2, 
  PlusCircle,
  Radio,
  Clock
} from 'lucide-react';

export const Header = ({ onOpenNewEmergencyModal }) => {
  const { activeTab, setActiveTab, runAllocationScheduler, alerts } = useSimulation();

  const navItems = [
    { id: 'overview', label: 'Command Hub', icon: Activity },
    { id: 'triage', label: 'Triage Queue', icon: ShieldAlert, badge: 'Starvation Engine' },
    { id: 'hospitals', label: 'Hospital Router', icon: Hospital, badge: 'Maps Feasibility' },
    { id: 'allocations', label: 'Live Telemetry', icon: Navigation },
    { id: 'alerts', label: 'Surge & Twilio Alerts', icon: BellRing, badgeCount: alerts.length },
    { id: 'blueprint', label: 'Architecture & Blueprint', icon: FileCode2 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 border-b border-[var(--border-glass)] backdrop-blur-xl bg-[#0a0d14]/75">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Brand & System Vitals */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#ff3b5c]/20 to-[#00f2fe]/20 border border-[var(--border-glass-bright)] shadow-[0_0_20px_rgba(0,242,254,0.25)]">
              <Activity className="w-6 h-6 text-[var(--color-primary)] animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-emergency)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-emergency)]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  Smart Emergency Router
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                  Hackathon Scope
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-2 mt-0.5">
                <Radio className="w-3 h-3 text-[var(--color-success)] animate-pulse" /> Live Constraint Allocation System
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={onOpenNewEmergencyModal}
              className="p-2 rounded-lg bg-[var(--color-emergency)]/20 text-[#ff6b81] border border-[var(--color-emergency)]/30"
              title="New Emergency"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto p-1.5 rounded-2xl bg-white/[0.03] border border-[var(--border-glass)] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-blue)]/20 text-white border border-[var(--color-primary)]/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
                <span>{item.label}</span>

                {item.badgeCount ? (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-[var(--color-emergency)] text-white">
                    {item.badgeCount}
                  </span>
                ) : null}

                {item.badge && !isActive && (
                  <span className="hidden xl:inline-block ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/5 text-[var(--text-muted)]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => runAllocationScheduler()}
            className="btn-glass text-xs text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 hover:shadow-[0_0_15px_rgba(0,242,254,0.2)]"
          >
            <Zap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Run Scheduler</span>
          </button>

          <button
            onClick={onOpenNewEmergencyModal}
            className="btn-primary text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Emergency</span>
          </button>
        </div>

      </div>
    </header>
  );
};
