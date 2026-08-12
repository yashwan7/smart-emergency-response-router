import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { X, PlusCircle, Activity, ShieldAlert, Heart, Stethoscope } from 'lucide-react';

export const NewEmergencyModal = ({ isOpen, onClose }) => {
  const { addEmergency } = useSimulation();

  const [name, setName] = useState('Patient Case ' + Math.floor(Math.random() * 800 + 100));
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState('Male');
  const [esiLevel, setEsiLevel] = useState(2);
  const [symptoms, setSymptoms] = useState('Severe Chest Pain, Shortness of Breath');
  const [heartRate, setHeartRate] = useState(130);
  const [spo2, setSpo2] = useState(88);
  const [bloodPressure, setBloodPressure] = useState('90/60');
  const [reqResources, setReqResources] = useState(['ICU', 'Cardiology']);
  const [location, setLocation] = useState('Central Highway KM 12');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addEmergency({
      name,
      age: Number(age),
      gender,
      esiLevel: Number(esiLevel),
      symptoms: symptoms.split(',').map(s => s.trim()).filter(Boolean),
      vitals: {
        heartRate: Number(heartRate),
        spo2: Number(spo2),
        bloodPressure
      },
      requiredResources: reqResources,
      location
    });

    onClose();
  };

  const toggleResource = (res) => {
    if (reqResources.includes(res)) {
      setReqResources(reqResources.filter(r => r !== res));
    } else {
      setReqResources([...reqResources, res]);
    }
  };

  const availableResourceOptions = ['ICU', 'VENTILATOR', 'General Bed', 'Cardiology', 'Neurology', 'Orthopedics', 'Trauma'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-8 space-y-6 relative border-t-2 border-t-[var(--color-primary)] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Simulate New Emergency Case</h3>
              <p className="text-xs text-[var(--text-secondary)]">Inject patient case into the Aging Priority Queue</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[var(--text-secondary)] font-semibold mb-1">Patient Name / Identifier</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-black/40 border border-[var(--border-glass)] text-white focus:border-[var(--color-primary)] outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] font-semibold mb-1">Age & Gender</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-16 p-2.5 rounded-lg bg-black/40 border border-[var(--border-glass)] text-white focus:border-[var(--color-primary)] outline-none font-mono"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex-1 p-2.5 rounded-lg bg-black/40 border border-[var(--border-glass)] text-white focus:border-[var(--color-primary)] outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* ESI Level Radio Grid */}
          <div>
            <label className="block text-[var(--text-secondary)] font-semibold mb-1.5">ESI Severity Level (1 to 5)</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setEsiLevel(lvl)}
                  className={`p-2.5 rounded-xl font-bold text-center transition-all ${
                    esiLevel === lvl 
                      ? 'bg-[var(--color-primary)] text-black font-extrabold shadow-[0_0_15px_rgba(0,242,254,0.3)]' 
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  Level {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-[var(--text-secondary)] font-semibold mb-1">Symptoms (Comma Separated)</label>
            <input
              type="text"
              required
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-black/40 border border-[var(--border-glass)] text-white focus:border-[var(--color-primary)] outline-none"
            />
          </div>

          {/* Vitals Inputs */}
          <div>
            <label className="block text-[var(--text-secondary)] font-semibold mb-1">Patient Vitals</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Heart Rate (bpm)</span>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/40 border border-[var(--border-glass)] text-white font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">SpO2 (%)</span>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/40 border border-[var(--border-glass)] text-white font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Blood Pressure</span>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/40 border border-[var(--border-glass)] text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Required Resources Multi Select */}
          <div>
            <label className="block text-[var(--text-secondary)] font-semibold mb-1">Required Hospital Resources</label>
            <div className="flex flex-wrap gap-1.5">
              {availableResourceOptions.map((res) => {
                const selected = reqResources.includes(res);
                return (
                  <button
                    type="button"
                    key={res}
                    onClick={() => toggleResource(res)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      selected 
                        ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/40' 
                        : 'bg-white/5 text-[var(--text-muted)] hover:bg-white/10'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{res}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[var(--text-secondary)] font-semibold mb-1">Patient Location / GPS Coordinates</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-black/40 border border-[var(--border-glass)] text-white focus:border-[var(--color-primary)] outline-none font-mono"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-glass text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs font-bold px-6 py-2.5"
            >
              Submit Emergency Case
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
