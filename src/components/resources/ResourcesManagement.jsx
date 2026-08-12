import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CapacityBar } from '../common/CapacityBar';
import { Cpu, Stethoscope, Bed, Ambulance, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ResourcesManagement = () => {
  const { hospitals } = useSimulation();
  const [activeTab, setActiveTab] = useState('beds');

  // Aggregate global resource stats across hospitals
  const totalIcu = hospitals.reduce((acc, h) => acc + h.icuTotal, 0);
  const availIcu = hospitals.reduce((acc, h) => acc + h.icuAvailable, 0);
  const occupiedIcu = totalIcu - availIcu;

  const totalGen = hospitals.reduce((acc, h) => acc + h.generalTotal, 0);
  const availGen = hospitals.reduce((acc, h) => acc + h.generalAvailable, 0);
  const occupiedGen = totalGen - availGen;

  const totalDoc = hospitals.reduce((acc, h) => acc + h.doctorsTotal, 0);
  const availDoc = hospitals.reduce((acc, h) => acc + h.doctorsAvailable, 0);
  const occupiedDoc = totalDoc - availDoc;

  const totalAmb = hospitals.reduce((acc, h) => acc + h.ambulancesTotal, 0);
  const availAmb = hospitals.reduce((acc, h) => acc + h.ambulancesAvailable, 0);
  const occupiedAmb = totalAmb - availAmb;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          RESOURCE & INVENTORY MANAGEMENT
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Live tracking of hospital beds, specialists, specialized equipment, and ambulance fleets
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">ICU Beds</div>
            <div className="text-2xl font-black font-mono text-slate-900 my-0.5">{availIcu} <span className="text-sm text-slate-400 font-normal">/ {totalIcu} free</span></div>
            <div className="text-[11px] font-semibold text-emerald-700">{occupiedIcu} Occupied</div>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">General Beds</div>
            <div className="text-2xl font-black font-mono text-slate-900 my-0.5">{availGen} <span className="text-sm text-slate-400 font-normal">/ {totalGen} free</span></div>
            <div className="text-[11px] font-semibold text-emerald-700">{occupiedGen} Occupied</div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">On-Duty Doctors</div>
            <div className="text-2xl font-black font-mono text-slate-900 my-0.5">{availDoc} <span className="text-sm text-slate-400 font-normal">/ {totalDoc} free</span></div>
            <div className="text-[11px] font-semibold text-emerald-700">{occupiedDoc} Assigned</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Ambulances</div>
            <div className="text-2xl font-black font-mono text-slate-900 my-0.5">{availAmb} <span className="text-sm text-slate-400 font-normal">/ {totalAmb} free</span></div>
            <div className="text-[11px] font-semibold text-emerald-700">{occupiedAmb} Dispatched</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <Ambulance className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-5">
          {[
            { id: 'beds', label: 'Beds (ICU & General)' },
            { id: 'doctors', label: 'Doctors & Specialists' },
            { id: 'equipment', label: 'Equipment & Ventilators' },
            { id: 'ambulances', label: 'Ambulance Fleet' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Detailed Breakdown per hospital */}
        <div className="space-y-4">
          {hospitals.map(h => (
            <div key={h.id} className="p-4 rounded-2xl bg-white/80 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-1/3">
                <div className="font-bold text-sm text-slate-900">{h.name}</div>
                <div className="text-xs text-slate-500">{h.distanceKm} km away · Status: <span className="font-bold text-emerald-700">{h.status}</span></div>
              </div>

              <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {activeTab === 'beds' && (
                  <>
                    <CapacityBar label="ICU Beds" occupied={h.icuTotal - h.icuAvailable} total={h.icuTotal} compact />
                    <CapacityBar label="General Beds" occupied={h.generalTotal - h.generalAvailable} total={h.generalTotal} compact />
                  </>
                )}

                {activeTab === 'doctors' && (
                  <>
                    <CapacityBar label="On-Duty Doctors" occupied={h.doctorsTotal - h.doctorsAvailable} total={h.doctorsTotal} compact />
                    <div className="text-xs text-slate-600">
                      Specialists: <strong className="text-slate-800">{h.specializations.join(', ')}</strong>
                    </div>
                  </>
                )}

                {activeTab === 'equipment' && (
                  <div className="col-span-2 flex flex-wrap gap-1.5">
                    {h.equipment.map((eq, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        ✓ {eq}
                      </span>
                    ))}
                  </div>
                )}

                {activeTab === 'ambulances' && (
                  <CapacityBar label="Ambulance Fleet" occupied={h.ambulancesTotal - h.ambulancesAvailable} total={h.ambulancesTotal} compact />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
