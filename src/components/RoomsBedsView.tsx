import React, { useState } from 'react';
import { Bed, Plus, Search, Filter, CheckCircle2, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface HospitalBed {
  id: string;
  bedNumber: string;
  roomNumber: string;
  wardType: 'General Ward' | 'Semi-Private' | 'Deluxe Suite' | 'ICU / CCU' | 'Pediatric Ward';
  floor: string;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Reserved';
  patientName?: string;
  patientMrn?: string;
  admissionDate?: string;
  dailyRate: number;
}

const INITIAL_BEDS: HospitalBed[] = [
  { id: 'b-1', bedNumber: 'Bed-101A', roomNumber: 'Room 101', wardType: 'General Ward', floor: '1st Floor', status: 'Occupied', patientName: 'Rahul Patil', patientMrn: 'MRN-84210', admissionDate: '2026-08-26', dailyRate: 120 },
  { id: 'b-2', bedNumber: 'Bed-101B', roomNumber: 'Room 101', wardType: 'General Ward', floor: '1st Floor', status: 'Available', dailyRate: 120 },
  { id: 'b-3', bedNumber: 'Bed-102A', roomNumber: 'Room 102', wardType: 'General Ward', floor: '1st Floor', status: 'Available', dailyRate: 120 },
  { id: 'b-4', bedNumber: 'Bed-102B', roomNumber: 'Room 102', wardType: 'General Ward', floor: '1st Floor', status: 'Occupied', patientName: 'Amit Kumar', patientMrn: 'MRN-84211', admissionDate: '2026-08-25', dailyRate: 120 },
  { id: 'b-5', bedNumber: 'Bed-201', roomNumber: 'Room 201', wardType: 'Semi-Private', floor: '2nd Floor', status: 'Occupied', patientName: 'Priya Singh', patientMrn: 'MRN-84212', admissionDate: '2026-08-26', dailyRate: 250 },
  { id: 'b-6', bedNumber: 'Bed-202', roomNumber: 'Room 202', wardType: 'Semi-Private', floor: '2nd Floor', status: 'Available', dailyRate: 250 },
  { id: 'b-7', bedNumber: 'Bed-301', roomNumber: 'Suite 301', wardType: 'Deluxe Suite', floor: '3rd Floor', status: 'Available', dailyRate: 480 },
  { id: 'b-8', bedNumber: 'Bed-302', roomNumber: 'Suite 302', wardType: 'Deluxe Suite', floor: '3rd Floor', status: 'Occupied', patientName: 'Eleanor Sterling', patientMrn: 'MRN-84213', admissionDate: '2026-08-24', dailyRate: 480 },
  { id: 'b-9', bedNumber: 'ICU-Bed 01', roomNumber: 'ICU Unit A', wardType: 'ICU / CCU', floor: '2nd Floor', status: 'Occupied', patientName: 'Robert Vance Jr.', patientMrn: 'MRN-84214', admissionDate: '2026-08-23', dailyRate: 650 },
  { id: 'b-10', bedNumber: 'ICU-Bed 02', roomNumber: 'ICU Unit A', wardType: 'ICU / CCU', floor: '2nd Floor', status: 'Available', dailyRate: 650 },
  { id: 'b-11', bedNumber: 'ICU-Bed 03', roomNumber: 'ICU Unit A', wardType: 'ICU / CCU', floor: '2nd Floor', status: 'Available', dailyRate: 650 },
  { id: 'b-12', bedNumber: 'ICU-Bed 04', roomNumber: 'ICU Unit A', wardType: 'ICU / CCU', floor: '2nd Floor', status: 'Cleaning', dailyRate: 650 }
];

export const RoomsBedsView: React.FC = () => {
  const [beds, setBeds] = useState<HospitalBed[]>(INITIAL_BEDS);
  const [search, setSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const availableCount = beds.filter(b => b.status === 'Available').length;
  const occupiedCount = beds.filter(b => b.status === 'Occupied').length;

  const filteredBeds = beds.filter(b => {
    const matchesSearch = b.bedNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      (b.patientName && b.patientName.toLowerCase().includes(search.toLowerCase()));
    const matchesWard = selectedWard === 'All' || b.wardType === selectedWard;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const toggleBedStatus = (bedId: string) => {
    setBeds(beds.map(b => {
      if (b.id !== bedId) return b;
      if (b.status === 'Available') return { ...b, status: 'Occupied', patientName: 'Walk-in Patient', patientMrn: 'MRN-NEW' };
      if (b.status === 'Occupied') return { ...b, status: 'Cleaning', patientName: undefined, patientMrn: undefined };
      return { ...b, status: 'Available' };
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <span>Rooms & Beds Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ward occupancy, ICU telemetry beds, private suites, and patient room assignments.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Available Beds</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">22</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Ready for immediate admission</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Occupied Beds</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">{occupiedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active admitted inpatients</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">ICU Telemetry Beds</div>
          <div className="text-3xl font-bold text-rose-600 mt-1">4</div>
          <div className="text-[11px] text-slate-500 mt-1">Critical care monitoring</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Hospital Capacity</div>
          <div className="text-3xl font-bold text-slate-800 mt-1">150 Beds</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 hospital wings</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by bed number, room, or assigned patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Ward:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-xs text-slate-800 font-medium focus:outline-none"
          >
            <option value="All">All Wards</option>
            <option value="General Ward">General Ward</option>
            <option value="Semi-Private">Semi-Private</option>
            <option value="Deluxe Suite">Deluxe Suite</option>
            <option value="ICU / CCU">ICU / CCU</option>
          </select>
        </div>
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isAvail = bed.status === 'Available';
          const isOcc = bed.status === 'Occupied';
          return (
            <div
              key={bed.id}
              className={`p-4 rounded-xl border transition-all ${
                isAvail
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                  : isOcc
                  ? 'bg-white border-blue-200 hover:border-blue-400'
                  : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Bed className={`w-4 h-4 ${isAvail ? 'text-emerald-600' : isOcc ? 'text-blue-600' : 'text-amber-600'}`} />
                  <span>{bed.bedNumber}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isAvail ? 'bg-emerald-100 text-emerald-800' : isOcc ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {bed.status}
                </span>
              </div>

              <div className="mt-2 text-xs space-y-1 text-slate-600">
                <div className="text-[11px] font-medium text-slate-500">{bed.roomNumber} · {bed.wardType}</div>
                <div className="text-[11px] text-slate-400">{bed.floor} · ${bed.dailyRate}/day</div>

                {isOcc && bed.patientName && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Admitted Patient</span>
                    <span className="font-semibold text-slate-900 text-xs">{bed.patientName}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">{bed.patientMrn}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100/80">
                <button
                  onClick={() => toggleBedStatus(bed.id)}
                  className="w-full py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                >
                  {isAvail ? 'Assign Patient' : isOcc ? 'Discharge Bed' : 'Mark Ready'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
