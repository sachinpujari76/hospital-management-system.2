import React, { useState } from 'react';
import { LabReport, LabCatalogItem, Doctor, Patient, LabPriority } from '../types/hospital';
import { X, FlaskConical, AlertCircle } from 'lucide-react';

interface OrderLabModalProps {
  catalog: LabCatalogItem[];
  doctors: Doctor[];
  patients: Patient[];
  onClose: () => void;
  onSubmit: (newOrder: LabReport) => void;
}

export const OrderLabModal: React.FC<OrderLabModalProps> = ({
  catalog,
  doctors,
  patients,
  onClose,
  onSubmit
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedCatalogId, setSelectedCatalogId] = useState(catalog[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [priority, setPriority] = useState<LabPriority>('Routine');
  const [clinicalNotes, setClinicalNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    const testItem = catalog.find(c => c.id === selectedCatalogId) || catalog[0];
    const doctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LAB-2026-${randomSuffix}`;
    const specimenBarcode = `BAR-990${randomSuffix}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Initial dummy parameters based on test for realistic demo workflow
    const initialParams = [
      {
        name: testItem.name,
        result: 'Pending Analysis',
        unit: 'std unit',
        normalRangeText: 'Reference pending specimen run',
        flag: 'NORMAL' as const,
        methodology: 'Automated Analyzer'
      }
    ];

    const newReport: LabReport = {
      id: `rep-${Date.now()}`,
      orderNumber,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientMrn: patient.mrn,
      doctorId: doctor.id,
      doctorName: doctor.name,
      testName: testItem.name,
      testCode: testItem.code,
      category: (testItem.category as any) || 'Biochemistry',
      specimenType: testItem.specimen,
      specimenBarcode,
      priority,
      status: 'Sample Received',
      orderedAt: now,
      collectedAt: now,
      pathologistName: 'Dr. Vincent Croft, MD, FCAP',
      pathologistLicense: 'CAP-LIC-882194',
      clinicalInterpretation: clinicalNotes || `Ordered for ${testItem.commonIndications}`,
      parameters: initialParams
    };

    onSubmit(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-slate-900">Order Diagnostic Pathology Test</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">Select Inpatient / Registered Subject</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              required
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrn} · {p.age}y · {p.gender} · {p.roomBed})
                </option>
              ))}
            </select>
          </div>

          {/* Test Catalog Selection */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">Diagnostic Test Panel</label>
            <select
              value={selectedCatalogId}
              onChange={(e) => setSelectedCatalogId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              required
            >
              {catalog.map(cat => (
                <option key={cat.id} value={cat.id}>
                  [{cat.code}] {cat.name} — {cat.category} (${cat.standardFee} · TAT: {cat.turnaroundTime})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ordering Physician */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Ordering Attending Doctor</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                required
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Clinical Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as LabPriority)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                <option value="Routine">Routine (Standard Queue)</option>
                <option value="Urgent">Urgent (Expedited 1-2 Hr)</option>
                <option value="STAT">STAT (Immediate Emergency Run &lt;30m)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">Clinical Indication & Specimen Directives</label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g., Acute chest pain workup, rule out NSTEMI, specimen drawn from left antecubital vein..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-[11px] text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              Specimen labels with high-density 2D barcodes will print automatically at phlebotomy accessioning station once order is confirmed.
            </span>
          </div>

          {/* Actions */}
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
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-xs"
            >
              Generate Order & Transmit to Lab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
