import React, { useState } from 'react';
import { Doctor } from '../types/hospital';
import { X, UserPlus, Stethoscope, Phone, Mail, Award, Clock } from 'lucide-react';

interface AddDoctorModalProps {
  onClose: () => void;
  onSubmit: (doctor: Doctor) => void;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('General Medicine');
  const [department, setDepartment] = useState('Outpatient Department');
  const [qualification, setQualification] = useState('MBBS, MD');
  const [experienceYears, setExperienceYears] = useState(8);
  const [consultationFee, setConsultationFee] = useState(150);
  const [cabinRoom, setCabinRoom] = useState('Room 102, 1st Floor');
  const [opdHours, setOpdHours] = useState('09:00 AM - 01:00 PM');
  const [contactPhone, setContactPhone] = useState('+1 (555) 019-3321');
  const [contactEmail, setContactEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
      title: `${qualification} · Specialist`,
      specialty,
      department,
      qualification,
      experienceYears: Number(experienceYears),
      rating: 4.9,
      reviewCount: 1,
      cabinRoom,
      opdHours,
      scheduleDays: ['Monday', 'Wednesday', 'Friday'],
      contactEmail: contactEmail || `${name.toLowerCase().replace(/[^a-z]/g, '')}@hospital.org`,
      contactPhone,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=faces',
      status: 'in_clinic',
      biography: `Specialist in ${specialty} with ${experienceYears} years of clinical expertise.`,
      consultationFee: Number(consultationFee),
      acceptsEmergency: true
    };

    onSubmit(newDoc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#182444] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Doctor</h2>
              <p className="text-[11px] text-blue-200">Register specialist physician into hospital directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Doctor Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Specialty *</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General Medicine">General Medicine</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Dermatology">Dermatology</option>
                <option value="ENT">ENT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Cardiology Wing"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Qualifications</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. MBBS, MD, DM (Cardiology)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Experience (Yrs)</label>
              <input
                type="number"
                min="1"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Consult Fee ($)</label>
              <input
                type="number"
                min="0"
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Cabin / Room</label>
              <input
                type="text"
                value={cabinRoom}
                onChange={(e) => setCabinRoom(e.target.value)}
                placeholder="e.g. Room 204"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">OPD Consultation Hours</label>
              <input
                type="text"
                value={opdHours}
                onChange={(e) => setOpdHours(e.target.value)}
                placeholder="e.g. 10:00 AM - 02:00 PM"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
