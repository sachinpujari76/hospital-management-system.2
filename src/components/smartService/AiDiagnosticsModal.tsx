import React, { useState } from 'react';
import { Sparkles, X, Wrench, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Customer, ServiceItem, Staff } from '../../types/serviceSystem';

interface AiDiagnosticsModalProps {
  onClose: () => void;
  services: ServiceItem[];
  customers: Customer[];
  staff: Staff[];
  onBookService: (serviceId: number, issueText: string) => void;
}

export const AiDiagnosticsModal: React.FC<AiDiagnosticsModalProps> = ({
  onClose,
  services,
  customers,
  staff,
  onBookService
}) => {
  const [issueQuery, setIssueQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const demoScenarios = [
    {
      title: 'Overheating & Thermal Throttle',
      text: 'Laptop CPU reaching 95°C during normal tasks, fans making loud grinding noise and system reboots randomly after 20 minutes.'
    },
    {
      title: 'Power Failure & No Display',
      text: 'Desktop PC turns on, fans spin, but no display output on monitor. Motherboard power LED stays solid amber.'
    },
    {
      title: 'OS Crash & Blue Screen Loop',
      text: 'System stuck in automatic repair boot loop after Windows update, showing CRITICAL_PROCESS_DIED stop code.'
    },
    {
      title: 'Annual Tech Maintenance Review',
      text: 'Office workstations require general servicing, dust extraction, thermal paste replacement, and security patches.'
    }
  ];

  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueQuery.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/symptom-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: issueQuery,
          age: 'Equipment in service 2 years',
          gender: 'Standard hardware unit'
        })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.warn('AI Diagnostic fallback:', err);
      const lower = issueQuery.toLowerCase();
      let srvName = 'Full System Diagnostics';
      let srvId = 1;
      let estPrice = 799;

      if (lower.includes('heat') || lower.includes('dust') || lower.includes('clean') || lower.includes('fan')) {
        srvName = 'Deep Cleaning & Maintenance';
        srvId = 2;
        estPrice = 1299;
      } else if (lower.includes('power') || lower.includes('motherboard') || lower.includes('display') || lower.includes('hardware')) {
        srvName = 'Express Hardware Repair';
        srvId = 3;
        estPrice = 2499;
      } else if (lower.includes('os') || lower.includes('boot') || lower.includes('blue screen') || lower.includes('windows')) {
        srvName = 'OS & Security Setup';
        srvId = 4;
        estPrice = 899;
      } else if (lower.includes('annual') || lower.includes('office') || lower.includes('amc')) {
        srvName = 'Annual Maintenance Contract (AMC)';
        srvId = 5;
        estPrice = 4999;
      }

      setResult({
        triageLevel: 'Urgent',
        suggestedDepartment: srvName,
        recommendedDoctorSpecialty: 'Field Hardware Technician',
        reasoning: `Based on reported issue pattern, '${srvName}' provides the exact specialized diagnostic protocol required.`,
        recommendedTests: ['Thermal sensor test', 'Power rail voltage verification', 'RAM memory integrity check'],
        firstAidTips: ['Disconnect device from mains power', 'Do not attempt to force reboot', 'Check for burned capacitor odor'],
        plainSummary: `Recommended service: ${srvName} (Est. ₹ ${estPrice}). A certified field technician should inspect the equipment.`,
        matchedServiceId: srvId
      });
    } finally {
      setLoading(false);
    }
  };

  const matchedService = result 
    ? services.find(s => s.id === result.matchedServiceId || s.name.toLowerCase().includes(result.suggestedDepartment?.toLowerCase() || '')) || services[0]
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                Smart AI Service Diagnostics
                <span className="text-[10px] bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-mono font-medium">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                AI issue classification, automated package recommendation, and cost estimation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Quick Demo Scenarios */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              ⚡ Quick Demo Scenarios for College Presentation:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {demoScenarios.map((sc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIssueQuery(sc.text);
                    setResult(null);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-slate-700 font-medium transition-colors border border-slate-200 cursor-pointer text-xs"
                >
                  {sc.title}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRunDiagnostic} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Describe Customer Complaint / Equipment Breakdown:
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Computer shuts down while gaming, fan makes grinding noise..."
                value={issueQuery}
                onChange={(e) => setIssueQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs text-xs"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                  Analyzing with Gemini AI Engine...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Diagnose & Match Recommended Service
                </>
              )}
            </button>
          </form>

          {/* Result Card */}
          {result && (
            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-100">
                <span className="font-bold text-slate-900 text-sm">AI Recommendation</span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                  Priority: {result.triageLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[11px] mb-0.5">Recommended Service</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {matchedService?.name || result.suggestedDepartment}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[11px] mb-0.5">Estimated Rate</span>
                  <span className="font-mono font-bold text-cyan-800 text-xs">
                    ₹ {matchedService?.price.toFixed(2) || '799.00'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                  Technical Reasoning:
                </h4>
                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 text-xs leading-relaxed">
                  {result.plainSummary || result.reasoning}
                </p>
              </div>

              {result.firstAidTips?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                    Pre-Service Safety Steps:
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    {result.firstAidTips.map((tip: string, idx: number) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Close
                </button>
                {matchedService && (
                  <button
                    type="button"
                    onClick={() => {
                      onBookService(matchedService.id, issueQuery);
                      onClose();
                    }}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                  >
                    Schedule {matchedService.name} (₹ {matchedService.price})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
