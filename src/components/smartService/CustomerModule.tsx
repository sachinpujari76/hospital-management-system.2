import React, { useState } from 'react';
import { Users, Search, Plus, Phone, Mail, MapPin, Trash2, Edit2, X } from 'lucide-react';
import { Customer, UserSession } from '../../types/serviceSystem';

interface CustomerModuleProps {
  customers: Customer[];
  userSession: UserSession;
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onEditCustomer: (id: number, customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onDeleteCustomer: (id: number) => void;
}

export const CustomerModule: React.FC<CustomerModuleProps> = ({
  customers,
  userSession,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer
}) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q);
  });

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    setAddress(c.address);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onAddCustomer({ name, email, phone, address });
    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !name.trim() || !phone.trim()) return;
    onEditCustomer(editingCustomer.id, { name, email, phone, address });
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Customer Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update, search, and manage customer contact records in MySQL database.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setIsAddOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customers by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
          />
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          Total: {filteredCustomers.length} records
        </span>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-2.5 px-4">Customer ID</th>
                <th className="py-2.5 px-3">Full Name</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Address</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">
                    #CUST-{c.id}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {c.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {c.phone}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {c.email || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-[240px] truncate" title={c.address}>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {c.address || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="px-2 py-1 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded transition-colors cursor-pointer"
                      title="Edit Customer"
                    >
                      <Edit2 className="w-3.5 h-3.5 inline" />
                    </button>
                    {userSession.role === 'admin' && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete customer ${c.name}?`)) {
                            onDeleteCustomer(c.id);
                          }
                        }}
                        className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-400">
            No customers match the current search query.
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Add New Customer</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Address</label>
                <textarea
                  rows={2}
                  placeholder="Street, City, Pin Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Edit Customer Details</h3>
              <button onClick={() => setEditingCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
