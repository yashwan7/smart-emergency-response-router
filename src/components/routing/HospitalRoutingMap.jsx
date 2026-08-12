import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { GoogleHospitalMap } from '../hospitals/GoogleHospitalMap';
import { EsiBadge } from '../common/EsiBadge';

import { 
  Navigation, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Info,
  Layers
} from 'lucide-react';

export const HospitalRoutingMap = () => {
  const { emergencies, hospitals, runAllocationScheduler } = useSimulation();

  const waitingPatients = emergencies.filter(e => e.status === 'WAITING');
  const [selectedPatientId, setSelectedPatientId] = useState(waitingPatients[0]?.id || emergencies[0]?.id || 'P101');
  const [selectedHospitalId, setSelectedHospitalId] = useState('H01');

  const selectedPatient = emergencies.find(e => e.id === selectedPatientId) || emergencies[0];
  
  const isICURequired = (selectedPatient?.requiredResources || []).some(r => r.toUpperCase().includes('ICU'));

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

  const bestFeasibleHospital = candidateHospitals.find(h => h.isFeasible) || candidateHospitals[0];
  const activeTargetHospital = candidateHospitals.find(h => h.id === selectedHospitalId) || bestFeasibleHospital;

  const handleAssign = () => {
    if (selectedPatient && activeTargetHospital) {
      runAllocationScheduler(selectedPatient.id, activeTargetHospital.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            ROUTE & FEASIBILITY ENGINE
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Resource-constrained spatial allocation & live dispatch routing map
          </p>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Select Patient Case:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900 shadow-2xs"
          >
            {emergencies.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} · ESI-{p.esiLevel} ({p.name}) - {p.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map + Side Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Visual Map Area (2 cols) */}
        <div className="lg:col-span-2 glass-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          {/* Map Controls Header Overlay */}
          <div className="flex items-center justify-between z-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm mb-4">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-rose-600 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Routing Target: {activeTargetHospital.name}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Patient {selectedPatient?.id} → {activeTargetHospital.distanceKm} km · ETA {activeTargetHospital.baseEtaMins} min
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-rose-700 font-semibold px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                <span className="pulse-dot-red" /> Patient
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                <span className="pulse-dot-green" /> Feasible Hospital
              </span>
            </div>
          </div>

          {/* Real Interactive Google Map */}
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <GoogleHospitalMap 
              hospitals={hospitals} 
              winningHospitalId={activeTargetHospital?.id} 
              onSelectHospital={(h) => setSelectedHospitalId(h.id)}
              height="100%" 
              showTitle={false} 
            />
          </div>


          {/* Map Footer Legend */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Route calculation incorporates traffic congestion + resource constraints</span>
            <span className="font-mono text-slate-400">Map Bounds: Regional Control Zone</span>
          </div>

        </div>

        {/* Side Panel: "Nearest Feasible Hospital" (1 col) */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            
            {/* Header */}
            <div className="border-b border-slate-200/60 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  MATCHING ENGINE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Patient {selectedPatient?.id}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mt-2">
                Nearest Feasible Hospital
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prioritizes medical feasibility before travel distance
              </p>
            </div>

            {/* Warning Callout Box explaining "Nearest vs Feasible" */}
            <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs mb-5 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">FEASIBILITY RULE:</strong> Nearest hospital (e.g. Metro Hospital) has 0 ICU beds available. The algorithm automatically selects <strong>{bestFeasibleHospital.name}</strong> to prevent bypass delay.
              </div>
            </div>

            {/* Selected Hospital Info */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">{activeTargetHospital.name}</h4>
                <span className="text-xs font-bold text-emerald-700">{activeTargetHospital.distanceKm} km away</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-sans text-slate-500 uppercase">Estimated ETA</div>
                  <div className="text-base font-bold text-slate-900">{activeTargetHospital.baseEtaMins} min</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] font-sans text-slate-500 uppercase">ICU Beds</div>
                  <div className="text-base font-bold text-emerald-700">{activeTargetHospital.icuAvailable} free</div>
                </div>
              </div>

              {/* Feasibility Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Resource Feasibility</span>
                  {activeTargetHospital.isFeasible ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
                  ) : (
                    <span className="text-red-600 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Constrained</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span>ICU Availability</span>
                  <span className="font-bold text-slate-900">{activeTargetHospital.icuAvailable} / {activeTargetHospital.icuTotal}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span>Doctor Availability</span>
                  <span className="font-bold text-slate-900">{activeTargetHospital.doctorsAvailable} Available</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <button
            disabled={!activeTargetHospital.isFeasible || selectedPatient?.status !== 'WAITING'}
            onClick={handleAssign}
            className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
              activeTargetHospital.isFeasible && selectedPatient?.status === 'WAITING'
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Assign Patient {selectedPatient?.id}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
