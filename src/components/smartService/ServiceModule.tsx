import React, { useState } from 'react';
import { Cog, Search, Plus, Trash2, Edit2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { ServiceItem, UserSession } from '../../types/serviceSystem';

interface ServiceModuleProps {
  services: ServiceItem[];
  userSession: UserSession;
  onAddService: (s: Omit<ServiceItem, 'id' | 'createdAt'>) => void;
  onEditService: (id: number, s: Omit<ServiceItem, 'id' | 'createdAt'>) => void;
  onDeleteService: (id: number) => void;
}

export const ServiceModule: React.FC<ServiceModuleProps> = ({
  services,
  userSession,
  onAddService,
  onEditService,
  onDeleteService
}) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('799.00');
  const [status, setStatus] = useState<'Available' | 'Unavailable'>('Available');

  const filteredServices = services.filter(s => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  });

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService(s);
    setName(s.name);
    setDescription(s.description);
    setPrice(s.price.toString());
    setStatus(s.status);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onAddService({
      name,
      description,
      price: parseFloat(price) || 0,
      status
    });
    setIsAddOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !name.trim()) return;
    onEditService(editingService.id, {
      name,
      description,
      price: parseFloat(price) || 0,
      status
    });
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Service Catalog & Offerings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure technical services, labor rates in ₹ (INR), package descriptions, and availability.
          </p>
        </div>

        {userSession.role === 'admin' && (
          <button
            onClick={() => {
              setName('');
              setDescription('');
              setPrice('999.00');
              setStatus('Available');
              setIsAddOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Service
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search service name, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
          />
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          {filteredServices.length} items cataloged
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                  s.status === 'Available' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {s.status}
                </span>
                <span className="font-mono text-base font-bold text-slate-900">
                  ₹ {s.price.toFixed(2)}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-1.5">{s.name}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {s.description || 'Standard specialized technical maintenance service.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">#SRV-{s.id}</span>
              {userSession.role === 'admin' ? (
                <div className="space-x-1">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="px-2 py-1 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 inline" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete service "${s.name}"?`)) {
                        onDeleteService(s.id);
                      }
                    }}
                    className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-emerald-700 font-medium">Ready to Book</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Add Service to Catalog</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laser Printer Head Calibration"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail the tools, turnaround time, and deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Edit Service</h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Name *</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
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
