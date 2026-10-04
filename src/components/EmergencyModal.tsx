import React, { useState } from 'react';
import { Ambulance, X, AlertTriangle, Radio, CheckCircle2, PhoneCall } from 'lucide-react';

interface EmergencyModalProps {
  onClose: () => void;
  onDispatchSuccess: (incidentDetails: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  onClose,
  onDispatchSuccess
}) => {
  const [incidentType, setIncidentType] = useState('Severe Polytrauma (MVA)');
  const [location, setLocation] = useState('Highway 101, Mile Marker 42');
  const [patientCount, setPatientCount] = useState(2);
  const [priorityCode, setPriorityCode] = useState('Code Red (Level 1 Trauma)');
  const [isDispatched, setIsDispatched] = useState(false);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatched(true);
    setTimeout(() => {
      onDispatchSuccess(`${priorityCode}: ${incidentType} at ${location} (${patientCount} casualties)`);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-rose-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ambulance className="w-5 h-5 animate-bounce" />
            <h3 className="font-bold text-sm tracking-wide">Emergency Trauma & Mobile Dispatch</h3>
          </div>
          <button onClick={onClose} className="text-rose-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDispatched ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Mobile Intensive Care Unit Dispatched</h4>
            <p className="text-xs text-slate-600">
              Paramedic Team Unit 4 en route. Resuscitation Bay 1 & Trauma OR alerted for immediate incoming arrival.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Trauma Severity Code</label>
              <select
                value={priorityCode}
                onChange={(e) => setPriorityCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
              >
                <option value="Code Red (Level 1 Trauma)">Code Red — Immediate Life Threat (Level 1 Trauma)</option>
                <option value="Code Blue (Cardiac Arrest)">Code Blue — Cardiopulmonary Resuscitation</option>
                <option value="Code Yellow (High Acuity Stroke)">Code Yellow — Acute Neurovascular / Stroke Window</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Incident Classification</label>
              <input
                type="text"
                required
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Incident Site / GPS</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Casualty Count</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={patientCount}
                  onChange={(e) => setPatientCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg text-amber-900 text-[11px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Dispatching will mobilize Rapid Response Unit #4, reserve blood bank O- negative units, and set Trauma Bay on high standby.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Confirm Emergency Dispatch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
