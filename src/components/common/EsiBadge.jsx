import React from 'react';

const ESI_CONFIG = {
  1: { label: 'LEVEL 1', name: 'Resuscitation', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-600' },
  2: { label: 'LEVEL 2', name: 'Emergent', bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-600' },
  3: { label: 'LEVEL 3', name: 'Urgent', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-600' },
  4: { label: 'LEVEL 4', name: 'Less Urgent', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-600' },
  5: { label: 'LEVEL 5', name: 'Non-Urgent', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-600' }
};

export const EsiBadge = ({ level, showName = false, size = 'md' }) => {
  const config = ESI_CONFIG[level] || ESI_CONFIG[3];
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px]' 
    : size === 'lg' 
    ? 'px-3 py-1.5 text-xs font-bold' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs transition-transform duration-150 hover:scale-105 cursor-default ${config.bg} ${sizeClasses}`}
      title="ESI-inspired simulation triage score"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
      {showName && <span className="opacity-80 font-normal">· {config.name}</span>}
    </span>
  );
};
