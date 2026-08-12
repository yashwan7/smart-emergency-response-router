import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Clock, Building2, Calendar } from 'lucide-react';

const arrivalsData = [
  { time: '00:00', arrivals: 4, responseTime: 12 },
  { time: '04:00', arrivals: 2, responseTime: 10 },
  { time: '08:00', arrivals: 12, responseTime: 16 },
  { time: '12:00', arrivals: 18, responseTime: 14 },
  { time: '16:00', arrivals: 24, responseTime: 18 },
  { time: '20:00', arrivals: 15, responseTime: 13 },
];

const hospitalUtilizationData = [
  { name: 'City Care', icu: 80, general: 40 },
  { name: 'Green Life', icu: 40, general: 60 },
  { name: 'Metro Hosp', icu: 100, general: 32 },
  { name: 'Sunrise Med', icu: 80, general: 50 },
  { name: 'Wellness Hosp', icu: 50, general: 50 },
];

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6'];

export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('Today');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            OPERATIONAL PERFORMANCE ANALYTICS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Emergency volume trends, response time statistics, and hospital utilization metrics
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="glass-card p-1.5 flex items-center gap-1 shrink-0">
          {['Today', '7 Days', '30 Days'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeRange === range
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="text-xs font-bold text-slate-500 uppercase">Avg Response Time</div>
          <div className="text-2xl font-black font-mono text-slate-900 my-0.5">14.2 <span className="text-sm font-normal text-slate-500">mins</span></div>
          <div className="text-[11px] font-semibold text-emerald-700">↓ 2.1 mins vs baseline</div>
        </div>

        <div className="glass-card p-4">
          <div className="text-xs font-bold text-slate-500 uppercase">Resource Match Rate</div>
          <div className="text-2xl font-black font-mono text-slate-900 my-0.5">99.4%</div>
          <div className="text-[11px] font-semibold text-emerald-700">Zero bypass errors</div>
        </div>

        <div className="glass-card p-4">
          <div className="text-xs font-bold text-slate-500 uppercase">Peak 15-min Volume</div>
          <div className="text-2xl font-black font-mono text-slate-900 my-0.5">31 <span className="text-sm font-normal text-slate-500">cases</span></div>
          <div className="text-[11px] font-semibold text-amber-700">Surge threshold triggered</div>
        </div>

        <div className="glass-card p-4">
          <div className="text-xs font-bold text-slate-500 uppercase">Avg ICU Occupancy</div>
          <div className="text-2xl font-black font-mono text-slate-900 my-0.5">72%</div>
          <div className="text-[11px] font-semibold text-blue-700">Balanced load distribution</div>
        </div>
      </div>

      {/* Large Clean Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Emergency Volume Chart */}
        <div className="glass-card p-5">
          <div className="border-b border-slate-200/60 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-900">Emergency Arrivals Over Time</h3>
            <p className="text-xs text-slate-500">Hourly emergency influx volume ({timeRange})</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={arrivalsData}>
                <defs>
                  <linearGradient id="colorArrivals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e2e8f0' }} />
                <Area type="monotone" dataKey="arrivals" stroke="#ef4444" strokeWidth={2.5} fill="url(#colorArrivals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hospital Capacity Utilization */}
        <div className="glass-card p-5">
          <div className="border-b border-slate-200/60 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-900">Hospital ICU Occupancy %</h3>
            <p className="text-xs text-slate-500">Regional hospital ICU capacity load distribution</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hospitalUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e2e8f0' }} />
                <Bar dataKey="icu" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
