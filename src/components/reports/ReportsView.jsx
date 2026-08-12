import React from 'react';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

export const ReportsView = () => {
  const reportsList = [
    { id: 1, title: 'Daily Emergency Operations Report', date: 'May 15, 2025', desc: 'Summary of 24-hour emergency triage, ESI breakdown, and dispatch logs', size: '2.4 MB' },
    { id: 2, title: 'Regional Hospital Utilization Audit', date: 'May 14, 2025', desc: 'Detailed occupancy audit for ICU, general beds, and doctor shifts', size: '1.8 MB' },
    { id: 3, title: 'Deterministic Allocation Engine Performance', date: 'May 13, 2025', desc: 'Resource feasibility accuracy, bypass prevention metrics, and response times', size: '3.1 MB' },
    { id: 4, title: 'Response Time & Traffic Delay Log', date: 'May 12, 2025', desc: 'Spatial travel time distribution vs calculated maps ETA accuracy', size: '1.2 MB' },
    { id: 5, title: 'Outbreak Surge Anomaly History', date: 'May 10, 2025', desc: '15-minute emergency count spikes and automated Twilio alert logs', size: '950 KB' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          EXECUTIVE REPORTS & AUDIT LOGS
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Generated operational audit reports, capacity utilization records, and export files
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsList.map(report => (
          <div key={report.id} className="glass-card glass-card-hover p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{report.title}</h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{report.date} · {report.size}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium my-2">
                {report.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-end gap-2">
              <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>View Report</span>
              </button>

              <button className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
