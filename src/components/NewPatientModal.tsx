import React, { useState } from 'react';
import { Patient, Doctor } from '../types/hospital';
import { X, UserPlus, HeartPulse } from 'lucide-react';

interface NewPatientModalProps {
  doctors: Doctor[];
  onClose: () => void;
  onSubmit: (patient: Patient) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  doctors,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [contactPhone, setContactPhone] = useState('');
  const [roomBed, setRoomBed] = useState('Ward 2A, Bed 08');
  const [department, setDepartment] = useState('Internal Medicine');
  const [attendingDoctorId, setAttendingDoctorId] = useState(doctors[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [condition, setCondition] = useState<Patient['condition']>('Stable');
  const [triageLevel, setTriageLevel] = useState<Patient['triageLevel']>('standard');
  const [allergiesText, setAllergiesText] = useState('None');
  const [insurance, setInsurance] = useState('National Comprehensive Care');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const doctor = doctors.find(d => d.id === attendingDoctorId) || doctors[0];
    const randomMrn = `MRN-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      mrn: randomMrn,
      name,
      age: Number(age),
      gender,
      bloodGroup,
      contactPhone: contactPhone || '+1 (555) 012-3456',
      roomBed,
      department,
      admissionDate: now,
      attendingDoctorId: doctor.id,
      attendingDoctorName: doctor.name,
      diagnosis: diagnosis || 'Clinical Inpatient Observation',
      condition,
      triageLevel,
      allergies: allergiesText.split(',').map(s => s.trim()).filter(Boolean),
      insuranceProvider: insurance
    };

    onSubmit(newPatient);
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
            <UserPlus className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-slate-900">Inpatient Admission & Registration</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                placeholder="Full Legal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min={0}
                max={120}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Allocated Bed / Room</label>
              <input
                type="text"
                required
                value={roomBed}
                onChange={(e) => setRoomBed(e.target.value)}
                placeholder="e.g. ICU-02 or Ward 3A-14"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Emergency & Trauma">Emergency & Trauma</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Pulmonology">Pulmonology</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Attending Physician</label>
              <select
                value={attendingDoctorId}
                onChange={(e) => setAttendingDoctorId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Triage Priority</label>
              <select
                value={triageLevel}
                onChange={(e) => setTriageLevel(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                <option value="standard">Standard Inpatient</option>
                <option value="urgent">Urgent</option>
                <option value="emergent">Emergent</option>
                <option value="resuscitation">Resuscitation (Code Red)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Admission Diagnosis</label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute exacerbation of COPD, post-stent monitoring..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Known Allergies</label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="Penicillin, NSAIDs (or None)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Insurance Carrier</label>
              <input
                type="text"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder="Insurance Policy / Medicare"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              />
            </div>
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
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-xs"
            >
              Confirm Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
