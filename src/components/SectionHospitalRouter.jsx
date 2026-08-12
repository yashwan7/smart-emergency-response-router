import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { GoogleHospitalMap } from './hospitals/GoogleHospitalMap';
import { 
  Hospital, 

  MapPin, 
  Navigation, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Cpu, 
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export const SectionHospitalRouter = () => {
  const { hospitals, setHospitals, triggerTwilioToast } = useSimulation();

  // Test Case Scenario state for Feasibility Sandbox
  const [selectedScenario, setSelectedScenario] = useState('ICU_VENT_CARDIO');

  const scenarios = [
    {
      id: 'ICU_VENT_CARDIO',
      title: 'Critical Cardiac Case (ICU + Ventilator + Cardiology)',
      required: ['ICU', 'Ventilator', 'Cardiology'],
      desc: 'Patient 101 requires immediate ICU bed, Ventilator, and Cardiologist on call.'
    },
    {
      id: 'TRAUMA_NEURO',
      title: 'Head Trauma Case (ICU + Neurology)',
      required: ['ICU', 'Neurology'],
      desc: 'Patient 102 requires ICU bed and Neurologist.'
    },
    {
      id: 'GEN_BED_ONLY',
      title: 'Fracture Case (General Bed + Orthopedics)',
      required: ['General Bed', 'Orthopedics'],
      desc: 'Patient 103 requires a General Ward bed.'
    }
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  // Run feasibility filter logic on current scenario
  const evaluatedHospitals = hospitals.map(h => {
    const isICUReq = currentScenario.required.includes('ICU');
    const isCardioReq = currentScenario.required.includes('Cardiology');
    const isNeuroReq = currentScenario.required.includes('Neurology');

    let passedResourceCheck = true;
    let failReason = null;

    if (isICUReq && h.icuAvailable <= 0) {
      passedResourceCheck = false;
      failReason = '0 ICU Beds Available';
    } else if (!isICUReq && h.generalAvailable <= 0) {
      passedResourceCheck = false;
      failReason = '0 General Beds Available';
    } else if (isCardioReq && !h.specializations.includes('Cardiology')) {
      passedResourceCheck = false;
      failReason = 'No Cardiologist on Duty';
    } else if (isNeuroReq && !h.specializations.includes('Neurology')) {
      passedResourceCheck = false;
      failReason = 'No Neurologist on Duty';
    } else if (h.doctorsAvailable <= 0) {
      passedResourceCheck = false;
      failReason = 'All Doctors Occupied';
    }

    return {
      ...h,
      passedResourceCheck,
      failReason
    };
  });

  const feasibleCandidates = evaluatedHospitals.filter(h => h.passedResourceCheck);
  feasibleCandidates.sort((a, b) => a.distanceKm - b.distanceKm);
  const winningHospital = feasibleCandidates[0];

  // Helper to adjust hospital capacity for demo testing
  const updateHospitalCapacity = (hospId, field, delta) => {
    setHospitals(prev =>
      prev.map(h => {
        if (h.id === hospId) {
          const newVal = Math.max(0, h[field] + delta);
          return { ...h, [field]: newVal };
        }
        return h;
      })
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="glass-pill text-[var(--color-primary)] border-[var(--color-primary)]/30">
            STEP 8 & STEP 9 Engine
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">Google Maps Matrix API Simulation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Hospital Capacity & Intelligent Feasibility Router
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Demonstrates why the nearest hospital (3 km away) is bypassed if it lacks required ICU/doctors, and how the router selects the best feasible hospital.
        </p>
      </div>

      {/* Feasibility Pipeline Visualizer Sandbox */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-t-2 border-t-[var(--color-primary)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="text-lg font-bold text-white">Interactive Feasibility Matching Sandbox</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Select an emergency requirement case to see the step-by-step resource filtering pipeline before Maps ETA scoring.
            </p>
          </div>

          {/* Scenario Buttons */}
          <div className="flex flex-wrap gap-2">
            {scenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedScenario === sc.id
                    ? 'bg-[var(--color-primary)] text-black font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                }`}
              >
                {sc.title.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-black/40 border border-[var(--border-glass)]">
          
          {/* Candidate Hospitals Evaluation */}
          {evaluatedHospitals.map(hosp => {
            const isWinner = winningHospital && winningHospital.id === hosp.id;

            return (
              <div 
                key={hosp.id}
                className={`p-4 rounded-xl transition-all border ${
                  isWinner 
                    ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] shadow-[0_0_20px_rgba(0,242,254,0.2)]' 
                    : hosp.passedResourceCheck 
                      ? 'bg-white/[0.03] border-white/10' 
                      : 'bg-red-950/20 border-red-500/30 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{hosp.name}</span>
                  {isWinner ? (
                    <span className="glass-pill text-black bg-[var(--color-primary)] font-bold text-[10px]">
                      🏆 Selected Winner
                    </span>
                  ) : hosp.passedResourceCheck ? (
                    <span className="text-[10px] text-[var(--color-success)] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Feasible
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#ff6b81] font-bold flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Infeasible
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs space-y-1 text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span>Distance & Maps ETA:</span>
                    <strong className="text-white font-mono">{hosp.distanceKm} km ({hosp.baseEtaMins} min)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>ICU Availability:</span>
                    <strong className={hosp.icuAvailable > 0 ? 'text-[var(--color-success)]' : 'text-[#ff6b81]'}>
                      {hosp.icuAvailable} / {hosp.icuTotal} Free
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Doctors Available:</span>
                    <strong className="text-white">{hosp.doctorsAvailable} On Duty</strong>
                  </div>
                </div>

                {!hosp.passedResourceCheck && (
                  <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20 text-[11px] text-[#ff6b81] font-semibold">
                    🚫 Bypassed: {hosp.failReason}
                  </div>
                )}

                {isWinner && (
                  <div className="mt-3 p-2 rounded bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[11px] text-[var(--color-primary)] font-bold text-center">
                    ✨ Optimal Match: Feasible + Lowest Maps ETA ({hosp.baseEtaMins} mins)
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* Interactive Google Map Section */}
      <GoogleHospitalMap 
        hospitals={hospitals} 
        winningHospitalId={winningHospital?.id} 
        height="480px" 
      />

      {/* Hospital Capacity Cards Grid */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hospital className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-white">Live Regional Hospital Network & Capacity</h3>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            Interactive Capacity Tuning Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hosp) => {
            const icuPercent = Math.round((hosp.icuAvailable / hosp.icuTotal) * 100);
            const genPercent = Math.round((hosp.generalAvailable / hosp.generalTotal) * 100);

            return (
              <div 
                key={hosp.id}
                className="glass-panel glass-panel-hover p-6 space-y-4 relative flex flex-col justify-between"
              >
                {/* Hospital Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[var(--color-primary)]">
                        <Hospital className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{hosp.name}</h4>
                        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[var(--color-primary)]" /> {hosp.distanceKm} km • {hosp.baseEtaMins} min ETA
                        </p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      hosp.status === 'ONLINE' ? 'bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/30' : 'bg-red-500/20 text-[#ff6b81] border border-red-500/30'
                    }`}>
                      {hosp.status}
                    </span>
                  </div>

                  {/* Bed Occupancy Progress Bars */}
                  <div className="space-y-3 mt-4 py-3 border-y border-[var(--border-glass)]">
                    
                    {/* ICU Bed Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)] font-medium">ICU Beds Free</span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <button 
                            onClick={() => updateHospitalCapacity(hosp.id, 'icuAvailable', -1)} 
                            className="px-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                          >-</button>
                          <strong className="text-white">{hosp.icuAvailable} / {hosp.icuTotal}</strong>
                          <button 
                            onClick={() => updateHospitalCapacity(hosp.id, 'icuAvailable', 1)} 
                            className="px-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                          >+</button>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-[var(--color-primary)] transition-all duration-300"
                          style={{ width: `${icuPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* General Bed Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--text-secondary)] font-medium">General Ward Free</span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <button 
                            onClick={() => updateHospitalCapacity(hosp.id, 'generalAvailable', -1)} 
                            className="px-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                          >-</button>
                          <strong className="text-white">{hosp.generalAvailable} / {hosp.generalTotal}</strong>
                          <button 
                            onClick={() => updateHospitalCapacity(hosp.id, 'generalAvailable', 1)} 
                            className="px-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                          >+</button>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-[var(--color-success)] transition-all duration-300"
                          style={{ width: `${genPercent}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Specializations & Equipment */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <Stethoscope className="w-3.5 h-3.5 text-[var(--color-purple)]" />
                      <span>Doctors: <strong className="text-white">{hosp.doctorsAvailable}/{hosp.doctorsTotal}</strong> on duty</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {hosp.specializations.map((spec, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[var(--border-glass)] text-xs flex items-center justify-between text-[var(--text-muted)] font-mono">
                  <span>ID: {hosp.id}</span>
                  <span>Ambulances: {hosp.ambulancesAvailable}/{hosp.ambulancesTotal} free</span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
