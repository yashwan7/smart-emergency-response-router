import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CapacityBar } from '../common/CapacityBar';
import { ChevronRight, Building2, ExternalLink } from 'lucide-react';

export const HospitalCapacityPreview = () => {
  const { hospitals, setActiveTab, setSelectedHospitalId } = useSimulation();

  return (
    <div className="glass-card p-5 relative overflow-hidden flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>HOSPITAL CAPACITY OVERVIEW</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              {hospitals.filter(h => h.status === 'ONLINE').length}/{hospitals.length} Online
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time occupancy and resource availability matrix
          </p>
        </div>

        <button
          onClick={() => setActiveTab('hospitals')}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hospital Rows */}
      <div className="space-y-3">
        {hospitals.map((hospital) => {
          const icuOccupied = hospital.icuTotal - hospital.icuAvailable;
          const genOccupied = hospital.generalTotal - hospital.generalAvailable;
          const docOccupied = hospital.doctorsTotal - hospital.doctorsAvailable;
          const ambOccupied = hospital.ambulancesTotal - hospital.ambulancesAvailable;

          return (
            <div
              key={hospital.id}
              onClick={() => setSelectedHospitalId(hospital.id)}
              className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
            >
              {/* Left: Hospital Name & Status */}
              <div className="md:w-1/4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                      {hospital.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span>{hospital.distanceKm} km away</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        hospital.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hospital.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: Resource Capacity Bars */}
              <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <CapacityBar label="ICU" occupied={icuOccupied} total={hospital.icuTotal} compact />
                <CapacityBar label="Beds" occupied={genOccupied} total={hospital.generalTotal} compact />
                <CapacityBar label="Doctors" occupied={docOccupied} total={hospital.doctorsTotal} compact />
                <CapacityBar label="Ambulance" occupied={ambOccupied} total={hospital.ambulancesTotal} compact />
              </div>

              {/* Right: Action Icon */}
              <div className="hidden md:block text-right">
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
