import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  ShieldAlert, 
  Sliders, 
  Clock, 
  Zap, 
  Info, 
  AlertCircle, 
  Flame, 
  CheckCircle,
  TrendingUp,
  Activity,
  Heart
} from 'lucide-react';

export const SectionTriageQueue = ({ onOpenNewEmergencyModal }) => {
  const { 
    emergencies, 
    severityWeight, 
    setSeverityWeight, 
    agingWeight, 
    setAgingWeight, 
    runAllocationScheduler 
  } = useSimulation();

  const esiLevels = [
    { level: 1, name: 'Resuscitation', desc: 'Immediate life threat (e.g. cardiac arrest, severe shock)', color: '#ff2a4b' },
    { level: 2, name: 'Emergent', desc: 'High risk, severe dyspnea or chest pain', color: '#ff7043' },
    { level: 3, name: 'Urgent', desc: 'Multiple resources needed (e.g. open fracture)', color: '#ffb300' },
    { level: 4, name: 'Less Urgent', desc: 'One resource needed (e.g. laceration, fever)', color: '#26a69a' },
    { level: 5, name: 'Non-Urgent', desc: 'No resources needed (e.g. mild cold, rash)', color: '#42a5f5' }
  ];

  const sortedQueue = [...emergencies]
    .filter(p => p.status === 'WAITING')
    .sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="glass-pill text-[var(--color-warning)] border-[var(--color-warning)]/30">
              STEP 5 & STEP 6 Algorithm
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">PriorityQueue & Max-Heap Aging</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Emergency Priority Queue & Starvation Prevention
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Deterministic ESI 1–5 severity scoring combined with continuous aging time to ensure low-severity patients are never starved.
          </p>
        </div>

        <button
          onClick={onOpenNewEmergencyModal}
          className="btn-primary text-xs font-bold self-start md:self-auto py-2.5"
        >
          <span>+ Add Emergency Patient</span>
        </button>
      </div>

      {/* Tunable Starvation Prevention Algorithm Panel */}
      <div className="glass-panel p-6 border-l-4 border-l-[var(--color-warning)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Formula & Explainer */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sliders className="w-5 h-5 text-[var(--color-warning)]" />
              <span>Tunable Max-Heap Starvation Formula</span>
            </div>
            
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-[var(--color-primary)]">
              PriorityScore = (SeverityScore × {severityWeight}) + (WaitingTimeSeconds × {agingWeight})
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              <strong className="text-white">Why Aging Matters:</strong> If allocations were served purely by static severity, continuous Level 1 & Level 2 arrivals would make a Level 4 patient wait forever (Starvation). The aging factor continuously increases the priority score over time.
            </p>
          </div>

          {/* Interactive Sliders */}
          <div className="w-full lg:w-80 space-y-4 p-4 rounded-xl bg-white/[0.02] border border-[var(--border-glass)]">
            <div>
              <div className="flex justify-between text-xs font-semibold text-white mb-1">
                <span>Severity Weight (W_s)</span>
                <span className="text-[var(--color-primary)] font-mono">{severityWeight}</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={severityWeight}
                onChange={(e) => setSeverityWeight(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-white mb-1">
                <span>Aging Weight (W_a)</span>
                <span className="text-[var(--color-warning)] font-mono">{agingWeight}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={agingWeight}
                onChange={(e) => setAgingWeight(Number(e.target.value))}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ESI Severity Matrix Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--color-primary)]" /> ESI 1–5 Triage Simulation Rules
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {esiLevels.map((esi) => (
            <div 
              key={esi.level}
              className="glass-panel p-4 flex flex-col justify-between hover:border-white/20 transition-all"
              style={{ borderTop: `3px solid ${esi.color}` }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded text-white" style={{ background: esi.color }}>
                    Level {esi.level}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">ESI {esi.level}</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">{esi.name}</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                  {esi.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Priority Queue Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-white">Live Max-Heap Priority Queue</h3>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
              {sortedQueue.length} Waiting
            </span>
          </div>

          <button
            onClick={() => runAllocationScheduler()}
            className="btn-primary text-xs font-bold py-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Process Highest Priority</span>
          </button>
        </div>

        {sortedQueue.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[var(--color-success)] mx-auto opacity-80" />
            <h4 className="text-base font-bold text-white">Queue Empty</h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              All emergency patients have been allocated to feasible hospitals! Click "+ Add Emergency Patient" to test the priority scheduler.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedQueue.map((patient, index) => {
              const minutes = Math.floor(patient.waitTimeSeconds / 60);
              const seconds = patient.waitTimeSeconds % 60;
              const isTop = index === 0;

              return (
                <div
                  key={patient.id}
                  className={`glass-panel p-5 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    isTop 
                      ? 'border-2 border-[var(--color-primary)] shadow-[0_0_30px_rgba(0,242,254,0.25)] bg-[var(--bg-card-hover)]' 
                      : 'hover:border-white/20'
                  }`}
                >
                  {isTop && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[var(--color-primary)] to-cyan-600 text-black font-extrabold text-[10px] uppercase px-3 py-1 rounded-bl-xl shadow-md">
                      Highest Heap Priority
                    </div>
                  )}

                  <div>
                    {/* Patient Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-white">{patient.id}</span>
                          <span 
                            className="px-2 py-0.5 text-[10px] font-extrabold rounded-full text-white"
                            style={{ 
                              background: esiLevels.find(e => e.level === patient.esiLevel)?.color || '#ffb300' 
                            }}
                          >
                            Level {patient.esiLevel}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{patient.name}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-extrabold text-[var(--color-primary)] font-['JetBrains_Mono']">
                          {patient.priorityScore}
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Priority Score</span>
                      </div>
                    </div>

                    {/* Vitals & Symptoms */}
                    <div className="space-y-2 py-3 my-3 border-y border-[var(--border-glass)]">
                      <p className="text-xs font-medium text-white flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#ff3b5c]" />
                        <span>Symptoms: {patient.symptoms.join(', ')}</span>
                      </p>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="p-1.5 rounded bg-white/5 text-center">
                          <span className="text-[10px] text-[var(--text-muted)] block">Heart Rate</span>
                          <strong className="text-xs text-white font-mono">{patient.vitals.heartRate} bpm</strong>
                        </div>
                        <div className="p-1.5 rounded bg-white/5 text-center">
                          <span className="text-[10px] text-[var(--text-muted)] block">SpO2</span>
                          <strong className="text-xs text-white font-mono">{patient.vitals.spo2}%</strong>
                        </div>
                        <div className="p-1.5 rounded bg-white/5 text-center">
                          <span className="text-[10px] text-[var(--text-muted)] block">BP</span>
                          <strong className="text-xs text-white font-mono">{patient.vitals.bloodPressure}</strong>
                        </div>
                      </div>

                      {/* Required Resources Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {patient.requiredResources.map((res, i) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Allocation trigger */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-mono">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-warning)] animate-spin-slow" />
                      <span>{minutes}m {seconds}s wait</span>
                    </div>

                    <button
                      onClick={() => runAllocationScheduler(patient.id)}
                      className="btn-glass text-xs py-1.5 px-3 hover:border-[var(--color-primary)] text-[var(--color-primary)]"
                    >
                      <span>Allocate Case</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
