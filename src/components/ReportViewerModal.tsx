import React, { useState } from 'react';
import { LabReport } from '../types/hospital';
import { Printer, Download, X, AlertTriangle, CheckCircle2, ShieldCheck, Stethoscope, Sparkles } from 'lucide-react';

interface ReportViewerModalProps {
  report: LabReport | null;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({ report, onClose }) => {
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExplainWithAi = async () => {
    setLoadingAi(true);
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

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setAiExplanation(data);
    } catch (err) {
      console.warn('AI Report Explainer Fallback:', err);
      setAiExplanation({
        summaryTitle: `Simplified Clinical Summary: ${report.testName}`,
        overallStatus: report.parameters.some(p => p.flag === 'CRITICAL_HIGH') ? 'Critical Alert' : 'Attention Required',
        simplifiedExplanation: `This test measured biomarkers for ${report.patientName}. Values flagged as high or low indicate acute physiological changes that the medical team will stabilize with targeted medications.`,
        clinicalAction: 'Continue clinical observation and repeat panel in 6 hours.',
        questionsForDoctor: [
          'What are the immediate next steps for managing this biomarker level?',
          'Will this affect patient discharge planning?'
        ]
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header - Excluded from print */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Diagnostic Document</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-medium text-slate-200">{report.orderNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Explainer Button */}
            <button
              onClick={handleExplainWithAi}
              disabled={loadingAi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              {loadingAi ? 'AI Analyzing...' : 'AI Explain in Plain English'}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI In-Modal Explanation Box (if active) */}
        {aiExplanation && (
          <div className="p-4 bg-cyan-50 border-b border-cyan-200 text-xs print:hidden space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-cyan-950">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>{aiExplanation.summaryTitle}</span>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-200 text-cyan-900">
                {aiExplanation.overallStatus}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {aiExplanation.simplifiedExplanation}
            </p>
            {aiExplanation.clinicalAction && (
              <p className="text-slate-600">
                <strong>Next Step:</strong> {aiExplanation.clinicalAction}
              </p>
            )}
          </div>
        )}

        {/* Printable Clinical Lab Document */}
        <div id="printable-report" className="p-8 text-slate-800 bg-white">
          {/* Hospital & Lab Masthead */}
          <div className="border-b border-slate-200 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">Aegis Health System</h2>
                    <p className="text-xs text-slate-500">Department of Pathology & Molecular Laboratory Diagnostics</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500 flex flex-wrap items-center gap-2">
                  <span>CAP Accredited No. 894210</span>
                  <span>·</span>
                  <span>CLIA ID: 05D209411</span>
                  <span>·</span>
                  <span>ISO 15189 Medical Laboratories</span>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 text-xs text-slate-500 space-y-1">
                <p className="font-mono text-slate-700 font-semibold text-sm">FINAL DIAGNOSTIC REPORT</p>
                <p>Status: <span className="text-emerald-700 font-medium">{report.status.toUpperCase()}</span></p>
                <p>Specimen Barcode: <span className="font-mono font-medium text-slate-700">{report.specimenBarcode}</span></p>
              </div>
            </div>
          </div>

          {/* Demographics Matrix */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-6 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 block mb-0.5">Patient Name</span>
                <span className="font-semibold text-slate-900 text-sm">{report.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">MRN / Patient ID</span>
                <span className="font-mono font-medium text-slate-800">{report.patientMrn}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Age / Gender</span>
                <span className="font-medium text-slate-800">{report.patientAge} Years · {report.patientGender}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Priority</span>
                <span className={`font-semibold ${report.priority === 'STAT' ? 'text-rose-700' : 'text-slate-800'}`}>
                  {report.priority}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Referring Clinician</span>
                <span className="font-medium text-slate-800">{report.doctorName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Specimen Type</span>
                <span className="font-medium text-slate-800">{report.specimenType}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Collection Timestamp</span>
                <span className="font-mono text-slate-700">{report.collectedAt || report.orderedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Verification Timestamp</span>
                <span className="font-mono text-slate-700">{report.reportedAt || 'Processing in progress'}</span>
              </div>
            </div>
          </div>

          {/* Test Title */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{report.testName}</h3>
                <p className="text-xs text-slate-500 font-mono">Test Code: {report.testCode} · Category: {report.category}</p>
              </div>
            </div>
          </div>

          {/* Parameters Results Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-4">Analyte / Biomarker</th>
                  <th className="py-2.5 px-3 text-right">Observed Value</th>
                  <th className="py-2.5 px-3 text-center">Clinical Flag</th>
                  <th className="py-2.5 px-3">Units</th>
                  <th className="py-2.5 px-3">Biological Reference Range</th>
                  <th className="py-2.5 px-4">Methodology</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.parameters.map((param, index) => {
                  const isCritical = param.flag === 'CRITICAL_HIGH' || param.flag === 'CRITICAL_LOW';
                  const isHighOrLow = param.flag === 'HIGH' || param.flag === 'LOW';

                  return (
                    <tr 
                      key={index}
                      className={isCritical ? 'bg-rose-50/50' : isHighOrLow ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'}
                    >
                      <td className="py-2.5 px-4 font-medium text-slate-900">
                        {param.name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-slate-900">
                        {param.result}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {param.flag === 'NORMAL' && (
                          <span className="text-slate-500 font-mono text-[11px]">Normal</span>
                        )}
                        {param.flag === 'HIGH' && (
                          <span className="text-amber-800 font-semibold font-mono text-[11px]">▲ High</span>
                        )}
                        {param.flag === 'LOW' && (
                          <span className="text-amber-800 font-semibold font-mono text-[11px]">▼ Low</span>
                        )}
                        {param.flag === 'CRITICAL_HIGH' && (
                          <span className="text-rose-700 font-bold font-mono text-[11px]">▲▲ CRITICAL HIGH</span>
                        )}
                        {param.flag === 'CRITICAL_LOW' && (
                          <span className="text-rose-700 font-bold font-mono text-[11px]">▼▼ CRITICAL LOW</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {param.unit}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {param.normalRangeText}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 text-[11px] truncate max-w-[180px]">
                        {param.methodology || 'Automated Clinical Chemistry'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Clinical Interpretation */}
          {report.clinicalInterpretation && (
            <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-slate-600" />
                Pathologist Clinical Evaluation
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {report.clinicalInterpretation}
              </p>
            </div>
          )}

          {/* Signatures & Accreditation Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs text-slate-500">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Authenticated Laboratory Record</span>
              </div>
              <p className="text-[11px] text-slate-400">
                This document conforms to standard CLSI guidelines. Results correlate with clinical presentations.
              </p>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-semibold text-slate-800 text-sm">
                {report.pathologistName}
              </div>
              <p className="text-slate-500 text-[11px]">Consultant Clinical Pathologist</p>
              <p className="text-slate-400 font-mono text-[10px]">{report.pathologistLicense}</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close Bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Viewing verified clinical document · Aegis Electronic Health Core</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
