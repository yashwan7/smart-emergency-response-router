import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Navigation, 
  UserCheck, 
  Hospital, 
  Clock, 
  CheckCircle2, 
  LogOut, 
  TrendingUp,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

export const SectionAllocations = () => {
  const { allocations, dischargePatient } = useSimulation();

  const activeTransits = allocations.filter(a => a.status === 'IN_TRANSIT');
  const admittedOrDischarged = allocations.filter(a => a.status !== 'IN_TRANSIT');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="glass-pill text-[var(--color-success)] border-[var(--color-success)]/30">
            STEP 7 & STEP 9 Telemetry
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">Allocation Logs & Resource Releases</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Live Dispatch Allocations & Telemetry
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Real-time tracking of assigned emergency cases, reserved beds, active doctor assignments, and live capacity release triggers.
        </p>
      </div>

      {/* Active In-Transit Allocations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[var(--color-primary)] animate-pulse" />
            <h3 className="text-lg font-bold text-white">Active Ambulances & Transit Dispatches</h3>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
              {activeTransits.length} Active
            </span>
          </div>
        </div>

        {activeTransits.length === 0 ? (
          <div className="glass-panel p-8 text-center text-xs text-[var(--text-secondary)]">
            No emergency ambulances currently in transit. Use "Run Scheduler Cycle" in the Header or Overview section to dispatch waiting patients!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTransits.map((alloc) => (
              <div key={alloc.id} className="glass-panel p-6 space-y-4 relative overflow-hidden border-l-4 border-l-[var(--color-primary)]">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--color-primary)]">{alloc.id}</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{alloc.patientName}</h4>
                  </div>
                  
                  <span className="glass-pill text-[var(--color-warning)] bg-amber-500/10 border-amber-500/30">
                    <Clock className="w-3.5 h-3.5 animate-spin-slow" /> ETA {alloc.etaMins} mins
                  </span>
                </div>

                {/* Destination & Assignment Details */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-[var(--border-glass)] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Hospital className="w-4 h-4 text-[var(--color-primary)]" /> Target Destination:
                    </span>
                    <strong className="text-white font-semibold">{alloc.hospitalName}</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Reserved Bed Unit:</span>
                    <span className="font-mono text-[var(--color-success)] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {alloc.allocatedBed}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Assigned Specialist:</span>
                    <strong className="text-white">{alloc.allocatedDoctor}</strong>
                  </div>
                </div>

                {/* Transit Ambulance Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-mono">
                    <span>Dispatch Progress</span>
                    <span>{alloc.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-blue)] transition-all duration-500"
                      style={{ width: `${alloc.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Footer Action: Discharge & Release */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">Allocated at {alloc.allocatedAt}</span>

                  <button
                    onClick={() => dischargePatient(alloc.id)}
                    className="btn-glass text-xs py-1.5 px-3 text-[var(--color-success)] hover:border-[var(--color-success)]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Discharge & Release Bed</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Allocation Log Stream */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--color-purple)]" />
          <h3 className="text-lg font-bold text-white">Allocation Log Database Stream</h3>
        </div>

        <div className="glass-panel p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border-glass)] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Patient Case</th>
                <th className="py-3 px-4">Hospital Destination</th>
                <th className="py-3 px-4">Allocated Bed</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-glass)] text-xs text-white">
              {allocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono text-[var(--color-primary)] font-bold">{alloc.id}</td>
                  <td className="py-3 px-4 font-medium">{alloc.patientName}</td>
                  <td className="py-3 px-4">{alloc.hospitalName}</td>
                  <td className="py-3 px-4 font-mono text-[var(--color-success)] font-bold">{alloc.allocatedBed}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{alloc.allocatedDoctor}</td>
                  <td className="py-3 px-4 text-[var(--text-muted)] font-mono">{alloc.allocatedAt}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      alloc.status === 'IN_TRANSIT' ? 'bg-amber-500/20 text-[var(--color-warning)] border border-amber-500/30' : 'bg-emerald-500/20 text-[var(--color-success)] border border-emerald-500/30'
                    }`}>
                      {alloc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
