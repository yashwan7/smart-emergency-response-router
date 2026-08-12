import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { EsiBadge } from '../common/EsiBadge';
import { Users, Clock, MapPin, ChevronRight } from 'lucide-react';

export const PatientsView = () => {
  const { emergencies, setSelectedPatientId } = useSimulation();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          PATIENT DIRECTORY & RECENT RECORDS
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Master records of all emergency patients, ESI levels, and clinical vitals history
        </p>
      </div>

      {/* Grid of Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {emergencies.map(patient => (
          <div
            key={patient.id}
            onClick={() => setSelectedPatientId(patient.id)}
            className="glass-card glass-card-hover p-5 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3">
                <div>
                  <div className="font-mono font-extrabold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                    {patient.id}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{patient.name}</h3>
                </div>

                <EsiBadge level={patient.esiLevel} size="sm" />
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <span>Age / Gender:</span>
                  <strong className="text-slate-900">{patient.age} yrs · {patient.gender}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span>Vitals HR / SpO2:</span>
                  <strong className="text-slate-900 font-mono">{patient.vitals.heartRate} bpm · {patient.vitals.spo2}%</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span>Location:</span>
                  <span className="text-slate-500 text-[11px] truncate max-w-[160px]">{patient.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-200/50">
                {patient.symptoms.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
              <span>View Full Clinical Case</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
