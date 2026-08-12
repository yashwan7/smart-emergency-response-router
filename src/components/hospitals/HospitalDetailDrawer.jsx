import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CapacityBar } from '../common/CapacityBar';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Stethoscope, 
  Bed, 
  Plus, 
  Minus 
} from 'lucide-react';

export const HospitalDetailDrawer = () => {
  const { 
    hospitals, 
    setHospitals,
    selectedHospitalId, 
    setSelectedHospitalId,
    allocations 
  } = useSimulation();

  if (!selectedHospitalId) return null;

  const hospital = hospitals.find(h => h.id === selectedHospitalId);
  if (!hospital) return null;

  const hospitalAllocations = allocations.filter(a => a.hospitalId === hospital.id);

  const handleUpdateBeds = (delta) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospital.id) {
        const newAvail = Math.max(0, Math.min(h.icuTotal, h.icuAvailable + delta));
        return { ...h, icuAvailable: newAvail };
      }
      return h;
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl h-full shadow-2xl border-l border-slate-200 p-6 overflow-y-auto flex flex-col justify-between animate-slide-in-right">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">{hospital.name}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  hospital.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {hospital.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{hospital.address} · {hospital.distanceKm} km</span>
              </p>
            </div>

            <button
              onClick={() => setSelectedHospitalId(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Capacity Controls */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Real-Time Resource Breakdown
              </h3>
              
              {/* Quick Bed Adjustment Buttons */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>ICU Test:</span>
                <button
                  onClick={() => handleUpdateBeds(-1)}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Decrease ICU bed"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold">{hospital.icuAvailable}</span>
                <button
                  onClick={() => handleUpdateBeds(1)}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Increase ICU bed"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <CapacityBar label="ICU Beds" occupied={hospital.icuTotal - hospital.icuAvailable} total={hospital.icuTotal} />
              <CapacityBar label="General Beds" occupied={hospital.generalTotal - hospital.generalAvailable} total={hospital.generalTotal} />
              <CapacityBar label="Doctors" occupied={hospital.doctorsTotal - hospital.doctorsAvailable} total={hospital.doctorsTotal} />
              <CapacityBar label="Ambulances" occupied={hospital.ambulancesTotal - hospital.ambulancesAvailable} total={hospital.ambulancesTotal} />
            </div>
          </div>

          {/* Equipment Status */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Specialized Equipment & Services
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {hospital.equipment.map((eq, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{eq}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Available
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Allocations at this Hospital */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Current Patient Allocations ({hospitalAllocations.length})
            </h3>

            {hospitalAllocations.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl">
                No patients currently allocated to this hospital.
              </div>
            ) : (
              <div className="space-y-2">
                {hospitalAllocations.map(alloc => (
                  <div key={alloc.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{alloc.patientName}</div>
                      <div className="text-[11px] text-slate-500">{alloc.allocatedBed} · {alloc.allocatedDoctor}</div>
                    </div>
                    <div className="text-right font-mono text-[11px] font-semibold text-emerald-600">
                      ETA {alloc.etaMins}m
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
          Last capacity ping: 10 seconds ago
        </div>

      </div>
    </div>
  );
};
