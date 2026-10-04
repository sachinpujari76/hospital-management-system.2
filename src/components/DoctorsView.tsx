import React, { useState } from 'react';
import { Doctor } from '../types/hospital';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Stethoscope, 
  X,
  Plus
} from 'lucide-react';

interface DoctorsViewProps {
  doctors: Doctor[];
  onBookDoctor: (doctorId: string) => void;
  searchQuery: string;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  onBookDoctor,
  searchQuery: externalSearch
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);

  const activeSearch = (externalSearch || localSearch).toLowerCase();

  const specialties = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Internal Medicine', 'Pulmonology'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty = selectedSpecialty === 'All' || doc.department.toLowerCase().includes(selectedSpecialty.toLowerCase()) || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
    const matchesSearch = !activeSearch || 
      doc.name.toLowerCase().includes(activeSearch) || 
      doc.specialty.toLowerCase().includes(activeSearch) || 
      doc.department.toLowerCase().includes(activeSearch) ||
      doc.qualification.toLowerCase().includes(activeSearch);

    return matchesSpecialty && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Medical Specialists & Physicians Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Board-certified consultant physicians, department directors, and clinical faculty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by physician name or specialty..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs - Interactive Segmented Controls with Zero-Pill discipline */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-slate-400 font-medium mr-2">Department:</span>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="in_clinic">In Clinic OPD</option>
            <option value="on_duty">On Duty</option>
            <option value="in_surgery">In Surgery</option>
            <option value="on_call">On Call</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          const isSurgeon = doc.status === 'in_surgery';
          const isInClinic = doc.status === 'in_clinic';
          const isOnDuty = doc.status === 'on_duty';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Doctor Headshot & Status */}
                <div className="flex items-start gap-4">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                    <p className="text-xs text-cyan-700 font-medium">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400 truncate">{doc.title}</p>
                    
                    <div className="mt-1 text-[11px] font-mono">
                      {isSurgeon && <span className="text-rose-700 font-semibold">● In Surgical Suite</span>}
                      {isInClinic && <span className="text-cyan-700 font-medium">● Outpatient Clinic Active</span>}
                      {isOnDuty && <span className="text-emerald-700 font-medium">● Available On Duty</span>}
                      {doc.status === 'on_call' && <span className="text-amber-700 font-medium">● On Emergency Call</span>}
                    </div>
                  </div>
                </div>

                {/* Key Specs */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-mono text-slate-800 font-medium">{doc.experienceYears} Years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cabin / Location:</span>
                    <span className="text-slate-800 font-medium">{doc.cabinRoom}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Consultation Hours:</span>
                    <span className="text-slate-800 font-mono text-[11px]">{doc.opdHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Patient Rating:</span>
                    <span className="font-mono text-slate-900 font-medium flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {doc.rating} <span className="text-slate-400 text-[10px]">({doc.reviewCount})</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Standard Consult Fee:</span>
                    <span className="font-mono font-semibold text-slate-900">${doc.consultationFee}</span>
                  </div>
                </div>

                {/* Quick Bio snippet */}
                <p className="mt-3 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {doc.biography}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedDoctorForModal(doc)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onBookDoctor(doc.id)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <Stethoscope className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No doctors match your filter criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the specialty or status filters above.</p>
          <button
            onClick={() => { setSelectedSpecialty('All'); setSelectedStatus('All'); setLocalSearch(''); }}
            className="mt-4 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Doctor Detailed Profile Modal */}
      {selectedDoctorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-900">Physician Clinical Profile</h3>
              </div>
              <button 
                onClick={() => setSelectedDoctorForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={selectedDoctorForModal.avatarUrl}
                  alt={selectedDoctorForModal.name}
                  className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                />
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-900">{selectedDoctorForModal.name}</h2>
                  <p className="text-xs text-cyan-700 font-semibold">{selectedDoctorForModal.specialty}</p>
                  <p className="text-xs text-slate-500">{selectedDoctorForModal.title}</p>
                  <div className="flex items-center gap-3 pt-2 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <strong>{selectedDoctorForModal.rating}</strong> ({selectedDoctorForModal.reviewCount} verified reviews)
                    </span>
                    <span>·</span>
                    <span className="font-mono">{selectedDoctorForModal.experienceYears} Years Practice</span>
                  </div>
                </div>
              </div>

              {/* Clinical Biography */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Clinical Expertise & Background
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {selectedDoctorForModal.biography}
                </p>
              </div>

              {/* Credentials & Details Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-500" /> Credentials & Education
                  </h4>
                  <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                    {selectedDoctorForModal.qualification}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-500" /> Clinic & Hospital Suite
                  </h4>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-800 font-medium">{selectedDoctorForModal.cabinRoom}</p>
                    <p className="text-slate-500 font-mono text-[11px]">Hours: {selectedDoctorForModal.opdHours}</p>
                  </div>
                </div>
              </div>

              {/* Direct Contact & Days */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Direct Hospital Extension</span>
                  <span className="font-mono text-slate-800">{selectedDoctorForModal.contactPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Institutional Email</span>
                  <span className="font-mono text-slate-800">{selectedDoctorForModal.contactEmail}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorForModal(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const docId = selectedDoctorForModal.id;
                    setSelectedDoctorForModal(null);
                    onBookDoctor(docId);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Book Consultation (${selectedDoctorForModal.consultationFee})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
