import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Smartphone, Bell, X } from 'lucide-react';

export const TwilioNotificationToast = () => {
  const { twilioToasts } = useSimulation();

  if (twilioToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {twilioToasts.map((toast) => (
        <div 
          key={toast.id}
          className="pointer-events-auto p-4 rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-[var(--color-primary)]/40 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(0,242,254,0.2)] text-white space-y-1 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[var(--color-primary)] font-mono">{toast.title}</span>
            </div>
            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Twilio SMS</span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] pl-8">
            {toast.message}
          </p>
        </div>
      ))}
    </div>
  );
};
