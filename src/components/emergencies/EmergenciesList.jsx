import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { EsiBadge } from '../common/EsiBadge';
import { Search, Plus, Filter, Clock, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

export const EmergenciesList = () => {
  const { 
    emergencies, 
    setIsNewEmergencyModalOpen, 
    setSelectedPatientId,
    runAllocationScheduler 
  } = useSimulation();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredList = [...emergencies];

  if (activeFilter === 'CRITICAL') {
    filteredList = filteredList.filter(e => e.esiLevel === 1 || e.esiLevel === 2);
  } else if (activeFilter === 'WAITING') {
    filteredList = filteredList.filter(e => e.status === 'WAITING');
  } else if (activeFilter === 'ASSIGNED') {
    filteredList = filteredList.filter(e => e.status === 'ASSIGNED');
  } else if (activeFilter === 'DISCHARGED') {
    filteredList = filteredList.filter(e => e.status === 'DISCHARGED');
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredList = filteredList.filter(e => 
      e.id.toLowerCase().includes(q) || 
      e.name.toLowerCase().includes(q) ||
      e.symptoms.some(s => s.toLowerCase().includes(q))
    );
  }

  const formatWait = (sec) => {
    const mins = Math.floor(sec / 60);
    return mins > 0 ? `${mins} min` : `${sec}s`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            EMERGENCIES MANAGEMENT
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor, triage, and route incoming emergency cases in real-time
          </p>
        </div>

        <button
          onClick={() => setIsNewEmergencyModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Emergency</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Cases' },
            { id: 'CRITICAL', label: 'Critical (ESI 1-2)' },
            { id: 'WAITING', label: 'Waiting' },
            { id: 'ASSIGNED', label: 'Assigned' },
            { id: 'DISCHARGED', label: 'Discharged' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient or emergency ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/90 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

      </div>

      {/* Main Emergencies Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Priority Score</th>
                <th className="py-3.5 px-4">Waiting Time</th>
                <th className="py-3.5 px-4">Required Resources</th>
                <th className="py-3.5 px-4">Assigned Hospital</th>
                <th className="py-3.5 px-4">ETA</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 bg-white/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">
                    No emergency cases match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((patient) => (
                  <tr 
                    key={patient.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPatientId(patient.id)}
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors font-mono">
                        {patient.id}
                      </div>
                      <div className="text-slate-600 font-semibold">{patient.name}</div>
                      <div className="text-[10px] text-slate-400">{patient.age} yrs · {patient.gender}</div>
                    </td>

                    <td className="py-4 px-4">
                      <EsiBadge level={patient.esiLevel} size="sm" />
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono font-extrabold text-sm text-slate-900">
                        {patient.priorityScore}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatWait(patient.waitTimeSeconds)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {patient.requiredResources.map((res, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700">
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {patient.assignedHospitalName || 'Unassigned'}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-600">
                      {patient.etaMins ? `${patient.etaMins} mins` : '—'}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        patient.status === 'WAITING' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : patient.status === 'ASSIGNED' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {patient.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedPatientId(patient.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          Details
                        </button>
                        {patient.status === 'WAITING' && (
                          <button
                            onClick={() => runAllocationScheduler(patient.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition-colors"
                          >
                            Allocate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
