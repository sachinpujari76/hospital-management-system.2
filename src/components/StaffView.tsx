import React, { useState } from 'react';
import { StaffMember } from '../types/hospital';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  X,
  Building
} from 'lucide-react';

interface StaffViewProps {
  staff: StaffMember[];
  onToggleDuty: (id: string) => void;
  onAddStaff: (newStaff: StaffMember) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staff,
  onToggleDuty,
  onAddStaff
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedShift, setSelectedShift] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pageToast, setPageToast] = useState<string | null>(null);

  // New staff form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('Staff Nurse');
  const [dept, setDept] = useState('Intensive Care Unit (ICU)');
  const [shift, setShift] = useState<StaffMember['shift']>('Morning (07:00-15:30)');
  const [extension, setExtension] = useState('Ext. 512');
  const [assignedWard, setAssignedWard] = useState('Ward 2B');

  const departments = [
    'All',
    'Intensive Care Unit (ICU)',
    'Central Pathology Laboratory',
    'Emergency & Trauma',
    'Diagnostic Imaging & Radiology',
    'Central Pharmacy & Infusion',
    'Operating Theaters (OR)',
    'Biomedical Engineering'
  ];

  const filteredStaff = staff.filter(member => {
    const matchesDept = selectedDept === 'All' || member.department === selectedDept;
    const matchesShift = selectedShift === 'All' || member.shift.includes(selectedShift);
    const matchesSearch = !search ||
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase()) ||
      member.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      member.assignedWard.toLowerCase().includes(search.toLowerCase());

    return matchesDept && matchesShift && matchesSearch;
  });

  const onDutyCount = staff.filter(s => s.onDuty).length;

  const handlePageStaff = (member: StaffMember) => {
    setPageToast(`Radio page dispatched to ${member.name} (${member.extension}).`);
    setTimeout(() => {
      setPageToast(null);
    }, 3500);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: StaffMember = {
      id: `st-${Date.now()}`,
      employeeId: `EMP-${Math.floor(4100 + Math.random() * 800)}`,
      name,
      role,
      department: dept,
      shift,
      onDuty: true,
      extension,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}@aegishealth.org`,
      assignedWard,
      joiningYear: 2026
    };

    onAddStaff(newMember);
    setIsAddModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification for Radio Paging */}
      {pageToast && (
        <div className="fixed top-18 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 text-xs flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{pageToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Medical Staff & Shift Duty Rosters
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinical nurse specialists, allied health technologists, pharmacists, and biomedical engineering.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Assign Staff Member
        </button>
      </div>

      {/* Staff Telemetry Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block mb-1">Active on Shift Now</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">{onDutyCount}</span>
            <span className="text-xs text-slate-400">/ {staff.length} registered personnel</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block mb-1">Active Roster Window</span>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-slate-900">Day Shift (07:00 - 15:30)</span>
            <span className="text-xs text-slate-400 font-mono">Next: Evening 15:00</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block mb-1">Nurse-to-Patient Ratio</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">1 : 1.4</span>
            <span className="text-xs text-emerald-700 font-medium">Optimal Standard</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          {/* Department filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 font-medium focus:outline-none"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Shift:</span>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Shifts</option>
                <option value="Morning">Morning (07:00-15:30)</option>
                <option value="Evening">Evening (15:00-23:30)</option>
                <option value="Night">Night (23:00-07:30)</option>
              </select>
            </div>

            <div className="relative w-48 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Search staff name, ward..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-[11px] text-slate-400">{member.employeeId}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                  <p className="text-xs text-cyan-700 font-medium">{member.role}</p>
                </div>
                <button
                  onClick={() => onToggleDuty(member.id)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    member.onDuty 
                      ? 'bg-emerald-50 text-emerald-800 font-semibold' 
                      : 'bg-slate-100 text-slate-500'
                  }`}
                  title="Click to toggle active on-duty presence"
                >
                  {member.onDuty ? '● ON DUTY' : '○ OFF DUTY'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]">{member.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Station:</span>
                  <span className="font-medium text-slate-800">{member.assignedWard}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shift Window:</span>
                  <span className="font-mono text-slate-800 text-[11px]">{member.shift}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Extension:</span>
                  <span className="font-mono text-slate-800">{member.extension}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Since {member.joiningYear}</span>
              <button
                onClick={() => handlePageStaff(member)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-600" />
                Page Staff
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900 text-sm">Assign New Staff Member to Roster</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name & Credentials</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Alba, RN, CCRN"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Clinical Role</label>
                  <input
                    type="text"
                    required
                    placeholder="Staff Nurse / Lab Tech"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="Morning (07:00-15:30)">Morning (07:00-15:30)</option>
                    <option value="Evening (15:00-23:30)">Evening (15:00-23:30)</option>
                    <option value="Night (23:00-07:30)">Night (23:00-07:30)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Assigned Station / Ward</label>
                  <input
                    type="text"
                    required
                    value={assignedWard}
                    onChange={(e) => setAssignedWard(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Hospital Pager / Extension</label>
                <input
                  type="text"
                  required
                  value={extension}
                  onChange={(e) => setExtension(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
