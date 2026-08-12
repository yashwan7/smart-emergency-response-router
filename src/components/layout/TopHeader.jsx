import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Bell, Clock, Calendar, UserCheck, Sparkles, AlertTriangle, Sun, Moon } from 'lucide-react';

const SECTION_TITLES = {
  dashboard: 'Live Operations Overview',
  emergencies: 'Emergency Queue & Management',
  patients: 'Patient Directory & History',
  hospitals: 'Hospital Capacity & Availability',
  map: 'Route & Feasibility Engine',
  resources: 'Resource & Inventory Allocation',
  allocations: 'Active Pipeline & Allocations',
  alerts: 'Real-Time Alert Center',
  analytics: 'Operational Performance Analytics',
  reports: 'Executive Reports & Logs',
  settings: 'System Configuration & Parameters'
};

export const TopHeader = () => {
  const { 
    activeTab, 
    setActiveTab, 
    alerts, 
    setIsNewEmergencyModalOpen,
    triggerSurgeSimulation,
    surgeState,
    theme,
    toggleTheme
  } = useSimulation();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
  
  const formattedDate = currentTime.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <header className="w-full glass-card rounded-none border-b border-slate-200/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 py-3 shadow-2xs sticky top-0 z-20 transition-colors">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Section Title & Status Indicator */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>{SECTION_TITLES[activeTab] || 'Operational Center'}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold">
                <span className="pulse-dot-green" /> System Online
              </span>
              <span className="hidden md:inline">• ESI Deterministic Allocation</span>
            </div>
          </div>

          {/* Surge Warning Badge if Active */}
          {surgeState.isSurge && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Surge Detected (+{surgeState.deviation}%)</span>
            </div>
          )}
        </div>

        {/* Right: Time, Date, Notifications, Theme Toggle, Quick Actions, Admin Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Quick Action Demo Buttons */}
          <div className="hidden xl:flex items-center gap-2">
            <button
              onClick={() => setIsNewEmergencyModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm shadow-rose-600/30 flex items-center gap-1.5"
            >
              <span>+ New Emergency</span>
            </button>

            <button
              onClick={triggerSurgeSimulation}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-sm shadow-amber-500/30 flex items-center gap-1.5"
              title="Simulate sudden arrival surge (+63% anomaly)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Surge</span>
            </button>
          </div>

          {/* Time & Date Display */}
          <div className="hidden sm:flex flex-col items-end text-right border-r border-slate-200/80 dark:border-slate-800 pr-4">
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedTime}</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Light / Dark Mode Toggle Switch */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-800"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold hidden md:inline text-slate-700">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold hidden md:inline text-amber-400">Light</span>
              </>
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Alert Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Admin Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              DA
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Dr. Admin
              </div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                System Admin
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
