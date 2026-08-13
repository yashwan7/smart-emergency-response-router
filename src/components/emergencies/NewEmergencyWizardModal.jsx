import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { EsiBadge } from '../common/EsiBadge';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Stethoscope, Heart, Activity, User, MapPin } from 'lucide-react';

export const NewEmergencyWizardModal = () => {
  const { 
    isNewEmergencyModalOpen, 
    setIsNewEmergencyModalOpen, 
    addEmergency,
    severityWeight 
  } = useSimulation();

  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: 45,
    gender: 'Male',
    location: 'Central Square (4.2 km)',
    symptoms: ['Chest Pain'],
    heartRate: 120,
    spo2: 88,
    bloodPressure: '130/85',
    requiredResources: ['ICU', 'Cardiologist'],
    esiLevel: 1
  });

  if (!isNewEmergencyModalOpen) return null;

  const handleNext = () => setStep(prev => Math.min(4, prev + 1));
  const handlePrev = () => setStep(prev => Math.max(1, prev - 1));

  const calculateEsiLevel = () => {
    // ESI level logic based on vitals and symptoms
    if (formData.spo2 < 85 || formData.symptoms.includes('Cardiac Arrest') || formData.heartRate > 140) {
      return 1; // Level 1 Resuscitation
    }
    if (formData.spo2 < 92 || formData.symptoms.includes('Chest Pain') || formData.symptoms.includes('Severe Head Trauma')) {
      return 2; // Level 2 Emergent
    }
    if (formData.symptoms.includes('Open Fracture')) {
      return 3; // Level 3 Urgent
    }
    if (formData.symptoms.includes('High Fever')) {
      return 4; // Level 4
    }
    return 5; // Level 5
  };

  const calculatedEsi = calculateEsiLevel();
  const calculatedPriority = parseFloat(((6 - calculatedEsi) * severityWeight).toFixed(1));

  const handleSubmit = (e) => {
    e.preventDefault();
    addEmergency({
      ...formData,
      esiLevel: calculatedEsi,
      priorityScore: calculatedPriority,
      vitals: {
        heartRate: Number(formData.heartRate),
        spo2: Number(formData.spo2),
        bloodPressure: formData.bloodPressure
      }
    });

    setIsNewEmergencyModalOpen(false);
    setStep(1);
    setFormData({
      name: '',
      age: 45,
      gender: 'Male',
      location: 'Central Square (4.2 km)',
      symptoms: ['Chest Pain'],
      heartRate: 120,
      spo2: 88,
      bloodPressure: '130/85',
      requiredResources: ['ICU', 'Cardiologist'],
      esiLevel: 1
    });
  };

  const toggleSymptom = (sym) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(sym)
        ? prev.symptoms.filter(s => s !== sym)
        : [...prev.symptoms, sym]
    }));
  };

  const toggleResource = (res) => {
    setFormData(prev => ({
      ...prev,
      requiredResources: prev.requiredResources.includes(res)
        ? prev.requiredResources.filter(r => r !== res)
        : [...prev.requiredResources, res]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8 relative overflow-hidden max-h-[92vh] flex flex-col justify-between">
        
        <div>
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                REGISTER NEW EMERGENCY CASE
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-step deterministic ESI triage wizard
              </p>
            </div>

            <button
              onClick={() => setIsNewEmergencyModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wizard Progress Steps Indicator */}
          <div className="flex items-center justify-between mb-6 px-1 sm:px-2 overflow-x-auto no-scrollbar">
            {['Patient', 'Vitals', 'Resources', 'Review'].map((label, idx) => {
              const stepNum = idx + 1;
              const isDone = step > stepNum;
              const isCurrent = step === stepNum;

              return (
                <div key={idx} className="flex items-center gap-1.5 shrink-0">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs transition-colors ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : isCurrent 
                      ? 'bg-rose-600 text-white ring-2 sm:ring-4 ring-rose-100 dark:ring-rose-950' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : stepNum}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold ${
                    isCurrent ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-400'
                  }`}>
                    {label}
                  </span>
                  {idx < 3 && <div className="w-3 sm:w-8 h-0.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-0.5 sm:mx-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body - STEP 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Incident Location / GPS
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              />
            </div>
          </div>
        )}

        {/* Form Body - STEP 2 */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Primary Symptoms (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Chest Pain', 'Breathing Difficulty', 'Severe Head Trauma', 'Open Fracture', 'High Fever', 'Cardiac Arrest', 'Dizziness'].map((sym) => {
                  const isSelected = formData.symptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'bg-rose-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Body - STEP 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Required Medical Resources
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              {['ICU', 'Ventilator', 'Cardiologist', 'General Bed', 'Trauma Surgeon', 'Neurologist'].map((res) => {
                const isSelected = formData.requiredResources.includes(res);
                return (
                  <button
                    type="button"
                    key={res}
                    onClick={() => toggleResource(res)}
                    className={`p-3 rounded-2xl border text-left font-semibold text-xs transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-500/20' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{res}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form Body - STEP 4 (Review) */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Calculated ESI Level</div>
                  <div className="mt-1">
                    <EsiBadge level={calculatedEsi} showName size="lg" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Priority Score</div>
                  <div className="text-2xl font-black font-mono text-amber-400 my-0.5">
                    {calculatedPriority}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div>Patient: <strong className="text-white">{formData.name || 'Anonymous'}</strong> ({formData.age} yrs · {formData.gender})</div>
                <div>Location: <strong className="text-white">{formData.location}</strong></div>
                <div>Required: <strong className="text-white">{formData.requiredResources.join(', ')}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Emergency</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
