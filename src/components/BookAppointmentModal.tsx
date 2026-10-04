import React, { useState } from 'react';
import { Doctor, Appointment } from '../types/hospital';
import { X, Calendar, Clock, User, Phone, Mail } from 'lucide-react';

interface BookAppointmentModalProps {
  doctors: Doctor[];
  preselectedDoctorId?: string | null;
  onClose: () => void;
  onSubmit: (appointment: Appointment) => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  doctors,
  preselectedDoctorId,
  onClose,
  onSubmit
}) => {
  const [doctorId, setDoctorId] = useState(preselectedDoctorId || doctors[0]?.id || '');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [date, setDate] = useState('2026-10-05');
  const [timeSlot, setTimeSlot] = useState('09:30 AM');
  const [type, setType] = useState<Appointment['type']>('OPD Consultation');
  const [notes, setNotes] = useState('');

  const selectedDoctor = doctors.find(d => d.id === doctorId) || doctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientName,
      patientPhone: patientPhone || '+1 (555) 000-0000',
      patientEmail: patientEmail || 'patient@aegishealth.org',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date,
      timeSlot,
      type,
      notes: notes || 'Standard clinical outpatient evaluation',
      status: 'Scheduled'
    };

    onSubmit(newAppointment);
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
            <Calendar className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-slate-900">Schedule Clinical Consultation</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Doctor Selection */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">Attending Specialist</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            >
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialty} (${doc.consultationFee} · {doc.cabinRoom})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-cyan-50/60 rounded-lg border border-cyan-100 flex items-center gap-3">
            <img 
              src={selectedDoctor.avatarUrl} 
              alt={selectedDoctor.name} 
              className="w-10 h-10 rounded-full object-cover border border-cyan-200" 
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-900">{selectedDoctor.name}</span>
              <p className="text-slate-500">{selectedDoctor.specialty} · OPD: {selectedDoctor.opdHours}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Patient Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Margaret Sullivan"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-9 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 234-5678"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full pl-9 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="patient@email.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-9 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Consult Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                <option value="08:30 AM">08:30 AM</option>
                <option value="09:15 AM">09:15 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:45 PM">03:45 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Appointment['type'])}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              >
                <option value="OPD Consultation">OPD Consult</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Pre-Op Evaluation">Pre-Op Evaluation</option>
                <option value="Second Opinion">Second Opinion</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">Reason for Visit / Symptoms</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Primary symptoms or referral notes..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            />
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
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
