import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { DemoWalkthroughBar } from './DemoWalkthroughBar';
import { ToastContainer } from '../common/ToastContainer';
import { PatientDetailDrawer } from '../emergencies/PatientDetailDrawer';
import { HospitalDetailDrawer } from '../hospitals/HospitalDetailDrawer';
import { NewEmergencyWizardModal } from '../emergencies/NewEmergencyWizardModal';
import { AllocationDecisionModal } from '../common/AllocationDecisionModal';
import { Activity, ShieldCheck } from 'lucide-react';

// View Sections
import { DashboardView } from '../dashboard/DashboardView';
import { EmergenciesList } from '../emergencies/EmergenciesList';
import { PatientsView } from '../patients/PatientsView';
import { HospitalsList } from '../hospitals/HospitalsList';
import { HospitalRoutingMap } from '../routing/HospitalRoutingMap';
import { ResourcesManagement } from '../resources/ResourcesManagement';
import { AllocationsTimeline } from '../allocations/AllocationsTimeline';
import { AlertCenter } from '../alerts/AlertCenter';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { ReportsView } from '../reports/ReportsView';
import { SettingsView } from '../settings/SettingsView';

export const AppShell = () => {
  const { activeTab, isSidebarCollapsed, decisionModalPatientId, setDecisionModalPatientId } = useSimulation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-100/60 dark:bg-[#0a0e1a] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-16 md:pb-0">
      
      {/* Interactive Demo Walkthrough Controller Bar */}
      <DemoWalkthroughBar />

      {/* Main Shell Container */}
      <div className="flex-1 flex">
        
        {/* Left Sidebar */}
        <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Right Content Column */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}>
          
          {/* Top Header */}
          <TopHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          {/* Main Content Area */}
          <main className="flex-1 p-3 sm:p-6 max-w-[1600px] w-full mx-auto relative z-10">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'emergencies' && <EmergenciesList />}
            {activeTab === 'patients' && <PatientsView />}
            {activeTab === 'hospitals' && <HospitalsList />}
            {activeTab === 'map' && <HospitalRoutingMap />}
            {activeTab === 'resources' && <ResourcesManagement />}
            {activeTab === 'allocations' && <AllocationsTimeline />}
            {activeTab === 'alerts' && <AlertCenter />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'settings' && <SettingsView />}
          </main>

          {/* Clean Healthcare Command Center Footer */}
          <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 py-4 px-4 sm:px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl text-xs text-slate-500 dark:text-slate-400 relative z-10 mt-8 transition-colors">
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Activity className="w-4 h-4 text-rose-600 dark:text-rose-500 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Smart Emergency Response & Hospital Capacity Router</span>
                <span className="hidden md:inline">• Healthcare Operations Command Platform</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span className="pulse-dot-green" /> All Systems Operational
                </span>
                <span className="hidden sm:inline">Database: <strong className="text-slate-800 dark:text-slate-200">PostgreSQL Connected</strong></span>
                <span className="hidden sm:inline">API Status: <strong className="text-emerald-700 dark:text-emerald-400">Active</strong></span>
                <span>© 2025 Smart Emergency Systems</span>
              </div>
            </div>
          </footer>

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Drawer & Modal Overlays */}
      <PatientDetailDrawer />
      <HospitalDetailDrawer />
      <NewEmergencyWizardModal />
      <AllocationDecisionModal 
        isOpen={!!decisionModalPatientId} 
        onClose={() => setDecisionModalPatientId(null)} 
        patientId={decisionModalPatientId} 
      />
      <ToastContainer />

    </div>
  );
};
