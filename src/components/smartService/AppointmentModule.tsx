import React, { useState } from 'react';
import { CalendarCheck, Plus, Search, Filter, Trash2, Edit2, X, Phone, User, Clock, CheckCircle } from 'lucide-react';
import { Appointment, Customer, ServiceItem, Staff, AppointmentStatus } from '../../types/serviceSystem';

interface AppointmentModuleProps {
  appointments: Appointment[];
  customers: Customer[];
  services: ServiceItem[];
  staff: Staff[];
  onAddAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onEditAppointment: (id: number, apt: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onDeleteAppointment: (id: number) => void;
  isCreateOpenInitially?: boolean;
  onCloseCreateModal?: () => void;
}

export const AppointmentModule: React.FC<AppointmentModuleProps> = ({
  appointments,
  customers,
  services,
  staff,
  onAddAppointment,
  onEditAppointment,
  onDeleteAppointment,
  isCreateOpenInitially = false,
  onCloseCreateModal
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(isCreateOpenInitially);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);

  // Form states
  const [customerId, setCustomerId] = useState<number>(customers[0]?.id || 1);
  const [serviceId, setServiceId] = useState<number>(services[0]?.id || 1);
  const [staffId, setStaffId] = useState<number>(staff[0]?.id || 1);
  const [bookingDate, setBookingDate] = useState('2026-10-06');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [status, setStatus] = useState<AppointmentStatus>('Pending');
  const [notes, setNotes] = useState('');

  const filtered = appointments.filter(a => {
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      a.customerName.toLowerCase().includes(q) ||
      a.serviceName.toLowerCase().includes(q) ||
      a.staffName.toLowerCase().includes(q) ||
      a.customerPhone.includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleOpenAdd = () => {
    setCustomerId(customers[0]?.id || 1);
    setServiceId(services[0]?.id || 1);
    setStaffId(staff[0]?.id || 1);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setBookingTime('10:00 AM');
    setStatus('Pending');
    setNotes('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (a: Appointment) => {
    setEditingApt(a);
    setCustomerId(a.customerId);
    setServiceId(a.serviceId);
    setStaffId(a.staffId);
    setBookingDate(a.bookingDate);
    setBookingTime(a.bookingTime);
    setStatus(a.status);
    setNotes(a.notes);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId) || customers[0];
    const srv = services.find(s => s.id === serviceId) || services[0];
    const stf = staff.find(s => s.id === staffId) || staff[0];

    onAddAppointment({
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      serviceId: srv.id,
      serviceName: srv.name,
      servicePrice: srv.price,
      staffId: stf.id,
      staffName: stf.name,
      bookingDate,
      bookingTime,
      status,
      notes
    });

    setIsAddOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;
    const cust = customers.find(c => c.id === customerId) || customers[0];
    const srv = services.find(s => s.id === serviceId) || services[0];
    const stf = staff.find(s => s.id === staffId) || staff[0];

    onEditAppointment(editingApt.id, {
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      serviceId: srv.id,
      serviceName: srv.name,
      servicePrice: srv.price,
      staffId: stf.id,
      staffName: stf.name,
      bookingDate,
      bookingTime,
      status,
      notes
    });

    setEditingApt(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Appointments & Service Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule service tasks, assign technicians, select dates, and update progress.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Schedule Booking
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search booking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-2.5 px-4">Booking ID</th>
                <th className="py-2.5 px-3">Customer Details</th>
                <th className="py-2.5 px-3">Service & Rate</th>
                <th className="py-2.5 px-3">Assigned Staff</th>
                <th className="py-2.5 px-3">Appointment Slot</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 font-semibold">
                    #BK-{a.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{a.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {a.customerPhone}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{a.serviceName}</div>
                    <div className="text-[11px] font-mono text-cyan-700 font-bold">
                      ₹ {a.servicePrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-medium text-slate-800">{a.staffName}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    <div>{a.bookingDate}</div>
                    <div className="text-[11px] text-slate-400">{a.bookingTime}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-mono text-[11px] font-semibold ${
                      a.status === 'Confirmed'
                        ? 'text-emerald-700'
                        : a.status === 'Completed'
                        ? 'text-cyan-700'
                        : a.status === 'Cancelled'
                        ? 'text-rose-600'
                        : 'text-amber-700'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(a)}
                      className="px-2 py-1 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded transition-colors cursor-pointer"
                      title="Edit Booking"
                    >
                      <Edit2 className="w-3.5 h-3.5 inline" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel and delete booking #BK-${a.id}?`)) {
                          onDeleteAppointment(a.id);
                        }
                      }}
                      className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Delete Booking"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-400">
            No bookings found for the selected status.
          </div>
        )}
      </div>

      {/* Add Booking Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Create Service Booking</h3>
              <button 
                onClick={() => {
                  setIsAddOpen(false);
                  if (onCloseCreateModal) onCloseCreateModal();
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                  required
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Service *</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                  required
                >
                  {services.filter(s => s.status === 'Available').map(s => (
                    <option key={s.id} value={s.id}>{s.name} — ₹ {s.price}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Staff / Technician *</label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                  required
                >
                  {staff.filter(s => s.status === 'Active').map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Issue Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Device makes loud noise or fails to power on..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    if (onCloseCreateModal) onCloseCreateModal();
                  }}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Update Booking #BK-{editingApt.id}</h3>
              <button onClick={() => setEditingApt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Technician</label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingApt(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
