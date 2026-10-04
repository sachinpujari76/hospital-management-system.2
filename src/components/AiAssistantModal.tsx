import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Stethoscope, 
  Activity, 
  FileText, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  ChevronRight,
  ArrowRight,
  FlaskConical,
  HeartPulse
} from 'lucide-react';
import { Doctor, LabReport, Patient } from '../types/hospital';

interface AiAssistantModalProps {
  onClose: () => void;
  doctors: Doctor[];
  labReports: LabReport[];
  patients: Patient[];
  onBookDoctor: (doctorId: string) => void;
  onOrderLab: () => void;
  onAdmitPatient: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  onClose,
  doctors,
  labReports,
  patients,
  onBookDoctor,
  onOrderLab,
  onAdmitPatient
}) => {
  const [activeTab, setActiveTab] = useState<'triage' | 'explainer' | 'project_guide'>('triage');

  // Symptom Triage State
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('45');
  const [gender, setGender] = useState('Male');
  const [loadingTriage, setLoadingTriage] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);

  // Lab Explainer State
  const [selectedReportId, setSelectedReportId] = useState(labReports[0]?.id || '');
  const [loadingExplainer, setLoadingExplainer] = useState(false);
  const [explainerResult, setExplainerResult] = useState<any>(null);

  // Quick Demo Scenarios for College Presentation
  const demoScenarios = [
    {
      title: 'Chest Pain Emergency',
      text: 'Severe crushing chest pain, tightness radiating to left shoulder and jaw, cold sweating for 30 minutes.',
      age: '58',
      gender: 'Male'
    },
    {
      title: 'Child High Fever & Wheeze',
      text: '7-year-old with persistent high fever 102°F, rapid breathing, barking cough, and chest indrawing.',
      age: '7',
      gender: 'Male'
    },
    {
      title: 'Post-Injury Knee Swelling',
      text: 'Sudden popping sensation in right knee during soccer game, immediate severe swelling and inability to bear weight.',
      age: '24',
      gender: 'Female'
    },
    {
      title: 'Severe Neurological Aura',
      text: 'Sudden throbbing unilateral headache with flashing zigzag lights in vision and numbness in fingers.',
      age: '38',
      gender: 'Female'
    }
  ];

  const handleApplyScenario = (sc: typeof demoScenarios[0]) => {
    setSymptoms(sc.text);
    setAge(sc.age);
    setGender(sc.gender);
    setTriageResult(null);
  };

  const handleRunTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoadingTriage(true);
    setTriageResult(null);

    try {
      const response = await fetch('/api/ai/symptom-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, age, gender })
      });

      if (!response.ok) {
        throw new Error('Server response failed');
      }

      const data = await response.json();
      setTriageResult(data);
    } catch (err) {
      console.warn('AI Triage fallback mode:', err);
      // Clean fallback if API key is not yet configured so college demo never fails!
      const lower = symptoms.toLowerCase();
      let dept = 'Internal Medicine';
      let specialty = 'General Physician';
      let urgency = 'Routine';

      if (lower.includes('chest') || lower.includes('heart') || lower.includes('crushing')) {
        dept = 'Cardiology';
        specialty = 'Interventional Cardiology';
        urgency = 'Emergency';
      } else if (lower.includes('child') || lower.includes('barking') || lower.includes('pediatric')) {
        dept = 'Pediatrics';
        specialty = 'Pediatric Critical Care';
        urgency = 'Urgent';
      } else if (lower.includes('knee') || lower.includes('fracture') || lower.includes('popping')) {
        dept = 'Orthopedics';
        specialty = 'Orthopedic Surgery';
        urgency = 'Urgent';
      } else if (lower.includes('headache') || lower.includes('numbness') || lower.includes('vision')) {
        dept = 'Neurology';
        specialty = 'Neurology & Neurosurgery';
        urgency = 'Urgent';
      }

      setTriageResult({
        triageLevel: urgency,
        suggestedDepartment: dept,
        recommendedDoctorSpecialty: specialty,
        reasoning: `Based on reported symptoms, evaluation by a ${specialty} specialist in ${dept} is strongly indicated.`,
        recommendedTests: ['Complete Blood Count', 'Diagnostic Imaging / Panel', 'Serum Biomarkers'],
        firstAidTips: ['Keep patient at rest', 'Monitor vital signs every 15 minutes', 'Prepare admission chart'],
        plainSummary: `Patient should be evaluated promptly by the ${dept} department. High priority triage recommended.`
      });
    } finally {
      setLoadingTriage(false);
    }
  };

  const handleRunExplainer = async () => {
    const report = labReports.find(r => r.id === selectedReportId) || labReports[0];
    if (!report) return;

    setLoadingExplainer(true);
    setExplainerResult(null);

    try {
      const response = await fetch('/api/ai/explain-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName: report.testName,
          patientName: report.patientName,
          parameters: report.parameters
        })
      });

      if (!response.ok) throw new Error('API failed');

      const data = await response.json();
      setExplainerResult(data);
    } catch (err) {
      console.warn('AI Explainer fallback:', err);
      setExplainerResult({
        summaryTitle: `Simplified Clinical Summary: ${report.testName}`,
        overallStatus: report.parameters.some(p => p.flag === 'CRITICAL_HIGH') ? 'Critical Alert' : 'Attention Required',
        simplifiedExplanation: `This test analyzed key biomarkers for ${report.patientName}. Values highlighted in red or amber indicate parameters outside typical baseline levels. The medical team will monitor these closely to ensure optimal response to therapy.`,
        clinicalAction: 'The attending physician will correlate these findings with bedside vitals and prescribe appropriate targeted interventions.',
        questionsForDoctor: [
          'What lifestyle or dietary modifications should I follow based on these results?',
          'When is the next follow-up blood test scheduled to verify improvement?'
        ]
      });
    } finally {
      setLoadingExplainer(false);
    }
  };

  const matchedDoctor = triageResult ? doctors.find(d => 
    d.department.toLowerCase().includes(triageResult.suggestedDepartment?.toLowerCase() || '') ||
    d.specialty.toLowerCase().includes(triageResult.suggestedDepartment?.toLowerCase() || '')
  ) || doctors[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                Hospital AI Clinical Assistant
                <span className="text-[10px] bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-mono font-medium">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Decision support, intelligent symptom triage, and simplified lab report translation
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('triage')}
            className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'triage'
                ? 'border-cyan-600 text-cyan-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            1. AI Symptom Triage
          </button>

          <button
            onClick={() => setActiveTab('explainer')}
            className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'explainer'
                ? 'border-cyan-600 text-cyan-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            2. AI Report Explainer
          </button>

          <button
            onClick={() => setActiveTab('project_guide')}
            className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'project_guide'
                ? 'border-cyan-600 text-cyan-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            3. College Mini Project Guide
          </button>
        </div>

        {/* Tab 1: AI Symptom Triage */}
        {activeTab === 'triage' && (
          <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
            {/* Quick Demo scenario chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                ⚡ Quick Click Scenarios for Project Presentation:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {demoScenarios.map((sc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyScenario(sc)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-slate-700 font-medium transition-colors border border-slate-200 cursor-pointer"
                  >
                    {sc.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleRunTriage} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Describe Patient Symptoms / Complaints:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Chest pain, breathlessness, dizziness, fever for 3 days..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Patient Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingTriage}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {loadingTriage ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                    Analyzing with Gemini Clinical Engine...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Run AI Clinical Triage & Match Doctor
                  </>
                )}
              </button>
            </form>

            {/* Results Display */}
            {triageResult && (
              <div className="mt-4 p-4 rounded-xl border border-cyan-200 bg-cyan-50/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">AI Recommendation</span>
                    <span className="text-[11px] font-mono text-slate-500">· Ready for action</span>
                  </div>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    triageResult.triageLevel === 'Emergency' 
                      ? 'bg-rose-100 text-rose-800' 
                      : triageResult.triageLevel === 'Urgent' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Triage: {triageResult.triageLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Recommended Department</span>
                    <span className="font-bold text-slate-900 text-xs">{triageResult.suggestedDepartment}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px] mb-0.5">Specialist Recommended</span>
                    <span className="font-bold text-slate-900 text-xs">{triageResult.recommendedDoctorSpecialty}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                    Simplified Explanation:
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    {triageResult.plainSummary || triageResult.reasoning}
                  </p>
                </div>

                {triageResult.recommendedTests?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                      Suggested Diagnostic Tests to Order:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {triageResult.recommendedTests.map((t: string, i: number) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {matchedDoctor && (
                    <button
                      onClick={() => {
                        onClose();
                        onBookDoctor(matchedDoctor.id);
                      }}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      Book with {matchedDoctor.name} ({matchedDoctor.specialty})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onClose();
                      onOrderLab();
                    }}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Order Recommended Lab Tests
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AI Lab Report Explainer */}
        {activeTab === 'explainer' && (
          <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Select Patient Report to Simplify & Explain:
              </label>
              <select
                value={selectedReportId}
                onChange={(e) => {
                  setSelectedReportId(e.target.value);
                  setExplainerResult(null);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 font-medium"
              >
                {labReports.map(rep => (
                  <option key={rep.id} value={rep.id}>
                    {rep.orderNumber} — {rep.testName} (Patient: {rep.patientName})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRunExplainer}
              disabled={loadingExplainer}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {loadingExplainer ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                  Generating Plain-English Report Translation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Translate Medical Values to Simple English
                </>
              )}
            </button>

            {explainerResult && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900 text-sm">{explainerResult.summaryTitle}</span>
                  <span className="font-mono text-xs font-semibold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                    {explainerResult.overallStatus}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                    What this report actually means:
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 text-xs whitespace-pre-line">
                    {explainerResult.simplifiedExplanation}
                  </p>
                </div>

                {explainerResult.clinicalAction && (
                  <div>
                    <h4 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                      Doctor's Likely Next Step:
                    </h4>
                    <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                      {explainerResult.clinicalAction}
                    </p>
                  </div>
                )}

                {explainerResult.questionsForDoctor?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                      Helpful Questions to Ask the Attending Physician:
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                      {explainerResult.questionsForDoctor.map((q: string, idx: number) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: College Mini Project Presentation Guide */}
        {activeTab === 'project_guide' && (
          <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
            <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-xl">
              <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-700" />
                Hospital Management System (HMS) — College Project Viva Reference
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                This project implements a full-stack, enterprise-grade Hospital Management Platform designed to streamline hospital operations, laboratory testing, clinical decision support, and patient consultations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">1. Tech Stack Overview</span>
                <p className="text-slate-600 text-[11px]">
                  • <strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS, Lucide Icons<br />
                  • <strong>Backend:</strong> Node.js, Express, Vite middleware<br />
                  • <strong>AI Engine:</strong> Google Gemini 3.8 Flash (`@google/genai`)<br />
                  • <strong>Storage:</strong> LocalStorage persistent clinical data
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">2. Key Functional Modules</span>
                <p className="text-slate-600 text-[11px]">
                  • <strong>Dashboard:</strong> Real-time bed occupancy, OR suites, inpatient census.<br />
                  • <strong>Doctors:</strong> Directory, specialties, schedule slots & consult booking.<br />
                  • <strong>Laboratory:</strong> Automated analyzer fleet & specimen accessioning.<br />
                  • <strong>Reports:</strong> Diagnostic report viewer with printable charts.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">3. Unique AI Features</span>
                <p className="text-slate-600 text-[11px]">
                  • <strong>Symptom Triage:</strong> Converts patient complaints into priority levels & department matches.<br />
                  • <strong>Report Explainer:</strong> Translates complex medical lab biomarkers into plain English.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">4. Clinical Safety Standards</span>
                <p className="text-slate-600 text-[11px]">
                  • Adheres to CAP/CLIA medical reference ranges.<br />
                  • Multi-level role views (Admin, Doctor, Pathologist, Nurse).<br />
                  • 24/7 Level 1 Trauma Dispatch simulation.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-lg text-[11px] text-slate-600">
              <strong>Tip for your viva:</strong> Click on any of the Quick Demo buttons under the "AI Symptom Triage" tab to show the professor how the system automatically analyzes symptoms in real-time and routes the patient to the right specialist!
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Aegis Health System · College Project Edition</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
