import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  Building2, 
  User, 
  ArrowRight, 
  LogOut,
  GitCommit,
  ShieldCheck,
  Activity
} from 'lucide-react';

const PIPELINE_STAGES = [
  { step: 1, label: 'Emergency Received', desc: 'Ingested via Hotline/API' },
  { step: 2, label: 'Severity Calculated', desc: 'ESI-inspired simulation' },
  { step: 3, label: 'Priority Assigned', desc: 'Severity + Aging formula' },
  { step: 4, label: 'Resources Checked', desc: 'ICU, Doctor, Equip verification' },
  { step: 5, label: 'Hospital Selected', desc: 'Spatial distance & feasibility' },
  { step: 6, label: 'Resources Reserved', desc: 'Transactional lock' },
  { step: 7, label: 'Patient Assigned', desc: 'Twilio SMS & Dispatch' }
];

export const AllocationsTimeline = () => {
  const { allocations, dischargePatient } = useSimulation();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          LIVE ALLOCATION PIPELINE & ENGINE
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Deterministic 7-stage resource reservation engine logs
        </p>
      </div>

      {/* 7-Stage Pipeline Visual Graphic */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>7-Stage Deterministic Allocation Engine Pipeline</span>
          <span className="text-emerald-700 font-mono flex items-center gap-1">
            <span className="pulse-dot-green" /> Engine Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {PIPELINE_STAGES.map((stage) => (
            <div 
              key={stage.step}
              className="p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-2xs text-center flex flex-col justify-between relative group hover:border-slate-300 transition-all"
            >
              <div>
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center mx-auto mb-2">
                  {stage.step}
                </div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {stage.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {stage.desc}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Allocations Table */}
      <div className="glass-card overflow-hidden p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ACTIVE RESOURCE ALLOCATIONS ({allocations.length})
            </h3>
            <p className="text-xs text-slate-500">
              Live hospital bed & doctor reservation logs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Allocation ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Routed Hospital</th>
                <th className="py-3 px-4">Bed Reserved</th>
                <th className="py-3 px-4">Doctor Assigned</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 bg-white/60">
              {allocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {alloc.id}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {alloc.patientName}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {alloc.hospitalName}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                    {alloc.allocatedBed}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {alloc.allocatedDoctor}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-800">
                    {alloc.etaMins > 0 ? `${alloc.etaMins} mins` : 'Arrived'}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {alloc.allocatedAt}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      alloc.status === 'IN_TRANSIT' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {alloc.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {alloc.status !== 'DISCHARGED' && (
                      <button
                        onClick={() => dischargePatient(alloc.id)}
                        className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition-colors flex items-center gap-1 ml-auto"
                        title="Release reserved hospital bed & doctor"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Discharge</span>
                      </button>
                    )}
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
