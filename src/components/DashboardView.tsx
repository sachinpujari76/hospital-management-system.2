import React, { useState } from 'react';
import { 
  User, 
  Plus, 
  Sparkles, 
  Calendar, 
  Receipt, 
  Stethoscope, 
  Bed, 
  Users, 
  ChevronDown, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { Patient, Doctor, Appointment, UserSession } from '../types/hospital';

interface DashboardViewProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  userSession: UserSession;
  onOpenAdmit: () => void;
  onOpenAddDoctor: () => void;
  onOpenBook: () => void;
  onOpenNewBill: () => void;
  onOpenAiAssistant: () => void;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  doctors,
  appointments,
  userSession,
  onOpenAdmit,
  onOpenAddDoctor,
  onOpenBook,
  onOpenNewBill,
  onOpenAiAssistant,
  onLogout
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Recent appointments sample matching the screenshot + user created appointments
  const defaultRecentAppointments = [
    { patient: 'Rahul Patil', doctor: 'Dr. Sharma', date: '26 Aug 2026', time: '10:00 AM', status: 'Confirmed' },
    { patient: 'Amit Kumar', doctor: 'Dr. Shah', date: '26 Aug 2026', time: '11:30 AM', status: 'Pending' },
    { patient: 'Priya Singh', doctor: 'Dr. Patil', date: '26 Aug 2026', time: '01:00 PM', status: 'Confirmed' }
  ];

  // Combine with live appointments
  const combinedRecent = [
    ...appointments.slice(0, 3).map(a => ({
      patient: a.patientName,
      doctor: a.doctorName,
      date: a.date,
      time: a.timeSlot,
      status: a.status === 'Completed' || a.status === 'Scheduled' ? 'Confirmed' : a.status
    })),
    ...defaultRecentAppointments
  ].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Header Row matching screenshot */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#16274e]">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome to Hospital Management System
          </p>
        </div>

        {/* Top Right Admin Profile Button */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-all text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <User className="w-4 h-4 text-blue-600" />
            <span className="capitalize">{userSession.role || 'Admin'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900 truncate">{userSession.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{userSession.email}</div>
              </div>
              <button
                onClick={() => { setIsProfileDropdownOpen(false); onOpenAiAssistant(); }}
                className="w-full px-3.5 py-2 text-left hover:bg-blue-50 text-blue-700 font-medium flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Clinical Assistant</span>
              </button>
              <button
                onClick={() => { setIsProfileDropdownOpen(false); onLogout(); }}
                className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2 cursor-pointer border-t border-slate-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Stat Cards matching screenshot exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Patients */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5">
          <div className="text-4xl select-none">
            🧑‍🤝‍🧑
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16274e] tracking-tight">
              1250
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Total Patients
            </div>
          </div>
        </div>

        {/* Card 2: Total Doctors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5">
          <div className="text-4xl select-none">
            👨‍⚕️
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16274e] tracking-tight">
              35
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Total Doctors
            </div>
          </div>
        </div>

        {/* Card 3: Appointments Today */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5">
          <div className="text-4xl select-none">
            🗓️
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16274e] tracking-tight">
              48
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Appointments Today
            </div>
          </div>
        </div>

        {/* Card 4: Available Beds */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5">
          <div className="text-4xl select-none">
            🛏️
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16274e] tracking-tight">
              22
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              Available Beds
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Card matching screenshot */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <h2 className="text-lg font-bold text-[#16274e] mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={onOpenAdmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <span>➕</span>
            <span>Add Patient</span>
          </button>

          <button
            onClick={onOpenAddDoctor}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <span>👨‍⚕️</span>
            <span>Add Doctor</span>
          </button>

          <button
            onClick={onOpenBook}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <span>🗓️</span>
            <span>Book Appointment</span>
          </button>

          <button
            onClick={onOpenNewBill}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <span>📄</span>
            <span>Generate Bill</span>
          </button>
        </div>
      </div>

      {/* Recent Appointments Table Card matching screenshot */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#16274e]">
            Recent Appointments
          </h2>
          <button
            onClick={onOpenBook}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            + New Appointment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold text-xs">
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {combinedRecent.map((apt, index) => {
                const isConfirmed = apt.status.toLowerCase() === 'confirmed' || apt.status.toLowerCase() === 'scheduled';
                return (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {apt.patient}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {apt.doctor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {apt.date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {apt.time}
                    </td>
                    <td className="py-3.5 px-4">
                      {isConfirmed ? (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100/90 text-emerald-800">
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100/90 text-amber-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
