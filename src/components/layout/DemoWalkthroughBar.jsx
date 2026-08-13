import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Play, ChevronRight, RotateCcw, CheckCircle2, Sparkles, X } from 'lucide-react';

const DEMO_STEPS = [
  { id: 1, title: 'Open Dashboard', desc: 'Inspect operations overview & live KPI metrics', tab: 'dashboard' },
  { id: 2, title: 'Live KPIs', desc: 'Observe count-up numbers and trend sparklines', tab: 'dashboard' },
  { id: 3, title: 'Navigate Emergencies', desc: 'View full dedicated emergency management table', tab: 'emergencies' },
  { id: 4, title: 'Create Emergency', desc: 'Open multi-step New Emergency wizard', tab: 'emergencies', action: 'openModal' },
  { id: 5, title: 'Queue & Priority', desc: 'Observe auto-calculated ESI level & aging score', tab: 'emergencies' },
  { id: 6, title: 'Patient Detail', desc: 'Open right-side drawer for patient P101', tab: 'dashboard', action: 'openP101' },
  { id: 7, title: 'Hospital Matching', desc: 'Inspect resource feasibility & candidate ranking', tab: 'dashboard', action: 'openP101' },
  { id: 8, title: 'Open Route Map', desc: 'Inspect interactive feasibility router map', tab: 'map' },
  { id: 9, title: 'Feasible Hospital', desc: 'Verify why nearest hospital is not always best', tab: 'map' },
  { id: 10, title: 'Assign Patient', desc: 'Run resource allocation engine for P101', tab: 'map', action: 'allocateP101' },
  { id: 11, title: 'Allocation Pipeline', desc: 'View 7-stage live allocation timeline', tab: 'allocations' },
  { id: 12, title: 'Capacity Updated', desc: 'Inspect updated hospital ICU bed counts', tab: 'hospitals' },
  { id: 13, title: 'Live Alert Broadcast', desc: 'Verify critical notification dispatch', tab: 'alerts' },
  { id: 14, title: 'Open Analytics', desc: 'View emergency volume & response time trends', tab: 'analytics' },
  { id: 15, title: 'Simulate Surge', desc: 'Trigger outbreak surge simulation anomaly', tab: 'analytics', action: 'triggerSurge' },
  { id: 16, title: 'Surge Alert', desc: 'Verify real-time surge detection notification', tab: 'alerts' }
];

export const DemoWalkthroughBar = () => {
  const { 
    setActiveTab, 
    setIsNewEmergencyModalOpen, 
    setSelectedPatientId,
    runAllocationScheduler,
    triggerSurgeSimulation
  } = useSimulation();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const step = DEMO_STEPS[currentStepIndex];

  const handleStepClick = (index) => {
    setCurrentStepIndex(index);
    const target = DEMO_STEPS[index];
    
    if (target.tab) {
      setActiveTab(target.tab);
    }

    if (target.action === 'openModal') {
      setIsNewEmergencyModalOpen(true);
    } else if (target.action === 'openP101') {
      setSelectedPatientId('P101');
    } else if (target.action === 'allocateP101') {
      runAllocationScheduler('P101');
    } else if (target.action === 'triggerSurge') {
      triggerSurgeSimulation();
    }
  };

  const handleNext = () => {
    const nextIndex = (currentStepIndex + 1) % DEMO_STEPS.length;
    handleStepClick(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = currentStepIndex > 0 ? currentStepIndex - 1 : DEMO_STEPS.length - 1;
    handleStepClick(prevIndex);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 px-3.5 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-slate-700 hover:bg-slate-800 transition-all"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Demo Walkthrough ({currentStepIndex + 1}/{DEMO_STEPS.length})</span>
      </button>
    );
  }

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-3 sm:px-4 py-1.5 sm:py-2 text-xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shadow-md z-30">
      <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar max-w-full sm:max-w-none">
        <div className="flex items-center gap-1 font-bold text-rose-400 shrink-0 uppercase tracking-wider text-[11px] sm:text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xs:inline">Demo Flow:</span>
        </div>

        {/* Step pill */}
        <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700 shrink-0 text-xs">
          <span className="font-mono font-bold text-amber-400 text-[11px]">S{step.id}/{DEMO_STEPS.length}</span>
          <span className="font-bold text-white truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">{step.title}</span>
          <span className="text-slate-400 font-normal hidden md:inline">• {step.desc}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
        <button
          onClick={handlePrev}
          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[10px] sm:text-[11px] transition-colors"
        >
          Prev
        </button>

        <button
          onClick={handleNext}
          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] sm:text-xs transition-colors flex items-center gap-0.5 shadow-sm"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleStepClick(0)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
          title="Restart Demo Flow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
          title="Minimize Demo Bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
