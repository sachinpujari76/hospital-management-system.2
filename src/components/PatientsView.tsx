import React, { useState } from 'react';
import { Patient, Doctor } from '../types/hospital';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  HeartPulse, 
  Bed, 
  UserCheck, 
  Phone, 
  FileText, 
  Trash2, 
  Eye, 
  AlertCircle,
  X,
  Stethoscope,
  Calendar,
  Sparkles
} from 'lucide-react';

interface PatientsViewProps {
  patients: Patient[];
  doctors: Doctor[];
  onOpenAdmit: () => void;
  onDeletePatient: (id: string) => void;
  onOpenAiAssistant?: () => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  doctors,
  onOpenAdmit,
  onDeletePatient,
  onOpenAiAssistant
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [activePatientDetail, setActivePatientDetail] = useState<Patient | null>(null);

  const departments = ['all', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Intensive Care (ICU)', 'Trauma'];
  const conditions = ['all', 'Stable', 'Critical', 'Guarded', 'Recovering'];

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      p.attendingDoctorName.toLowerCase().includes(search.toLowerCase()) ||
      p.roomBed.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'all' || p.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesCondition = selectedCondition === 'all' || p.condition === selectedCondition;

    return matchesSearch && matchesDept && matchesCondition;
  });

  const getConditionBadge = (cond: Patient['condition']) => {
    switch (cond) {
      case 'Critical':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">Critical</span>;
      case 'Guarded':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Guarded</span>;
      case 'Stable':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Stable</span>;
      case 'Recovering':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">Recovering</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Patient & Inpatient Management
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-100 text-cyan-800 rounded-md">
              {filteredPatients.length} Active Patients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Clinical census, admission records, room & bed assignments, and attending medical teams.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>AI Triage & Care Plan</span>
            </button>
          )}

          <button
            onClick={onOpenAdmit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Admit New Patient</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Total Inpatients</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{patients.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <Bed className="w-3 h-3" /> Bed census updated
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Critical / ICU</div>
          <div className="text-xl font-bold text-rose-600 mt-0.5">
            {patients.filter(p => p.condition === 'Critical').length}
          </div>
          <div className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> High priority monitoring
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Stable / Recovering</div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">
            {patients.filter(p => p.condition === 'Stable' || p.condition === 'Recovering').length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Normal recovery progress</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Cardiology / Cardio Care</div>
          <div className="text-xl font-bold text-cyan-700 mt-0.5">
            {patients.filter(p => p.department.toLowerCase().includes('cardio')).length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Specialty unit</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by patient name, MRN, diagnosis, room number, or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-xs text-slate-800 font-medium focus:outline-none"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-xs text-slate-800 font-medium focus:outline-none"
            >
              {conditions.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Conditions' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Patient & MRN</th>
                <th className="py-3 px-4">Age / Sex / Blood</th>
                <th className="py-3 px-4">Room & Bed</th>
                <th className="py-3 px-4">Department & Diagnosis</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No patient records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {patient.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <span>{patient.mrn}</span>
                        <span className="text-slate-300">·</span>
                        <span>Adm: {patient.admissionDate}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      <div>{patient.age} yrs · {patient.gender}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {patient.bloodGroup}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      <div className="font-medium text-slate-900 flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{patient.roomBed}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Phone: {patient.contactPhone}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{patient.diagnosis}</div>
                      <div className="text-[11px] text-slate-500">{patient.department}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{patient.attendingDoctorName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Attending Physician</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getConditionBadge(patient.condition)}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActivePatientDetail(patient)}
                          className="p-1.5 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-md transition-colors cursor-pointer"
                          title="View Patient Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove patient record for ${patient.name}?`)) {
                              onDeletePatient(patient.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Discharge / Remove Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Details Modal */}
      {activePatientDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-cyan-400 font-mono font-semibold">
                  Medical Record File
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {activePatientDetail.name}
                </h2>
                <div className="text-xs text-slate-300 font-mono mt-0.5">
                  MRN: {activePatientDetail.mrn} · {activePatientDetail.age} yrs · {activePatientDetail.gender}
                </div>
              </div>
              <button
                onClick={() => setActivePatientDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[11px] block">Current Condition</span>
                  <span className="font-semibold text-slate-800">{activePatientDetail.condition}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Blood Group</span>
                  <span className="font-mono font-bold text-slate-900">{activePatientDetail.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Assigned Ward & Bed</span>
                  <span className="font-semibold text-slate-900">{activePatientDetail.roomBed}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Department</span>
                  <span className="font-medium text-slate-800">{activePatientDetail.department}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1">Clinical Diagnosis:</span>
                <div className="p-2.5 bg-cyan-50 border border-cyan-200 text-cyan-950 font-medium rounded-lg">
                  {activePatientDetail.diagnosis}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 text-[11px] block">Attending Doctor</span>
                  <span className="font-medium text-slate-900">{activePatientDetail.attendingDoctorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Emergency Contact</span>
                  <span className="font-mono text-slate-700">{activePatientDetail.contactPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Admission Date</span>
                  <span className="text-slate-700">{activePatientDetail.admissionDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Insurance Provider</span>
                  <span className="text-slate-700">{activePatientDetail.insuranceProvider}</span>
                </div>
              </div>

              {activePatientDetail.allergies && activePatientDetail.allergies.length > 0 && (
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Known Allergies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePatientDetail.allergies.map((allg, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-medium">
                        {allg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setActivePatientDetail(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
