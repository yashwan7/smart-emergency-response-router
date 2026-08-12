import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { GoogleHospitalMap } from './hospitals/GoogleHospitalMap';
import { 
  Activity, 

  Users, 
  AlertTriangle, 
  ShieldAlert,
  Hospital, 
  Clock, 
  Zap, 
  Flame, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Smartphone,
  ChevronRight
} from 'lucide-react';

export const SectionOverview = ({ onOpenNewEmergencyModal }) => {
  const { 
    emergencies, 
    hospitals, 
    allocations, 
    alerts, 
    runAllocationScheduler, 
    triggerSurgeSimulation,
    setActiveTab 
  } = useSimulation();

  const waitingCount = emergencies.filter(e => e.status === 'WAITING').length;
  const criticalCount = emergencies.filter(e => e.esiLevel <= 2 && e.status === 'WAITING').length;
  const onlineHospitals = hospitals.filter(h => h.status === 'ONLINE').length;
  const totalBeds = hospitals.reduce((acc, h) => acc + h.icuAvailable + h.generalAvailable, 0);

  const kpis = [
    {
      title: 'Active Emergencies',
      value: emergencies.length,
      trend: '+12% vs last hr',
      color: 'var(--color-primary)',
      icon: Activity,
      glow: 'shadow-[0_0_20px_rgba(0,242,254,0.15)]'
    },
    {
      title: 'Patients Waiting',
      value: waitingCount,
      trend: 'Aging Heap Active',
      color: 'var(--color-warning)',
      icon: Users,
      glow: 'shadow-[0_0_20px_rgba(255,179,0,0.15)]'
    },
    {
      title: 'Critical ESI 1-2 Cases',
      value: criticalCount,
      trend: 'Priority Override',
      color: 'var(--color-emergency)',
      icon: AlertTriangle,
      glow: 'shadow-[0_0_20px_rgba(255,59,92,0.2)]'
    },
    {
      title: 'Hospitals Feasible',
      value: `${onlineHospitals}/${hospitals.length}`,
      trend: `${totalBeds} Beds Free`,
      color: 'var(--color-success)',
      icon: Hospital,
      glow: 'shadow-[0_0_20px_rgba(0,230,118,0.15)]'
    },
    {
      title: 'Avg Allocation ETA',
      value: '11.4 min',
      trend: 'Google Maps Sim',
      color: 'var(--color-purple)',
      icon: Clock,
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner & Quick Controls */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-t-2 border-t-[var(--color-primary)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="glass-pill text-[var(--color-primary)] border-[var(--color-primary)]/30">
                <Cpu className="w-3.5 h-3.5" /> Hackathon Project Scope • 3-Person Team
              </span>
              <span className="glass-pill text-[var(--color-success)] border-[var(--color-success)]/30">
                <ShieldCheck className="w-3.5 h-3.5" /> ESI-Inspired Allocation
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Command Hub & Real-Time System Vitals
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-3xl">
              An emergency case arrives via API, receives an ESI-inspired severity score, enters an aging priority queue, and is routed to the optimal hospital based on resource constraints and Google Maps ETA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => runAllocationScheduler()}
              className="btn-primary flex-1 sm:flex-initial text-xs font-bold py-3"
            >
              <Zap className="w-4 h-4" />
              <span>Run Allocation Cycle</span>
            </button>

            <button
              onClick={triggerSurgeSimulation}
              className="btn-purple flex-1 sm:flex-initial text-xs font-bold py-3"
            >
              <Flame className="w-4 h-4" />
              <span>Simulate Outbreak Surge</span>
            </button>

            <button
              onClick={onOpenNewEmergencyModal}
              className="btn-glass flex-1 sm:flex-initial text-xs py-3 text-white"
            >
              <span>+ Add Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`glass-panel glass-panel-hover p-5 relative overflow-hidden ${kpi.glow}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5"
                  style={{ color: kpi.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['JetBrains_Mono']">
                  {kpi.value}
                </span>
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                  {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Google Maps Regional Dispatcher */}
      <GoogleHospitalMap 
        hospitals={hospitals} 
        height="420px" 
      />

      {/* Modern Section Split Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        
        {/* Priority Queue Spotlight Card */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[var(--color-warning)]" />
                <h3 className="text-base font-bold text-white">Priority Queue Spotlight</h3>
              </div>
              <button 
                onClick={() => setActiveTab('triage')}
                className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-semibold"
              >
                View All Queue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {emergencies.slice(0, 3).map((patient) => (
                <div 
                  key={patient.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-[var(--border-glass)] flex items-center justify-between hover:border-[var(--border-glass-bright)] transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{patient.id}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white esi-badge-${patient.esiLevel}`}>
                        Level {patient.esiLevel}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {patient.symptoms.join(', ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[var(--color-primary)] font-['JetBrains_Mono']">
                      Score: {patient.priorityScore}
                    </span>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Wait: {Math.floor(patient.waitTimeSeconds / 60)}m {patient.waitTimeSeconds % 60}s
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-glass)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Formula: (Severity × W_s) + (Aging × WaitTime)</span>
            <span className="text-[var(--color-success)] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Starvation Prevented
            </span>
          </div>
        </div>

        {/* Hospital Feasibility Spotlight Card */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Hospital className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="text-base font-bold text-white">Hospital Capacity Feasibility</h3>
              </div>
              <button 
                onClick={() => setActiveTab('hospitals')}
                className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-semibold"
              >
                Inspect Maps <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {hospitals.slice(0, 3).map((hosp) => (
                <div key={hosp.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{hosp.name}</span>
                    <span className="text-[var(--text-secondary)] font-['JetBrains_Mono']">
                      {hosp.distanceKm} km • {hosp.baseEtaMins} min ETA
                    </span>
                  </div>
                  
                  {/* Capacity Bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                    <div 
                      className="h-full bg-[var(--color-primary)] transition-all duration-500" 
                      style={{ width: `${(hosp.icuAvailable / hosp.icuTotal) * 100}%` }}
                      title={`ICU Beds: ${hosp.icuAvailable}/${hosp.icuTotal}`}
                    />
                    <div 
                      className="h-full bg-[var(--color-success)] transition-all duration-500" 
                      style={{ width: `${(hosp.generalAvailable / hosp.generalTotal) * 100}%` }}
                      title={`General Beds: ${hosp.generalAvailable}/${hosp.generalTotal}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span>ICU: <strong className="text-white">{hosp.icuAvailable}/{hosp.icuTotal}</strong> free</span>
                    <span>General: <strong className="text-white">{hosp.generalAvailable}/{hosp.generalTotal}</strong> free</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-glass)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Feasibility check before Google Maps ETA call</span>
            <span className="text-[var(--color-primary)] font-semibold">API Filtered</span>
          </div>
        </div>

        {/* Live Alerts Stream Card */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[var(--color-purple)]" />
                <h3 className="text-base font-bold text-white">Twilio & Alert Telemetry</h3>
              </div>
              <button 
                onClick={() => setActiveTab('alerts')}
                className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-semibold"
              >
                Alert Logs <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alt) => (
                <div 
                  key={alt.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-[var(--border-glass)] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${alt.type === 'CRITICAL' ? 'text-[#ff6b81]' : 'text-[var(--color-warning)]'}`}>
                      {alt.title}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">{alt.timestamp}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                    {alt.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-glass)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Channels: Twilio SMS + SSE Dashboard</span>
            <span className="text-[var(--color-purple)] font-bold">15-min Z-score Tracker</span>
          </div>
        </div>

      </div>

      {/* Project Pitch & Hackathon Architecture Statement */}
      <div className="glass-panel p-6 bg-gradient-to-r from-blue-950/30 via-slate-900/40 to-purple-950/30 border border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              <Layers className="w-4 h-4" /> Core Hackathon Engineering Pitch
            </div>
            <p className="text-sm sm:text-base font-medium text-white italic">
              "We built a real-time constrained resource allocation system for emergency hospital routing. Incoming cases are classified using an ESI-inspired deterministic severity model and placed in an aging priority queue to prevent starvation. The allocation engine checks real hospital capacity and resource constraints, uses travel information from Google Maps, and assigns each feasible case to the best available hospital. The state is streamed to a live React dashboard, while anomaly detection identifies emergency surges and Twilio sends critical alerts."
            </p>
          </div>
          <button
            onClick={() => setActiveTab('blueprint')}
            className="btn-glass text-xs text-white whitespace-nowrap self-stretch md:self-auto justify-center"
          >
            <span>View Architecture Blueprint</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
