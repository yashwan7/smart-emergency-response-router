import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { EsiBadge } from '../common/EsiBadge';
import { ChevronRight, Clock, AlertTriangle } from 'lucide-react';

export const LiveEmergencyQueuePreview = () => {
  const { emergencies, setActiveTab, setSelectedPatientId } = useSimulation();

  const waitingPatients = emergencies.filter(e => e.status === 'WAITING');

  return (
    <div className="glass-card p-5 relative overflow-hidden flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>EMERGENCY QUEUE</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
              {waitingPatients.length} Waiting
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Priority-ordered live ESI triage queue
          </p>
        </div>

        <button
          onClick={() => setActiveTab('emergencies')}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Patient Cards / Rows */}
      <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
        {waitingPatients.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-medium">
            No waiting patients in queue. All cases allocated!
          </div>
        ) : (
          waitingPatients.map((patient, idx) => {
            const formatWait = (sec) => {
              const mins = Math.floor(sec / 60);
              const s = sec % 60;
              return mins > 0 ? `${mins}m ${s}s` : `${sec}s`;
            };

            const baseSev = (6 - patient.esiLevel) * severityWeight;
            const agingPts = ((patient.waitTimeSeconds || 0) * agingWeight) / 10;

            return (
              <div
                key={patient.id}
                className="group p-3 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Queue Position & Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                      #{idx + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">{patient.id}</span>
                        <EsiBadge level={patient.esiLevel} size="sm" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                        {patient.symptoms.slice(0, 2).join(' · ')}
                      </p>
                    </div>
                  </div>

                  {/* Right: Dynamic Priority Score */}
                  <div className="text-right shrink-0 font-mono">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Priority Score
                    </div>
                    <div className={`text-base font-black leading-none ${
                      patient.esiLevel === 1 ? 'text-rose-600 dark:text-rose-400' : patient.esiLevel === 2 ? 'text-amber-600 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400'
                    }`}>
                      {patient.priorityScore}
                    </div>
                  </div>
                </div>

                {/* Formula & Required Resources */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/40 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span>Severity ({baseSev}) + Wait ({formatWait(patient.waitTimeSeconds)} = +{agingPts.toFixed(1)})</span>
                  </div>

                  <button
                    onClick={() => setDecisionModalPatientId(patient.id)}
                    className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 font-bold hover:bg-cyan-100 border border-cyan-200 dark:border-cyan-800 transition-colors font-sans"
                  >
                    Allocation Reasoning →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>


      {/* Footnote */}
      <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Click patient row for candidate matching drawer</span>
        <span className="font-mono text-slate-400">ESI-inspired simulation</span>
      </div>

    </div>
  );
};
