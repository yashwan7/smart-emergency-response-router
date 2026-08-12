import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CapacityBar } from '../common/CapacityBar';
import { Building2, MapPin, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export const HospitalsList = () => {
  const { hospitals, setSelectedHospitalId } = useSimulation();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          HOSPITALS & CAPACITY MANAGEMENT
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Live hospital capacity, resource occupancy, and specialization routing
        </p>
      </div>

      {/* Grid of Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {hospitals.map((hospital) => {
          const icuOccupied = hospital.icuTotal - hospital.icuAvailable;
          const genOccupied = hospital.generalTotal - hospital.generalAvailable;
          const docOccupied = hospital.doctorsTotal - hospital.doctorsAvailable;
          const ambOccupied = hospital.ambulancesTotal - hospital.ambulancesAvailable;

          return (
            <div
              key={hospital.id}
              onClick={() => setSelectedHospitalId(hospital.id)}
              className="glass-card glass-card-hover p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200/60 shadow-2xs group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                        {hospital.name}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{hospital.distanceKm} km away · ETA {hospital.baseEtaMins}m</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                    hospital.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {hospital.status}
                  </span>
                </div>

                {/* Capacity Bars */}
                <div className="space-y-3 mb-5">
                  <CapacityBar label="ICU Capacity" occupied={icuOccupied} total={hospital.icuTotal} />
                  <CapacityBar label="General Beds" occupied={genOccupied} total={hospital.generalTotal} />
                  <CapacityBar label="Doctors Available" occupied={docOccupied} total={hospital.doctorsTotal} />
                  <CapacityBar label="Ambulance Dispatch" occupied={ambOccupied} total={hospital.ambulancesTotal} />
                </div>

                {/* Equipment badges */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/50">
                  {hospital.equipment.map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-[10px] font-semibold text-slate-600">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                <span>Inspect Hospital Operations</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
