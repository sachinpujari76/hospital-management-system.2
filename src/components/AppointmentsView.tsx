import React, { useState } from 'react';
import { Appointment, Doctor } from '../types/hospital';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle,
  FileText
} from 'lucide-react';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  onOpenBook: () => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  doctors,
  onOpenBook,
  onUpdateStatus
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filtered = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    const matchesSearch = !search ||
      apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(search.toLowerCase()) ||
      apt.type.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Outpatient Consultations & Appointment Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time outpatient clinic scheduling, follow-ups, and pre-op reviews.
          </p>
        </div>

        <button
          onClick={onOpenBook}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          New Consultation
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Status:</span>
          <div className="flex items-center gap-1">
            {['All', 'Scheduled', 'In Consultation', 'Completed', 'Cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient, doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-2.5 px-4">Patient / Contact</th>
                <th className="py-2.5 px-3">Consulting Physician</th>
                <th className="py-2.5 px-3">Date & Slot</th>
                <th className="py-2.5 px-3">Visit Type</th>
                <th className="py-2.5 px-3">Clinical Notes</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{apt.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {apt.patientPhone}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{apt.doctorName}</div>
                    <div className="text-[11px] text-slate-400">{apt.specialty}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-slate-800 font-medium">{apt.date}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{apt.timeSlot}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {apt.type}
                  </td>
                  <td className="py-3 px-3 max-w-[200px] text-slate-600 truncate" title={apt.notes}>
                    {apt.notes}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-mono text-[11px] font-semibold ${
                      apt.status === 'Completed'
                        ? 'text-emerald-700'
                        : apt.status === 'In Consultation'
                        ? 'text-cyan-700'
                        : apt.status === 'Cancelled'
                        ? 'text-rose-600'
                        : 'text-amber-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {apt.status === 'Scheduled' && (
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'In Consultation')}
                        className="px-2 py-1 text-[11px] font-medium bg-cyan-50 text-cyan-800 hover:bg-cyan-100 rounded cursor-pointer"
                      >
                        Start
                      </button>
                    )}
                    {apt.status === 'In Consultation' && (
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'Completed')}
                        className="px-2 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded cursor-pointer"
                      >
                        Complete
                      </button>
                    )}
                    {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                        className="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-400">
            No consultations found for current filter.
          </div>
        )}
      </div>
    </div>
  );
};
