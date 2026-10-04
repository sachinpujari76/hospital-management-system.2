import React, { useState } from 'react';
import { UserCheck, Search, Plus, Phone, Mail, Trash2, Edit2, X, Shield } from 'lucide-react';
import { Staff, UserSession } from '../../types/serviceSystem';

interface StaffModuleProps {
  staff: Staff[];
  userSession: UserSession;
  onAddStaff: (s: Omit<Staff, 'id' | 'createdAt'>) => void;
  onEditStaff: (id: number, s: Omit<Staff, 'id' | 'createdAt'>) => void;
  onDeleteStaff: (id: number) => void;
}

export const StaffModule: React.FC<StaffModuleProps> = ({
  staff,
  userSession,
  onAddStaff,
  onEditStaff,
  onDeleteStaff
}) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('Field Technician');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const filteredStaff = staff.filter(s => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q);
  });

  const handleOpenEdit = (s: Staff) => {
    setEditingStaff(s);
    setName(s.name);
    setRole(s.role);
    setEmail(s.email);
    setPhone(s.phone);
    setStatus(s.status);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onAddStaff({ name, role, email, phone, status });
    setIsAddOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff || !name.trim()) return;
    onEditStaff(editingStaff.id, { name, role, email, phone, status });
    setEditingStaff(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Technical Staff & Engineers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage field service engineers, specialists, roles, and real-time duty status.
          </p>
        </div>

        {userSession.role === 'admin' && (
          <button
            onClick={() => {
              setName('');
              setRole('Field Technician');
              setEmail('');
              setPhone('');
              setStatus('Active');
              setIsAddOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Staff Member
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search staff by name, designation, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
          />
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          Total Staff: {filteredStaff.length}
        </span>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-2.5 px-4">Staff ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Designation / Role</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Contact Phone</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                {userSession.role === 'admin' && (
                  <th className="py-2.5 px-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">
                    #STF-{s.id}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {s.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                      {s.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {s.email}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {s.phone}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-mono text-[11px] font-semibold ${
                      s.status === 'Active' ? 'text-emerald-700' : 'text-slate-400'
                    }`}>
                      {s.status === 'Active' ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  {userSession.role === 'admin' && (
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="px-2 py-1 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded transition-colors cursor-pointer"
                        title="Edit Staff Member"
                      >
                        <Edit2 className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove staff member ${s.name}?`)) {
                            onDeleteStaff(s.id);
                          }
                        }}
                        className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Staff Member"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Add Staff Member</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Seth"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Hardware Tech"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9870011223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@smartservice.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Edit Staff Record</h3>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
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
