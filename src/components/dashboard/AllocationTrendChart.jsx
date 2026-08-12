import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { EsiBadge } from '../common/EsiBadge';
import { ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';

const mockTrendData = [
  { time: '12 AM', assigned: 18, discharged: 12, waiting: 10 },
  { time: '2 AM', assigned: 20, discharged: 14, waiting: 8 },
  { time: '4 AM', assigned: 16, discharged: 15, waiting: 5 },
  { time: '6 AM', assigned: 22, discharged: 18, waiting: 6 },
  { time: '8 AM', assigned: 28, discharged: 19, waiting: 12 },
  { time: '10 AM', assigned: 32, discharged: 24, waiting: 8 },
  { time: '12 PM', assigned: 29, discharged: 22, waiting: 14 },
  { time: '2 PM', assigned: 35, discharged: 26, waiting: 11 },
  { time: '4 PM', assigned: 30, discharged: 28, waiting: 9 },
  { time: '6 PM', assigned: 38, discharged: 30, waiting: 15 },
  { time: '8 PM', assigned: 34, discharged: 32, waiting: 12 },
  { time: '10 PM', assigned: 28, discharged: 26, waiting: 8 },
];

export const AllocationTrendChart = () => {
  const { allocations, setActiveTab } = useSimulation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* Allocation Trend Chart (2 cols) */}
      <div className="lg:col-span-2 glass-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              ALLOCATION TREND (Today)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hourly breakdown of assigned vs discharged vs waiting emergency cases
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Assigned
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Discharged
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Waiting
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDischarged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWaiting" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '12px', 
                  borderColor: '#cbd5e1',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="assigned" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAssigned)" />
              <Area type="monotone" dataKey="discharged" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDischarged)" />
              <Area type="monotone" dataKey="waiting" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWaiting)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Allocations Feed (1 col) */}
      <div className="glass-card p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                RECENT ALLOCATIONS
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Live operational pipeline logs
              </p>
            </div>

            <button
              onClick={() => setActiveTab('allocations')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {allocations.slice(0, 5).map((alloc) => (
              <div
                key={alloc.id}
                className="p-2.5 rounded-xl bg-white/70 border border-slate-200/70 hover:border-slate-300 transition-all flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{alloc.patientId}</span>
                    <span className="text-[11px] font-semibold text-slate-800 truncate">{alloc.hospitalName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {alloc.allocatedBed} · {alloc.allocatedDoctor}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono text-slate-400">
                    {alloc.allocatedAt}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] font-semibold text-emerald-600 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{alloc.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/50 text-[11px] text-slate-500 text-center font-medium">
          Deterministic resource feasibility matching active
        </div>
      </div>

    </div>
  );
};
