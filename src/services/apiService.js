/**
 * SMART EMERGENCY ROUTER - API SERVICE LAYER
 * Prepared frontend service functions matching agreed backend API contracts.
 * Connects seamlessly to state or real HTTP endpoints.
 */

// Simulated network latency for realistic operational feel
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // GET /api/dashboard/summary
  async getDashboardSummary(emergencies, hospitals, allocations) {
    await delay(100);
    const activeEmergencies = emergencies.filter(e => e.status !== 'DISCHARGED').length;
    const patientsWaiting = emergencies.filter(e => e.status === 'WAITING').length;
    const criticalCases = emergencies.filter(e => e.status === 'WAITING' && (e.esiLevel === 1 || e.esiLevel === 2)).length;
    const hospitalsOnline = hospitals.filter(h => h.status === 'ONLINE').length;
    const totalHospitals = hospitals.length;
    
    return {
      status: 200,
      data: {
        activeEmergencies,
        patientsWaiting,
        criticalCases,
        hospitalsOnline: `${hospitalsOnline} / ${totalHospitals}`,
        avgResponseTimeMins: 14,
        trendActive: '+12% vs last hour',
        trendWaiting: '+5% vs last hour',
        trendCritical: 'No change',
        trendHospitals: '+2 vs last hour',
        trendResponseTime: '-2 min vs last hour'
      }
    };
  },

  // GET /api/emergencies
  async getEmergencies(emergencies, filter = 'ALL', search = '') {
    await delay(100);
    let list = [...emergencies];

    if (filter === 'CRITICAL') {
      list = list.filter(e => e.esiLevel === 1 || e.esiLevel === 2);
    } else if (filter === 'WAITING') {
      list = list.filter(e => e.status === 'WAITING');
    } else if (filter === 'ASSIGNED') {
      list = list.filter(e => e.status === 'ASSIGNED');
    } else if (filter === 'DISCHARGED') {
      list = list.filter(e => e.status === 'DISCHARGED');
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => 
        e.id.toLowerCase().includes(q) || 
        e.name.toLowerCase().includes(q) ||
        e.symptoms.some(s => s.toLowerCase().includes(q))
      );
    }

    return { status: 200, data: list };
  },

  // GET /api/emergencies/{id}
  async getEmergencyById(emergencies, id) {
    await delay(80);
    const item = emergencies.find(e => e.id === id);
    if (!item) return { status: 404, message: 'Emergency case not found' };
    return { status: 200, data: item };
  },

  // POST /api/emergencies
  async createEmergency(addEmergencyFn, newEmergencyData) {
    await delay(200);
    addEmergencyFn(newEmergencyData);
    return {
      status: 201,
      message: 'Emergency case submitted and queued into Priority Engine',
      data: newEmergencyData
    };
  },

  // GET /api/hospitals
  async getHospitals(hospitals) {
    await delay(100);
    return { status: 200, data: hospitals };
  },

  // GET /api/hospitals/{id}
  async getHospitalById(hospitals, id) {
    await delay(80);
    const h = hospitals.find(item => item.id === id);
    if (!h) return { status: 404, message: 'Hospital not found' };
    return { status: 200, data: h };
  },

  // PUT /api/hospitals/{id}/capacity
  async updateHospitalCapacity(setHospitalsFn, hospitalId, capacityUpdates) {
    await delay(150);
    setHospitalsFn(prev => 
      prev.map(h => h.id === hospitalId ? { ...h, ...capacityUpdates } : h)
    );
    return { status: 200, message: 'Hospital capacity updated successfully' };
  },

  // POST /api/allocate/{emergencyId}
  async triggerAllocation(runAllocationSchedulerFn, emergencyId) {
    await delay(250);
    runAllocationSchedulerFn(emergencyId);
    return {
      status: 200,
      message: `Allocation engine executed for emergency ${emergencyId}`
    };
  },

  // GET /api/allocations/{id}
  async getAllocations(allocations) {
    await delay(100);
    return { status: 200, data: allocations };
  },

  // GET /api/alerts
  async getAlerts(alerts) {
    await delay(100);
    return { status: 200, data: alerts };
  }
};
