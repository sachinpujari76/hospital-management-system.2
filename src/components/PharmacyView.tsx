import React, { useState } from 'react';
import { Pill, Plus, Search, Filter, AlertTriangle, CheckCircle2, Package, Trash2, ArrowUpDown } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Cardiovascular' | 'Analgesic' | 'Antidiabetic' | 'Respiratory' | 'Emergency IV';
  stock: number;
  unit: string;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  expiryDate: string;
  batchNumber: string;
}

const INITIAL_MEDICINES: Medicine[] = [
  { id: 'med-1', name: 'Atorvastatin 20mg', genericName: 'Atorvastatin Calcium', category: 'Cardiovascular', stock: 450, unit: 'Tablets', price: 12.50, status: 'In Stock', expiryDate: '2027-11-30', batchNumber: 'BAT-9941' },
  { id: 'med-2', name: 'Amoxicillin & Clavulanate 625mg', genericName: 'Amoxicillin / Clavulanic Acid', category: 'Antibiotic', stock: 180, unit: 'Tablets', price: 18.00, status: 'In Stock', expiryDate: '2027-08-15', batchNumber: 'BAT-8820' },
  { id: 'med-3', name: 'Paracetamol 650mg IV Infusion', genericName: 'Acetaminophen', category: 'Analgesic', stock: 24, unit: 'Vials', price: 8.00, status: 'Low Stock', expiryDate: '2026-12-31', batchNumber: 'BAT-7711' },
  { id: 'med-4', name: 'Metformin HCl 500mg SR', genericName: 'Metformin', category: 'Antidiabetic', stock: 620, unit: 'Tablets', price: 9.20, status: 'In Stock', expiryDate: '2028-03-20', batchNumber: 'BAT-6652' },
  { id: 'med-5', name: 'Salbutamol Inhaler 100mcg', genericName: 'Albuterol Sulfate', category: 'Respiratory', stock: 65, unit: 'Canisters', price: 22.00, status: 'In Stock', expiryDate: '2027-05-18', batchNumber: 'BAT-5510' },
  { id: 'med-6', name: 'Epinephrine 1mg/ml (1:1000)', genericName: 'Adrenaline', category: 'Emergency IV', stock: 12, unit: 'Ampoules', price: 35.00, status: 'Low Stock', expiryDate: '2026-11-15', batchNumber: 'BAT-4402' }
];

export const PharmacyView: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New med state
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState<Medicine['category']>('Antibiotic');
  const [stock, setStock] = useState<number>(100);
  const [unit, setUnit] = useState('Tablets');
  const [price, setPrice] = useState<number>(15);
  const [batchNumber, setBatchNumber] = useState('BAT-2026');

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      name,
      genericName: genericName || name,
      category,
      stock,
      unit,
      price,
      status: stock > 30 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock',
      expiryDate: '2028-01-01',
      batchNumber: batchNumber || `BAT-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setMedicines([newMed, ...medicines]);
    setIsAddModalOpen(false);
    setName('');
    setGenericName('');
  };

  const handleDelete = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <span>Pharmacy & Medical Supplies</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hospital formulary inventory, prescription dispensing, unit pricing, and stock monitoring.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Formularies</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{medicines.length} Types</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">100% active hospital approved</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Stock Units</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {medicines.reduce((sum, m) => sum + m.stock, 0)} Units
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Central pharmacy warehouse</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Low Stock Alerts</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {medicines.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').length} Items
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Reorder suggested</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search medicine name, generic name, or batch number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-xs text-slate-800 font-medium focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Analgesic">Analgesic</option>
            <option value="Antidiabetic">Antidiabetic</option>
            <option value="Respiratory">Respiratory</option>
            <option value="Emergency IV">Emergency IV</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Medicine & Generic</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Batch #</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{med.name}</div>
                    <div className="text-[11px] text-slate-500">{med.genericName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{med.category}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{med.batchNumber}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {med.stock} {med.unit}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">${med.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      med.status === 'In Stock'
                        ? 'bg-emerald-100 text-emerald-800'
                        : med.status === 'Low Stock'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {med.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(med.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Medicine */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#182444] text-white p-5 flex items-center justify-between">
              <h2 className="text-base font-bold">Add Medicine to Pharmacy</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ciprofloxacin 500mg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Generic Name</label>
                <input
                  type="text"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  placeholder="e.g. Ciprofloxacin HCl"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  >
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Emergency IV">Emergency IV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Type</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Tablets / Vials"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer font-semibold shadow-xs"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
