import React, { useState } from 'react';
import { 
  FileCode2, 
  Database, 
  Calendar, 
  Users, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  Code, 
  GitBranch, 
  Server, 
  Cpu, 
  Globe
} from 'lucide-react';

export const SectionBlueprint = () => {
  const [subTab, setSubTab] = useState('roadmap');

  const roadmapDays = [
    { day: 'Day 1', title: 'Architecture, DB & Severity Rules', desc: 'Define API contracts, database schema, severity scoring matrix, and initial UI wireframes.' },
    { day: 'Day 2', title: 'Spring Boot & React Skeletons', desc: 'Initialize Spring Boot PostgreSQL backend and React Vite frontend project repositories.' },
    { day: 'Day 3', title: 'Emergency & Hospital REST APIs', desc: 'Build CRUD endpoints for patients, hospital bed capacities, and arrival tracking.' },
    { day: 'Day 4', title: 'Priority Queue & Anomaly Detection', desc: 'Implement ESI scoring + Java PriorityQueue max-heap and initial 15-min arrival z-score tracking.' },
    { day: 'Day 5', title: 'Starvation Aging Engine & Twilio', desc: 'Implement background aging scheduler, transactional resource allocation, and Twilio SMS integration.' },
    { day: 'Day 6', title: 'Google Maps API Integration', desc: 'Integrate Google Maps Distance Matrix API to filter feasible candidate hospitals by ETA.' },
    { day: 'Day 7', title: 'WebSocket / SSE Live Dashboard', desc: 'Connect real-time SSE/WebSocket stream between Spring Boot backend and React dashboard UI.' },
    { day: 'Day 8', title: 'Concurrency Checks & UI Polish', desc: 'Test race conditions during simultaneous patient arrivals and polish glassmorphic design system.' },
    { day: 'Day 9', title: 'End-to-End Testing & Deployment', desc: 'Run complete edge-case test suite (no-ICU case, external API failure recovery, surge simulation).' },
    { day: 'Day 10', title: 'Final Demo Rehearsal & Pitch', desc: 'Practice 10-step demo script and finalize team Q&A explanations for hackathon judges.' }
  ];

  const apiEndpoints = [
    { method: 'POST', path: '/api/emergencies', desc: 'Ingest emergency case with symptoms & vitals', reqPayload: '{\n  "name": "Patient 101",\n  "age": 54,\n  "symptoms": ["chest pain", "breathing difficulty"],\n  "vitals": {"heartRate": 125, "spo2": 86, "systolicBP": 90},\n  "requiredResources": ["ICU", "VENTILATOR"],\n  "location": {"lat": 12.97, "lng": 77.59}\n}' },
    { method: 'GET', path: '/api/emergencies', desc: 'Fetch active emergency priority queue', respPayload: '[\n  {\n    "emergencyId": "E101",\n    "severityLevel": 1,\n    "priorityScore": 98.7,\n    "status": "WAITING"\n  }\n]' },
    { method: 'POST', path: '/api/allocate/{id}', desc: 'Run resource feasibility check and assign patient to best hospital', respPayload: '{\n  "emergencyId": "E101",\n  "severityLevel": 1,\n  "hospitalId": "H01",\n  "etaMinutes": 9,\n  "resourcesReserved": ["ICU-04", "VENT-02"],\n  "status": "ASSIGNED"\n}' },
    { method: 'GET', path: '/api/dashboard/summary', desc: 'Fetch real-time dashboard state & vitals', respPayload: '{\n  "activeEmergencies": 24,\n  "patientsWaiting": 8,\n  "criticalCases": 3,\n  "hospitalsOnline": 5\n}' },
    { method: 'GET', path: '/api/alerts', desc: 'Fetch surge alerts and Twilio alert history', respPayload: '[\n  {\n    "id": "ALT-301",\n    "type": "SURGE",\n    "message": "Outbreak detected +3.1σ"\n  }\n]' }
  ];

  const dbSchema = [
    { table: 'patients / emergencies', columns: 'id, name, age, symptoms, vitals, esi_level, priority_score, arrival_time, status, required_resources, assigned_hospital_id' },
    { table: 'hospitals', columns: 'id, name, latitude, longitude, status' },
    { table: 'beds', columns: 'id, hospital_id, ward, type (ICU/GENERAL), status' },
    { table: 'doctors', columns: 'id, hospital_id, name, specialization, status' },
    { table: 'equipment', columns: 'id, hospital_id, type, status' },
    { table: 'allocation_log', columns: 'id, patient_id, hospital_id, bed_id, doctor_id, allocated_at, released_at' },
    { table: 'alerts', columns: 'id, type, message, sent_at, channel, status' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="glass-pill text-[var(--color-primary)] border-[var(--color-primary)]/30">
            Hackathon Build Blueprint
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">10-Day Plan & Tech Specs</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Project Architecture & Hackathon Blueprint
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Complete technical specification, 10-day execution roadmap, API contracts, PostgreSQL schema, and hackathon judge Q&A cheat sheet.
        </p>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[var(--border-glass)] pb-3 overflow-x-auto">
        {[
          { id: 'roadmap', label: '10-Day Execution Plan', icon: Calendar },
          { id: 'team', label: 'Team Roles & Judge Q&A', icon: Users },
          { id: 'api', label: 'API Contracts (REST)', icon: Code },
          { id: 'database', label: 'PostgreSQL DB Design', icon: Database },
          { id: 'architecture', label: 'System Architecture Flow', icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SubTab 1: 10-Day Execution Plan */}
      {subTab === 'roadmap' && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--color-primary)]" /> 10-Day Hackathon Roadmap Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmapDays.map((step, idx) => (
              <div 
                key={idx}
                className="glass-panel p-5 space-y-2 relative border-l-4 border-l-[var(--color-primary)] hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[var(--color-primary)] font-mono">{step.day}</span>
                  <span className="text-[10px] text-[var(--color-success)] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Step {idx + 1}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Team Roles & Judge Q&A Cheat Sheet */}
      {subTab === 'team' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Team Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-panel p-6 space-y-3 border-t-2 border-t-[var(--color-primary)]">
              <span className="glass-pill text-[var(--color-primary)] border-[var(--color-primary)]/30">
                You — Lead Backend
              </span>
              <h4 className="text-base font-bold text-white">Spring Boot & Priority Engine</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Spring Boot backend, PostgreSQL schema, ESI severity scoring, PriorityQueue max-heap, aging starvation prevention algorithm, Google Maps API integration, architecture & testing.
              </p>
            </div>

            <div className="glass-panel p-6 space-y-3 border-t-2 border-t-[var(--color-success)]">
              <span className="glass-pill text-[var(--color-success)] border-[var(--color-success)]/30">
                Trishti — Frontend Lead
              </span>
              <h4 className="text-base font-bold text-white">React & Real-Time Dashboard</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                React glassmorphic frontend, emergency queue UI, hospital capacity cards, allocation visualization, charts, real-time WebSocket/SSE updates, alerts UI.
              </p>
            </div>

            <div className="glass-panel p-6 space-y-3 border-t-2 border-t-[var(--color-purple)]">
              <span className="glass-pill text-[var(--color-purple)] border-[var(--color-purple)]/30">
                Person 3 — Anomaly & Alerts
              </span>
              <h4 className="text-base font-bold text-white">Surge Detection & Twilio</h4>
              <p className="text-xs text-[var(--text-secondary)]">
                15-min window arrival tracking, moving average / z-score anomaly detection, Twilio REST API SMS alerts, alert history logs, backend integration support.
              </p>
            </div>

          </div>

          {/* Hackathon Judge Q&A Cheat Sheet */}
          <div className="glass-panel p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[var(--color-warning)]" /> Hackathon Defense Q&A Cheat Sheet
            </h3>

            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-white/[0.02] border border-[var(--border-glass)] space-y-1.5">
                <span className="text-xs font-bold text-[var(--color-primary)]">Q: Why PriorityQueue / Max-Heap instead of static severity sorting?</span>
                <p className="text-xs text-[var(--text-secondary)]">
                  <strong>Answer:</strong> Static severity causes starvation: continuous high-severity arrivals could make a low-severity case wait forever. By calculating <code>Priority = (SeverityWeight × Severity) + (AgingWeight × WaitTime)</code>, every waiting patient continuously increases their score until they are served.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-[var(--border-glass)] space-y-1.5">
                <span className="text-xs font-bold text-[var(--color-success)]">Q: Why is the nearest hospital not always the best hospital?</span>
                <p className="text-xs text-[var(--text-secondary)]">
                  <strong>Answer:</strong> A nearby hospital (e.g. 3 km away) may lack free ICU beds, specialized doctors, or ventilators required for the patient. Our router executes a resource feasibility filter first before spending API queries on Google Maps ETA.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-[var(--border-glass)] space-y-1.5">
                <span className="text-xs font-bold text-[var(--color-purple)]">Q: How does anomaly surge detection work?</span>
                <p className="text-xs text-[var(--text-secondary)]">
                  <strong>Answer:</strong> Emergency arrivals are tracked in 15-minute sliding windows. We calculate the moving average baseline. If current arrivals exceed <code>Baseline + 2 × StdDev</code>, a surge alert is logged, published via SSE, and broadcasted via Twilio SMS.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SubTab 3: REST API Contracts */}
      {subTab === 'api' && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-[var(--color-primary)]" /> REST API Endpoints Contract
          </h3>

          <div className="space-y-4">
            {apiEndpoints.map((endpoint, idx) => (
              <div key={idx} className="glass-panel p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-extrabold font-mono ${
                      endpoint.method === 'POST' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">{endpoint.path}</span>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">{endpoint.desc}</span>
                </div>

                {endpoint.reqPayload && (
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono uppercase block mb-1">Request Payload:</span>
                    <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-[var(--color-primary)] overflow-x-auto">
                      {endpoint.reqPayload}
                    </pre>
                  </div>
                )}

                {endpoint.respPayload && (
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono uppercase block mb-1">Response Payload:</span>
                    <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-[var(--color-success)] overflow-x-auto">
                      {endpoint.respPayload}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: PostgreSQL Database Design */}
      {subTab === 'database' && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-[var(--color-primary)]" /> PostgreSQL Relational Database Schema
          </h3>

          <div className="glass-panel p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border-glass)] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="py-3 px-4">Table Name</th>
                  <th className="py-3 px-4">Columns & Schema Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-glass)] text-xs text-white">
                {dbSchema.map((tbl, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--color-primary)]">{tbl.table}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">{tbl.columns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 5: Architecture Flow Diagram */}
      {subTab === 'architecture' && (
        <div className="glass-panel p-6 sm:p-8 space-y-6 text-center animate-fade-in">
          <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
            <Layers className="w-5 h-5 text-[var(--color-primary)]" /> End-to-End Execution Sequence
          </h3>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-[var(--color-primary)] max-w-2xl mx-auto space-y-2 text-left">
            <div>POST /api/emergencies</div>
            <div className="text-[var(--text-muted)] pl-4">↓ Severity Scoring (ESI Level 1-5)</div>
            <div className="text-[var(--text-muted)] pl-4">↓ Priority Queue & Starvation Aging Score</div>
            <div className="text-[var(--text-muted)] pl-4">↓ Scheduler Inspection Loop</div>
            <div className="text-[var(--text-muted)] pl-4">↓ Resource Feasibility Check (Beds, Doctors)</div>
            <div className="text-[var(--text-muted)] pl-4">↓ Google Maps Distance / Travel ETA API</div>
            <div className="text-[var(--text-muted)] pl-4">↓ Optimal Hospital Resource Reservation</div>
            <div className="text-[var(--text-muted)] pl-4">↓ PostgreSQL Transactional Log</div>
            <div className="text-[var(--text-muted)] pl-4">↓ WebSocket / SSE Real-time Dashboard Update</div>
            <div className="text-[var(--color-purple)] pl-4">↓ Twilio Outbreak SMS Alert (if surge &gt; 2σ)</div>
          </div>
        </div>
      )}

    </div>
  );
};
