import React from 'react';
import { CheckCircle2, Clock, Zap, ShieldCheck } from 'lucide-react';

export const AllocationStatusPipeline = ({ status = 'WAITING' }) => {
  const isAssigned = status === 'ASSIGNED' || status === 'IN_TRANSIT' || status === 'ADMITTED';

  const steps = [
    { label: 'RECEIVED', done: true },
    { label: 'TRIAGED', done: true },
    { label: 'QUEUED', done: true },
    { label: 'ALLOCATING', active: !isAssigned },
    { label: 'ASSIGNED', done: isAssigned },
    { label: 'RESERVED', done: isAssigned }
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono py-1">
      {steps.map((step, idx) => {
        let stepStyle = 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
        if (step.done) {
          stepStyle = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 font-bold';
        } else if (step.active) {
          stepStyle = 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800 font-bold animate-pulse';
        }

        return (
          <React.Fragment key={idx}>
            <span className={`px-2 py-0.5 rounded border whitespace-nowrap ${stepStyle}`}>
              {step.label} {step.done ? '✓' : ''}
            </span>
            {idx < steps.length - 1 && (
              <span className="text-slate-300 dark:text-slate-700">→</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
