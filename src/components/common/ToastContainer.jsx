import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Bell, CheckCircle2, AlertTriangle, Sparkles, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useSimulation();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-start gap-3 animate-fade-in"
        >
          <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {toast.title}
            </div>
            <div className="text-xs text-slate-200 mt-0.5 leading-snug">
              {toast.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
