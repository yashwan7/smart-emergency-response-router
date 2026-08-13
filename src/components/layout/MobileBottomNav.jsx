import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  LayoutDashboard, 
  AlertCircle, 
  MapPin, 
  Building2, 
  Menu 
} from 'lucide-react';

export const MobileBottomNav = ({ onOpenMobileMenu }) => {
  const { activeTab, setActiveTab, emergencies, alerts } = useSimulation();

  const waitingCount = emergencies.filter(e => e.status === 'WAITING').length;
  const unreadAlertsCount = alerts.filter(a => !a.read).length;
  const totalBadges = waitingCount + unreadAlertsCount;

  const mainTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'emergencies', label: 'Emergencies', icon: AlertCircle, badge: waitingCount },
    { id: 'map', label: 'Routing', icon: MapPin },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 px-2 py-2 shadow-lg transition-colors">
      <div className="flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-rose-600 dark:text-rose-400 font-bold scale-105' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Menu Toggle for extra tabs */}
        <button
          onClick={onOpenMobileMenu}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            !mainTabs.some(t => t.id === activeTab)
              ? 'text-rose-600 dark:text-rose-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Menu className="w-5 h-5 stroke-2" />
            {totalBadges > 0 && !mainTabs.some(t => t.id === activeTab) && (
              <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight">
            Menu
          </span>
        </button>
      </div>
    </div>
  );
};
