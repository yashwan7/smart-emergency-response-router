import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Users, 
  Building2, 
  Cpu, 
  ArrowRightLeft, 
  Bell, 
  BarChart3, 
  FileText, 
  Settings, 
  PhoneCall, 
  ChevronLeft, 
  ChevronRight,
  Activity,
  MapPin
} from 'lucide-react';

export const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    alerts,
    emergencies
  } = useSimulation();

  const unreadAlertsCount = alerts.filter(a => !a.read).length;
  const waitingCount = emergencies.filter(e => e.status === 'WAITING').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'emergencies', label: 'Emergencies', icon: AlertCircle, badge: waitingCount > 0 ? waitingCount : null, badgeColor: 'bg-red-500 text-white' },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'map', label: 'Routing / Map', icon: MapPin },
    { id: 'resources', label: 'Resources', icon: Cpu },
    { id: 'allocations', label: 'Allocations', icon: ArrowRightLeft },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlertsCount > 0 ? unreadAlertsCount : null, badgeColor: 'bg-amber-500 text-white' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const navContent = (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto">
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between px-2 py-3 mb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/20 shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <div className="truncate">
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight leading-tight">
                  Smart Emergency
                </div>
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                  Response & Router
                </div>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:block p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCollapsed = isSidebarCollapsed && !isMobileMenuOpen;

            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-rose-600 shadow-md shadow-slate-900/10 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-rose-400 dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100'
                }`} />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {item.badge && !isCollapsed && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}

                {item.badge && isCollapsed && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Card: Emergency Hotline 108 */}
      {(!isSidebarCollapsed || isMobileMenuOpen) ? (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-slate-800 dark:text-slate-100 shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 shrink-0">
              <PhoneCall className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
                EMERGENCY HOTLINE
              </div>
              <div className="text-2xl font-black text-emerald-950 dark:text-emerald-100 font-mono tracking-tight leading-none my-0.5">
                108
              </div>
              <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                24/7 Support Center
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-2.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex flex-col items-center justify-center border border-emerald-200 dark:border-emerald-800" title="Emergency Hotline 108">
          <PhoneCall className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span className="text-[10px] font-bold mt-1 font-mono">108</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside 
        className={`hidden md:flex fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out flex-col justify-between p-3 sm:p-4 glass-card rounded-r-3xl rounded-l-none border-r border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-slate-900/80 backdrop-blur-xl ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full p-4 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 animate-slide-in-left">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
