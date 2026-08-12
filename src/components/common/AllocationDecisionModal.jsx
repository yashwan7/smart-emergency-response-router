import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { EsiBadge } from './EsiBadge';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Hospital, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Zap, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const AllocationDecisionModal = ({ isOpen, onClose, patientId }) => {
  const { emergencies, hospitals, severityWeight, agingWeight, runAllocationScheduler } = useSimulation();

  if (!isOpen || !patientId) return null;

  const patient = emergencies.find(p => p.id === patientId) || emergencies[0];
  if (!patient) return null;

  const requiredRes = patient.requiredResources || [];
  const isICUReq = requiredRes.some(r => r.toUpperCase().includes('ICU'));
  const isVentReq = requiredRes.some(r => r.toUpperCase().includes('VENT'));

  // Calculate dynamic priority values from context weights
  const baseSeverityScore = (6 - patient.esiLevel) * severityWeight;
  const agingScore = ((patient.waitTimeSeconds || 0) * agingWeight) / 10;
  const totalPriorityScore = parseFloat((baseSeverityScore + agingScore).toFixed(1));

  // Evaluate candidate hospitals dynamically against actual hospitals state
  const evaluatedHospitals = hospitals.map(h => {
    const hasICU = isICUReq ? h.icuAvailable > 0 : true;
    const hasGenBed = !isICUReq ? h.generalAvailable > 0 : true;
    const hasVent = isVentReq ? h.equipment?.some(eq => eq.toUpperCase().includes('VENT')) : true;
    const hasDoctor = h.doctorsAvailable > 0;
    const isOnline = h.status === 'ONLINE';
    const passedResourceCheck = isOnline && hasICU && hasGenBed && hasVent && hasDoctor;

    let failReason = null;
    if (!isOnline) failReason = 'Status Offline/Restricted';
    else if (isICUReq && !hasICU) failReason = '0 ICU Beds Available';
    else if (!isICUReq && !hasGenBed) failReason = '0 General Ward Beds';
    else if (isVentReq && !hasVent) failReason = 'No Ventilator Equipment';
    else if (!hasDoctor) failReason = 'All On-Duty Doctors Occupied';

    return {
      ...h,
      passedResourceCheck,
      failReason
    };
  });

  const feasibleCandidates = evaluatedHospitals.filter(h => h.passedResourceCheck);
  feasibleCandidates.sort((a, b) => a.distanceKm - b.distanceKm);

  // If assigned already, use assigned hospital, else pick nearest feasible
  const assignedHospital = hospitals.find(h => h.id === patient.assignedHospitalId);
  const selectedHospital = assignedHospital || feasibleCandidates[0] || evaluatedHospitals[0];

  const handleAllocateNow = () => {
    if (selectedHospital && patient.status === 'WAITING') {
      runAllocationScheduler(patient.id, selectedHospital.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">ALLOCATION DECISION BREAKDOWN</h3>
              <span className="glass-pill text-xs text-cyan-400 border-cyan-400/30 font-mono">
                {patient.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live algorithmic matching output & resource constraint evaluation
            </p>
          </div>
        </div>

        {/* Section 1: Patient Details & Status Pipeline */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{patient.name || patient.id}</span>
                <EsiBadge level={patient.esiLevel} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Symptoms: <strong className="text-slate-200">{patient.symptoms?.join(', ') || 'Emergency case'}</strong>
              </p>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs text-slate-400">Current Status</div>
              <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${
                patient.status === 'ASSIGNED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {patient.status}
              </span>
            </div>
          </div>

          {/* Lifecycle Pipeline Step Bar */}
          <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400 font-bold">1. RECEIVED ✓</span>
            <span className="text-emerald-400 font-bold">2. TRIAGED ✓</span>
            <span className="text-emerald-400 font-bold">3. QUEUED ✓</span>
            <span className="text-cyan-400 font-bold animate-pulse">4. ALLOCATING...</span>
            <span className={patient.status === 'ASSIGNED' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              5. {patient.status === 'ASSIGNED' ? 'ASSIGNED ✓' : 'ASSIGNMENT PENDING'}
            </span>
          </div>
        </div>

        {/* Section 2: Visible Dynamic Priority Calculations */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Activity className="w-4 h-4" /> System Scheduling Priority Formula
            </span>
            <span className="text-slate-400 text-[11px] font-mono font-normal">Starvation Prevention Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/40">
              <div className="text-[10px] text-slate-400 font-sans">Severity Score</div>
              <div className="text-sm font-bold text-white mt-0.5">
                (6 - {patient.esiLevel}) × {severityWeight} = <strong className="text-rose-400">{baseSeverityScore}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/40">
              <div className="text-[10px] text-slate-400 font-sans">Wait Aging Score</div>
              <div className="text-sm font-bold text-white mt-0.5">
                ({patient.waitTimeSeconds}s × {agingWeight}) / 10 = <strong className="text-amber-400">+{agingScore.toFixed(1)}</strong>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40">
              <div className="text-[10px] text-cyan-300 font-sans">Total Priority Score</div>
              <div className="text-base font-extrabold text-cyan-400 mt-0.5">
                {totalPriorityScore}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic pt-1">
            * Labeled as System Scheduling Priority for resource ordering, not a clinical triage score.
          </p>
        </div>

        {/* Section 3: Required Resources */}
        <div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Required Resources Filter
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredRes.map((res, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {res}
              </span>
            ))}
          </div>
        </div>

        {/* Section 4: Dynamic Candidate Hospitals Evaluation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-cyan-400" /> Candidate Hospitals Evaluated ({evaluatedHospitals.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Google Maps Distance Ranking</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {evaluatedHospitals.map((hosp) => {
              const isSelected = selectedHospital && selectedHospital.id === hosp.id;

              return (
                <div 
                  key={hosp.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                      : hosp.passedResourceCheck
                        ? 'bg-slate-800/40 border-slate-700/60'
                        : 'bg-rose-950/20 border-rose-900/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm">{hosp.name}</strong>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-extrabold text-[10px] uppercase">
                            🏆 Selected Match
                          </span>
                        )}
                        {hosp.passedResourceCheck && !isSelected && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            FEASIBLE
                          </span>
                        )}
                        {!hosp.passedResourceCheck && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                            INFEASIBLE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span>📍 {hosp.distanceKm} km away</span>
                        <span>⏱️ ~{hosp.baseEtaMins} min ETA</span>
                        <span>ICU: <strong className="text-slate-200">{hosp.icuAvailable}/{hosp.icuTotal}</strong></span>
                        <span>Doctors: <strong className="text-slate-200">{hosp.doctorsAvailable}/{hosp.doctorsTotal}</strong></span>
                      </div>
                    </div>

                    <div className="text-right">
                      {hosp.passedResourceCheck ? (
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 sm:justify-end">
                          <CheckCircle2 className="w-4 h-4" /> Capacity Verified
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-rose-400 flex items-center gap-1 sm:justify-end">
                          <XCircle className="w-4 h-4" /> {hosp.failReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Core Pitch Banner */}
        <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-bold block mb-0.5">THE CORE ALGORITHMIC DECISION:</strong>
            "Nearest hospital is not always the best hospital. If a nearby hospital lacks required ICU beds or specialists, the allocation engine automatically bypasses it and assigns the patient to the optimal feasible hospital with guaranteed capacity."
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close Breakdown
          </button>

          {patient.status === 'WAITING' && (
            <button
              onClick={handleAllocateNow}
              className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-2"
            >
              <span>Execute Allocation to {selectedHospital?.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
