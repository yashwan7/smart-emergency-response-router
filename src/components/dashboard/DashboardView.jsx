import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { KpiCard } from '../common/KpiCard';
import { LiveEmergencyQueuePreview } from './LiveEmergencyQueuePreview';
import { HospitalCapacityPreview } from './HospitalCapacityPreview';
import { AllocationTrendChart } from './AllocationTrendChart';
import { SystemActivityTimeline } from '../common/SystemActivityTimeline';
import { 
  Activity, 
  Users, 
  AlertTriangle, 
  Building2, 
  Clock 
} from 'lucide-react';

export const DashboardView = () => {
  const { emergencies, hospitals } = useSimulation();

  const activeEmergencies = emergencies.filter(e => e.status !== 'DISCHARGED').length;
  const waitingPatients = emergencies.filter(e => e.status === 'WAITING').length;
  const criticalCases = emergencies.filter(e => e.status === 'WAITING' && (e.esiLevel === 1 || e.esiLevel === 2)).length;
  const hospitalsOnline = hospitals.filter(h => h.status === 'ONLINE').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Section 1: 5 KPI Metric Cards with Animated Count Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          icon={Activity}
          title="Active Emergencies"
          value={activeEmergencies}
          trend="↑ 12% vs last hour"
          trendType="up"
          sparklineColor="#ef4444"
          iconBg="bg-rose-50 text-rose-600 border-rose-200"
        />

        <KpiCard
          icon={Users}
          title="Patients Waiting"
          value={waitingPatients}
          trend="↑ 5% vs last hour"
          trendType="up"
          sparklineColor="#f59e0b"
          iconBg="bg-amber-50 text-amber-600 border-amber-200"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Critical Cases"
          value={criticalCases}
          trend="No change"
          trendType="neutral"
          sparklineColor="#dc2626"
          iconBg="bg-red-50 text-red-600 border-red-200"
        />

        <KpiCard
          icon={Building2}
          title="Hospitals Online"
          value={`${hospitalsOnline} / ${hospitals.length}`}
          trend="↑ 2 vs last hour"
          trendType="up"
          sparklineColor="#10b981"
          iconBg="bg-emerald-50 text-emerald-600 border-emerald-200"
        />

        <KpiCard
          icon={Clock}
          title="Avg Response Time"
          value={14}
          unit="min"
          trend="↓ 2 min vs last hour"
          trendType="down"
          sparklineColor="#3b82f6"
          iconBg="bg-blue-50 text-blue-600 border-blue-200"
        />
      </div>

      {/* Main Operational Grid: Live Emergency Queue + Hospital Capacity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveEmergencyQueuePreview />
        <HospitalCapacityPreview />
      </div>

      {/* Real Operational System Event Activity Timeline */}
      <SystemActivityTimeline limit={6} />

      {/* Allocation Trend & Recent Allocations Feed */}
      <AllocationTrendChart />

    </div>
  );
};

