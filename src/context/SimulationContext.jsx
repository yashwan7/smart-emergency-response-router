import React, { createContext, useContext, useState, useEffect } from 'react';

const SimulationContext = createContext();

export const initialHospitals = [
  {
    id: 'H01',
    name: 'City Care Hospital',
    distanceKm: 5.2,
    baseEtaMins: 11,
    lat: 12.9716,
    lng: 77.5946,
    icuTotal: 10,
    icuAvailable: 2,
    generalTotal: 30,
    generalAvailable: 12,
    doctorsTotal: 12,
    doctorsAvailable: 8,
    ambulancesTotal: 5,
    ambulancesAvailable: 2,
    specializations: ['Cardiology', 'ICU', 'Neurology'],
    equipment: ['ICU-01', 'VENT-01', 'MRI', 'ECG'],
    status: 'ONLINE',
    address: '45 Healthcare Boulevard, Sector 4'
  },
  {
    id: 'H02',
    name: 'Green Life Hospital',
    distanceKm: 8.7,
    baseEtaMins: 16,
    lat: 12.9800,
    lng: 77.6000,
    icuTotal: 10,
    icuAvailable: 6,
    generalTotal: 30,
    generalAvailable: 18,
    doctorsTotal: 15,
    doctorsAvailable: 10,
    ambulancesTotal: 4,
    ambulancesAvailable: 1,
    specializations: ['Pulmonology', 'Trauma', 'ICU'],
    equipment: ['ICU-02', 'VENT-02', 'VENT-03', 'CT-Scan'],
    status: 'ONLINE',
    address: '102 Eco Park Road, Central District'
  },
  {
    id: 'H03',
    name: 'Metro Emergency Hospital',
    distanceKm: 12.3,
    baseEtaMins: 21,
    lat: 12.9600,
    lng: 77.5800,
    icuTotal: 8,
    icuAvailable: 0, // Zero ICU beds - tests feasibility bypass!
    generalTotal: 25,
    generalAvailable: 8,
    doctorsTotal: 10,
    doctorsAvailable: 5,
    ambulancesTotal: 3,
    ambulancesAvailable: 0,
    specializations: ['General Surgery', 'Orthopedics'],
    equipment: ['X-Ray', 'Ultrasound'],
    status: 'BUSY',
    address: '78 Ring Road Corridor'
  },
  {
    id: 'H04',
    name: 'Sunrise Medical Center',
    distanceKm: 15.1,
    baseEtaMins: 24,
    lat: 12.9500,
    lng: 77.6200,
    icuTotal: 15,
    icuAvailable: 3,
    generalTotal: 30,
    generalAvailable: 15,
    doctorsTotal: 13,
    doctorsAvailable: 7,
    ambulancesTotal: 2,
    ambulancesAvailable: 1,
    specializations: ['Pediatrics', 'Cardiology', 'ICU'],
    equipment: ['ICU-03', 'VENT-04', 'Defibrillator'],
    status: 'ONLINE',
    address: '210 Sunrise Ave, East Ridge'
  },
  {
    id: 'H05',
    name: 'Wellness Specialty Hospital',
    distanceKm: 18.6,
    baseEtaMins: 28,
    lat: 12.9300,
    lng: 77.5700,
    icuTotal: 8,
    icuAvailable: 4,
    generalTotal: 20,
    generalAvailable: 10,
    doctorsTotal: 10,
    doctorsAvailable: 6,
    ambulancesTotal: 2,
    ambulancesAvailable: 1,
    specializations: ['Internal Medicine', 'Cardiology'],
    equipment: ['ECG', 'Dialysis'],
    status: 'ONLINE',
    address: '99 South Avenue, Block C'
  }
];

export const initialEmergencies = [
  {
    id: 'P101',
    name: 'Rahul Verma',
    age: 45,
    gender: 'Male',
    esiLevel: 1, // Resuscitation
    symptoms: ['Chest Pain', 'Breathing Difficulty', 'Unresponsive'],
    vitals: { heartRate: 142, spo2: 84, bloodPressure: '80/50' },
    requiredResources: ['ICU', 'Ventilator', 'Cardiologist'],
    arrivalTime: new Date(Date.now() - 120000).toISOString(),
    waitTimeSeconds: 120,
    priorityScore: 98.7,
    status: 'WAITING',
    assignedHospitalId: null,
    assignedHospitalName: null,
    etaMins: null,
    location: 'Downtown Square (5.2 km)'
  },
  {
    id: 'P102',
    name: 'Priya Sharma',
    age: 60,
    gender: 'Female',
    esiLevel: 2, // Emergent
    symptoms: ['Severe Headache', 'Dizziness', 'Confusion'],
    vitals: { heartRate: 110, spo2: 92, bloodPressure: '135/90' },
    requiredResources: ['ICU', 'Neurologist'],
    arrivalTime: new Date(Date.now() - 300000).toISOString(),
    waitTimeSeconds: 300,
    priorityScore: 76.4,
    status: 'WAITING',
    assignedHospitalId: null,
    assignedHospitalName: null,
    etaMins: null,
    location: 'North Highway Exit 4 (8.7 km)'
  },
  {
    id: 'P103',
    name: 'Amit Patel',
    age: 30,
    gender: 'Male',
    esiLevel: 3, // Urgent
    symptoms: ['Leg Fracture', 'Severe Pain'],
    vitals: { heartRate: 98, spo2: 96, bloodPressure: '120/80' },
    requiredResources: ['General Bed', 'Orthopedics'],
    arrivalTime: new Date(Date.now() - 420000).toISOString(),
    waitTimeSeconds: 420,
    priorityScore: 54.1,
    status: 'WAITING',
    assignedHospitalId: null,
    assignedHospitalName: null,
    etaMins: null,
    location: 'Central Mall Sector 5 (4.8 km)'
  },
  {
    id: 'P104',
    name: 'Sneha Gupta',
    age: 25,
    gender: 'Female',
    esiLevel: 4, // Less Urgent
    symptoms: ['High Fever 103°F', 'Dehydration'],
    vitals: { heartRate: 88, spo2: 98, bloodPressure: '115/75' },
    requiredResources: ['General Bed'],
    arrivalTime: new Date(Date.now() - 600000).toISOString(),
    waitTimeSeconds: 600,
    priorityScore: 32.6,
    status: 'WAITING',
    assignedHospitalId: null,
    assignedHospitalName: null,
    etaMins: null,
    location: 'Residential Colony (2.1 km)'
  },
  {
    id: 'P105',
    name: 'Vikram Singh',
    age: 40,
    gender: 'Male',
    esiLevel: 5, // Non-Urgent
    symptoms: ['Cold', 'Mild Cough'],
    vitals: { heartRate: 72, spo2: 99, bloodPressure: '118/78' },
    requiredResources: ['General Bed'],
    arrivalTime: new Date(Date.now() - 660000).toISOString(),
    waitTimeSeconds: 660,
    priorityScore: 18.2,
    status: 'WAITING',
    assignedHospitalId: null,
    assignedHospitalName: null,
    etaMins: null,
    location: 'Suburban Zone B (7.5 km)'
  }
];

export const initialAllocations = [
  {
    id: 'ALC-901',
    patientId: 'P100',
    patientName: 'Karan Mehta (ESI Level 1)',
    hospitalId: 'H01',
    hospitalName: 'City Care Hospital',
    allocatedBed: 'ICU-03',
    allocatedDoctor: 'Dr. Mahto (Cardiology)',
    allocatedAt: '10:20 AM',
    status: 'IN_TRANSIT',
    etaMins: 11,
    progressPercent: 65
  },
  {
    id: 'ALC-900',
    patientId: 'P099',
    patientName: 'Ananya Rao (ESI Level 2)',
    hospitalId: 'H02',
    hospitalName: 'Green Life Hospital',
    allocatedBed: 'ICU-01',
    allocatedDoctor: 'Dr. Mehta (ICU)',
    allocatedAt: '10:15 AM',
    status: 'ADMITTED',
    etaMins: 0,
    progressPercent: 100
  },
  {
    id: 'ALC-899',
    patientId: 'P098',
    patientName: 'Sunil Iyer (ESI Level 2)',
    hospitalId: 'H03',
    hospitalName: 'Metro Hospital',
    allocatedBed: 'General-22',
    allocatedDoctor: 'Dr. Iyer',
    allocatedAt: '10:10 AM',
    status: 'ADMITTED',
    etaMins: 0,
    progressPercent: 100
  },
  {
    id: 'ALC-898',
    patientId: 'P097',
    patientName: 'Neha Sen (ESI Level 2)',
    hospitalId: 'H01',
    hospitalName: 'City Care Hospital',
    allocatedBed: 'ICU-02',
    allocatedDoctor: 'Dr. Mahto',
    allocatedAt: '10:05 AM',
    status: 'ADMITTED',
    etaMins: 0,
    progressPercent: 100
  },
  {
    id: 'ALC-897',
    patientId: 'P096',
    patientName: 'Rohan Patel (ESI Level 4)',
    hospitalId: 'H04',
    hospitalName: 'Sunrise Hospital',
    allocatedBed: 'General-05',
    allocatedDoctor: 'Dr. Patel',
    allocatedAt: '10:00 AM',
    status: 'ADMITTED',
    etaMins: 0,
    progressPercent: 100
  }
];

export const initialAlerts = [
  {
    id: 'ALT-301',
    type: 'CRITICAL',
    title: 'Critical Patient Assigned',
    message: 'P101 assigned to City Care Hospital',
    timestamp: '2 min ago',
    sentTwilio: true,
    read: false
  },
  {
    id: 'ALT-300',
    type: 'CAPACITY',
    title: 'ICU Capacity Low',
    message: 'City Care Hospital ICU occupancy reached 85%',
    timestamp: '5 min ago',
    sentTwilio: false,
    read: false
  },
  {
    id: 'ALT-299',
    type: 'SURGE',
    title: 'Emergency Surge Detected',
    message: '24% more cases than usual',
    timestamp: '10 min ago',
    sentTwilio: true,
    read: true
  },
  {
    id: 'ALT-298',
    type: 'SYSTEM',
    title: 'New Emergency Received',
    message: 'P106 · Level 2 Emergency queued',
    timestamp: '10 min ago',
    sentTwilio: false,
    read: true
  }
];

export const initialSystemEvents = [
  { id: 'EVT-105', timestamp: '10:20:05 AM', type: 'ALLOCATION', title: 'Hospital Resource Reserved', description: 'Patient P100 assigned to City Care Hospital (Bed ICU-03 reserved)', badge: 'COMPLETED' },
  { id: 'EVT-104', timestamp: '10:20:04 AM', type: 'SCHEDULER', title: 'Candidate Hospitals Evaluated', description: 'Engine evaluated regional hospital resource feasibility & Google Maps ETA', badge: 'SCHEDULER' },
  { id: 'EVT-103', timestamp: '10:20:03 AM', type: 'TRIAGE', title: 'Patient Ingested into Queue', description: 'P100 ESI Level 1 (Severe Dyspnea) assigned Priority Score 56.3', badge: 'TRIAGED' },
  { id: 'EVT-102', timestamp: '10:15:00 AM', type: 'ALLOCATION', title: 'Hospital Resource Reserved', description: 'Patient P099 assigned to Green Life Hospital (Bed ICU-01 reserved)', badge: 'COMPLETED' },
  { id: 'EVT-101', timestamp: '10:00:00 AM', type: 'ALERT', title: 'Outbreak Surge Alert Broadcast', description: 'Regional emergency influx +3.1σ anomaly detected', badge: 'ALERT' }
];

export const SimulationProvider = ({ children }) => {
  const [emergencies, setEmergencies] = useState(initialEmergencies);
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [allocations, setAllocations] = useState(initialAllocations);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [systemEvents, setSystemEvents] = useState(initialSystemEvents);
  const [toasts, setToasts] = useState([]);

  
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Navigation active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Selected drawers & modals
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [decisionModalPatientId, setDecisionModalPatientId] = useState(null);
  const [isNewEmergencyModalOpen, setIsNewEmergencyModalOpen] = useState(false);


  // Algorithm tunables
  const [severityWeight, setSeverityWeight] = useState(10);
  const [agingWeight, setAgingWeight] = useState(0.5);

  // Surge state
  const [surgeState, setSurgeState] = useState({
    isSurge: true,
    currentArrivals: 24,
    baseline: 19,
    deviation: 26
  });

  // Recalculate priority scores dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      setEmergencies(prevQueue => {
        return prevQueue.map(patient => {
          if (patient.status !== 'WAITING') return patient;
          const newWait = patient.waitTimeSeconds + 2;
          const baseSeverityScore = (6 - patient.esiLevel) * severityWeight;
          const agingScore = (newWait * agingWeight) / 10;
          const calculatedPriority = parseFloat((baseSeverityScore + agingScore).toFixed(1));

          return {
            ...patient,
            waitTimeSeconds: newWait,
            priorityScore: calculatedPriority
          };
        }).sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [severityWeight, agingWeight]);

  // Allocation engine execution
  const runAllocationScheduler = (targetPatientId = null, targetHospitalId = null) => {
    let patientToAllocate = null;

    if (targetPatientId) {
      patientToAllocate = emergencies.find(p => p.id === targetPatientId && p.status === 'WAITING');
    } else {
      const sortedWaiting = [...emergencies]
        .filter(p => p.status === 'WAITING')
        .sort((a, b) => b.priorityScore - a.priorityScore);
      patientToAllocate = sortedWaiting[0];
    }

    if (!patientToAllocate) {
      triggerToast('System Info', 'No waiting emergencies in priority queue.');
      return;
    }

    let selectedHospital = null;

    if (targetHospitalId) {
      selectedHospital = hospitals.find(h => h.id === targetHospitalId);
    } else {
      // Step 1: Feasibility Check
      const requiredRes = patientToAllocate.requiredResources || [];
      const isICURequired = requiredRes.some(r => r.toUpperCase().includes('ICU'));

      const feasibleHospitals = hospitals.filter(h => {
        if (h.status !== 'ONLINE') return false;
        if (isICURequired && h.icuAvailable <= 0) return false;
        if (!isICURequired && h.generalAvailable <= 0) return false;
        if (h.doctorsAvailable <= 0) return false;
        return true;
      });

      if (feasibleHospitals.length === 0) {
        triggerToast('Resource Constraint', `No hospital currently has feasible ICU/Doctor capacity for ${patientToAllocate.id}.`);
        return;
      }

      // Step 2: Rank by Distance / Maps ETA
      feasibleHospitals.sort((a, b) => a.distanceKm - b.distanceKm);
      selectedHospital = feasibleHospitals[0];
    }

    if (!selectedHospital) return;

    const isICU = (patientToAllocate.requiredResources || []).some(r => r.toUpperCase().includes('ICU'));

    // Step 3: Reserve Resources
    setHospitals(prev =>
      prev.map(h => {
        if (h.id === selectedHospital.id) {
          return {
            ...h,
            icuAvailable: isICU ? Math.max(0, h.icuAvailable - 1) : h.icuAvailable,
            generalAvailable: !isICU ? Math.max(0, h.generalAvailable - 1) : h.generalAvailable,
            doctorsAvailable: Math.max(0, h.doctorsAvailable - 1),
            ambulancesAvailable: Math.max(0, h.ambulancesAvailable - 1)
          };
        }
        return h;
      })
    );

    // Step 4: Update Patient Status
    const assignedEta = selectedHospital.baseEtaMins;
    setEmergencies(prev =>
      prev.map(p => {
        if (p.id === patientToAllocate.id) {
          return {
            ...p,
            status: 'ASSIGNED',
            assignedHospitalId: selectedHospital.id,
            assignedHospitalName: selectedHospital.name,
            etaMins: assignedEta
          };
        }
        return p;
      })
    );

    // Step 5: Log Allocation Timeline
    const newAlloc = {
      id: `ALC-${Math.floor(902 + Math.random() * 98)}`,
      patientId: patientToAllocate.id,
      patientName: `${patientToAllocate.name} (ESI Level ${patientToAllocate.esiLevel})`,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      allocatedBed: isICU ? `ICU-0${Math.floor(Math.random() * 6 + 1)}` : `Gen-Bed-${Math.floor(Math.random() * 20 + 1)}`,
      allocatedDoctor: `Dr. Mahto (${selectedHospital.specializations[0] || 'Cardiology'})`,
      allocatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'IN_TRANSIT',
      etaMins: assignedEta,
      progressPercent: 20
    };
    setAllocations(prev => [newAlloc, ...prev]);

    // Step 6: Create Alert
    const newAlert = {
      id: `ALT-${Math.floor(302 + Math.random() * 600)}`,
      type: 'CRITICAL',
      title: 'CRITICAL PATIENT ASSIGNED',
      message: `${patientToAllocate.id} assigned to ${selectedHospital.name} (${assignedEta} min ETA)`,
      timestamp: 'Just now',
      sentTwilio: true,
      read: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    // Step 7: Push Real System Timeline Event
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const evtEval = {
      id: `EVT-${Date.now()}-1`,
      timestamp: nowTime,
      type: 'SCHEDULER',
      title: `${hospitals.length} Regional Hospitals Evaluated`,
      description: `Evaluated resource feasibility & Google Maps ETA for patient ${patientToAllocate.id}`,
      badge: 'SCHEDULER'
    };
    const evtAlloc = {
      id: `EVT-${Date.now()}-2`,
      timestamp: nowTime,
      type: 'ALLOCATION',
      title: 'Hospital Resource Reserved',
      description: `Assigned ${patientToAllocate.id} to ${selectedHospital.name} (${newAlloc.allocatedBed} & ${newAlloc.allocatedDoctor} reserved)`,
      badge: 'COMPLETED'
    };
    setSystemEvents(prev => [evtAlloc, evtEval, ...prev]);

    triggerToast('Allocation Complete', `${patientToAllocate.id} assigned to ${selectedHospital.name} (ETA ${assignedEta}m)`);
  };


  // Discharge Patient
  const dischargePatient = (allocationId) => {
    const alloc = allocations.find(a => a.id === allocationId);
    if (!alloc) return;

    setHospitals(prev =>
      prev.map(h => {
        if (h.id === alloc.hospitalId) {
          const isICU = alloc.allocatedBed.includes('ICU');
          return {
            ...h,
            icuAvailable: isICU ? Math.min(h.icuTotal, h.icuAvailable + 1) : h.icuAvailable,
            generalAvailable: !isICU ? Math.min(h.generalTotal, h.generalAvailable + 1) : h.generalAvailable,
            doctorsAvailable: Math.min(h.doctorsTotal, h.doctorsAvailable + 1),
            ambulancesAvailable: Math.min(h.ambulancesTotal, h.ambulancesAvailable + 1)
          };
        }
        return h;
      })
    );

    setAllocations(prev => prev.map(a => a.id === allocationId ? { ...a, status: 'DISCHARGED', progressPercent: 100 } : a));
    setEmergencies(prev => prev.map(p => p.id === alloc.patientId ? { ...p, status: 'DISCHARGED' } : p));
    triggerToast('Patient Discharged', `Resource ${alloc.allocatedBed} freed at ${alloc.hospitalName}.`);
  };

  // Add Emergency
  const addEmergency = (newPatient) => {
    const baseSeverityScore = (6 - newPatient.esiLevel) * severityWeight;
    const patientObj = {
      id: `P${Math.floor(106 + Math.random() * 890)}`,
      arrivalTime: new Date().toISOString(),
      waitTimeSeconds: 0,
      priorityScore: parseFloat(baseSeverityScore.toFixed(1)),
      status: 'WAITING',
      assignedHospitalId: null,
      assignedHospitalName: null,
      etaMins: null,
      ...newPatient
    };

    setEmergencies(prev => [patientObj, ...prev]);
    
    // Add alert
    setAlerts(prev => [
      {
        id: `ALT-${Date.now()}`,
        type: 'SYSTEM',
        title: 'NEW EMERGENCY RECEIVED',
        message: `${patientObj.id} · Level ${patientObj.esiLevel} Emergency`,
        timestamp: 'Just now',
        sentTwilio: false,
        read: false
      },
      ...prev
    ]);

    triggerToast('New Emergency Queued', `Case ${patientObj.id} (ESI Level ${patientObj.esiLevel}) entered priority queue.`);
    return patientObj;
  };

  // Trigger Outbreak Surge
  const triggerSurgeSimulation = () => {
    const newSurge = {
      isSurge: true,
      currentArrivals: 31,
      baseline: 19,
      deviation: 63
    };
    setSurgeState(newSurge);

    // Add surge cases
    addEmergency({
      name: 'Surge Influx Case A',
      age: 52,
      gender: 'Male',
      esiLevel: 1,
      symptoms: ['Acute Cardiac Arrest', 'Unconscious'],
      vitals: { heartRate: 160, spo2: 79, bloodPressure: '70/40' },
      requiredResources: ['ICU', 'Ventilator', 'Cardiologist'],
      location: 'Central Stadium'
    });

    addEmergency({
      name: 'Surge Influx Case B',
      age: 38,
      gender: 'Female',
      esiLevel: 2,
      symptoms: ['Multiple Trauma', 'Internal Bleeding'],
      vitals: { heartRate: 135, spo2: 88, bloodPressure: '90/55' },
      requiredResources: ['ICU', 'Trauma Surgeon'],
      location: 'Highway Interchange 8'
    });

    setAlerts(prev => [
      {
        id: `ALT-SURGE-${Date.now()}`,
        type: 'SURGE',
        title: 'EMERGENCY SURGE DETECTED',
        message: '63% sudden spike over 15-min baseline! High capacity alert broadcast.',
        timestamp: 'Just now',
        sentTwilio: true,
        read: false
      },
      ...prev
    ]);

    triggerToast('🚨 SURGE DETECTED', 'Emergency surge anomaly detected (+63% over baseline)! Alerts dispatched.');
  };

  // Notification toast helper
  const triggerToast = (title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  return (
    <SimulationContext.Provider
      value={{
        emergencies,
        hospitals,
        allocations,
        alerts,
        systemEvents,
        toasts,

        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        selectedPatientId,
        setSelectedPatientId,
        selectedHospitalId,
        setSelectedHospitalId,
        decisionModalPatientId,
        setDecisionModalPatientId,
        isNewEmergencyModalOpen,

        setIsNewEmergencyModalOpen,
        severityWeight,
        setSeverityWeight,
        agingWeight,
        setAgingWeight,
        surgeState,
        runAllocationScheduler,
        dischargePatient,
        addEmergency,
        triggerSurgeSimulation,
        triggerToast,
        setHospitals,
        setEmergencies,
        setAlerts
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => useContext(SimulationContext);
