import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { EsiBadge } from '../common/EsiBadge';
import { 
  X, 
  Clock, 
  Heart, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Building2, 
  Stethoscope, 
  ShieldCheck,
  Navigation,
  ArrowRight
} from 'lucide-react';

export const PatientDetailDrawer = () => {
  const { 
    emergencies, 
    hospitals, 
    selectedPatientId, 
    setSelectedPatientId,
    runAllocationScheduler 
  } = useSimulation();

  if (!selectedPatientId) return null;

  const patient = emergencies.find(e => e.id === selectedPatientId);
  if (!patient) return null;

  const isICURequired = (patient.requiredResources || []).some(r => r.toUpperCase().includes('ICU'));
  const isVentRequired = (patient.requiredResources || []).some(r => r.toUpperCase().includes('VENT'));

  // Calculate candidate hospitals ranking
  const candidateHospitals = hospitals.map(h => {
    const hasICU = isICURequired ? h.icuAvailable > 0 : true;
    const hasGenBed = !isICURequired ? h.generalAvailable > 0 : true;
    const hasDoctor = h.doctorsAvailable > 0;
    const isOnline = h.status === 'ONLINE';
    const isFeasible = isOnline && hasICU && hasGenBed && hasDoctor;

    return {
      ...h,
      hasICU,
      hasGenBed,
      hasDoctor,
      isFeasible
    };
  }).sort((a, b) => {
    if (a.isFeasible && !b.isFeasible) return -1;
    if (!a.isFeasible && b.isFeasible) return 1;
    return a.distanceKm - b.distanceKm;
  });

  const bestMatch = candidateHospitals.find(h => h.isFeasible);

  const handleAssign = (hospitalId) => {
    runAllocationScheduler(patient.id, hospitalId);
    setSelectedPatientId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl h-full shadow-2xl border-l border-slate-200 p-6 overflow-y-auto flex flex-col justify-between animate-slide-in-right">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-extrabold text-slate-900">{patient.id}</span>
                <EsiBadge level={patient.esiLevel} showName size="sm" />
              </div>
              <h2 className="text-sm font-bold text-slate-700 mt-0.5">{patient.name}</h2>
              <p className="text-xs text-slate-500">{patient.age} yrs · {patient.gender} · {patient.location}</p>
            </div>

            <button
              onClick={() => setSelectedPatientId(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Patient Vitals & Priority */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/60 text-center">
              <div className="text-[10px] font-bold uppercase text-rose-700">Heart Rate</div>
              <div className="text-lg font-black font-mono text-rose-900 my-0.5">{patient.vitals.heartRate} <span className="text-xs font-normal">bpm</span></div>
              <div className="text-[10px] text-rose-600 font-medium">ECG Monitor</div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/60 text-center">
              <div className="text-[10px] font-bold uppercase text-blue-700">SpO2 Level</div>
              <div className="text-lg font-black font-mono text-blue-900 my-0.5">{patient.vitals.spo2}%</div>
              <div className="text-[10px] text-blue-600 font-medium">Pulse Oximeter</div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-center">
              <div className="text-[10px] font-bold uppercase text-amber-700">Priority Score</div>
              <div className="text-lg font-black font-mono text-amber-900 my-0.5">{patient.priorityScore}</div>
              <div className="text-[10px] text-amber-600 font-medium">ESI + Aging</div>
            </div>
          </div>

          {/* Symptoms & Required Resources */}
          <div className="space-y-3 mb-6">
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Symptoms</div>
              <div className="flex flex-wrap gap-1.5">
                {patient.symptoms.map((sym, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                    {sym}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Required Resources</div>
              <div className="flex flex-wrap gap-1.5">
                {patient.requiredResources.map((res, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {res}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hospital Matching Section */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Candidate Hospital Matching</span>
              <span className="text-xs font-normal text-slate-500">Ranked by Feasibility</span>
            </h3>

            <div className="space-y-3">
              {candidateHospitals.map((hospital) => {
                const isBest = bestMatch && bestMatch.id === hospital.id;

                return (
                  <div
                    key={hospital.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isBest 
                        ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20 shadow-md' 
                        : hospital.isFeasible 
                        ? 'bg-white border-slate-200 hover:border-slate-300' 
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{hospital.name}</h4>
                          {isBest && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                              Best Match
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {hospital.distanceKm} km · ETA {hospital.baseEtaMins} min
                        </div>
                      </div>

                      <button
                        disabled={!hospital.isFeasible || patient.status !== 'WAITING'}
                        onClick={() => handleAssign(hospital.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                          hospital.isFeasible && patient.status === 'WAITING'
                            ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Assign</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* WHY THIS HOSPITAL? Feasibility Matrix */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5">
                        {hospital.isFeasible ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                        <span className="text-slate-700 font-medium">Resource Feasibility</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {hospital.hasICU ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                        <span className="text-slate-700 font-medium">ICU ({hospital.icuAvailable} avail)</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {hospital.hasDoctor ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                        <span className="text-slate-700 font-medium">Doctor ({hospital.doctorsAvailable} avail)</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-700 font-medium">Travel ETA ({hospital.baseEtaMins}m)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-medium">
            Status: <span className="font-bold text-slate-900">{patient.status}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
