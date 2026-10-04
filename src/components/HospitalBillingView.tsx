import React, { useState } from 'react';
import { HospitalBill, Patient, Doctor } from '../types/hospital';
import { 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Trash2, 
  X, 
  Download,
  Building,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface HospitalBillingViewProps {
  bills: HospitalBill[];
  patients: Patient[];
  doctors: Doctor[];
  onAddBill: (newBill: Omit<HospitalBill, 'id'>) => void;
  onTogglePaymentStatus: (id: string) => void;
  onDeleteBill: (id: string) => void;
  isCreateOpenInitially?: boolean;
  onCloseCreateModal?: () => void;
}

export const HospitalBillingView: React.FC<HospitalBillingViewProps> = ({
  bills,
  patients,
  doctors,
  onAddBill,
  onTogglePaymentStatus,
  onDeleteBill,
  isCreateOpenInitially = false,
  onCloseCreateModal
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Pending'>('all');
  const [isAddOpen, setIsAddOpen] = useState(isCreateOpenInitially);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState<HospitalBill | null>(null);

  // New Bill Form States
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState<string>(doctors[0]?.id || '');
  const [department, setDepartment] = useState<string>('General Medicine');
  const [itemCategory, setItemCategory] = useState<'Consultation' | 'Bed Charge' | 'Laboratory' | 'Surgery' | 'Pharmacy' | 'Emergency' | 'Nursing'>('Consultation');
  const [itemDesc, setItemDesc] = useState<string>('Specialist Consultation Fee');
  const [unitPrice, setUnitPrice] = useState<number>(150);
  const [quantity, setQuantity] = useState<number>(1);
  const [taxRate, setTaxRate] = useState<number>(5); // 5%
  const [discount, setDiscount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit Card' | 'Health Insurance' | 'UPI / Online'>('Health Insurance');
  const [remarks, setRemarks] = useState<string>('');

  const filteredBills = bills.filter(b => {
    const matchesSearch = 
      b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.patientName.toLowerCase().includes(search.toLowerCase()) ||
      b.patientMrn.toLowerCase().includes(search.toLowerCase()) ||
      b.doctorName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = bills
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalPending = bills
    .filter(b => b.paymentStatus === 'Pending')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === patientId) || patients[0];
    const doctor = doctors.find(d => d.id === doctorId) || doctors[0];

    const subtotal = unitPrice * quantity;
    const calculatedTax = (subtotal * taxRate) / 100;
    const totalAmount = Math.max(0, subtotal + calculatedTax - discount);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newBill: Omit<HospitalBill, 'id'> = {
      billNumber: `INV-2026-${randomNum}`,
      patientId: patient ? patient.id : 'pat-new',
      patientName: patient ? patient.name : 'Outpatient',
      patientMrn: patient ? patient.mrn : 'MRN-NEW',
      billDate: new Date().toISOString().split('T')[0],
      doctorName: doctor ? doctor.name : 'Hospital Attending Doctor',
      department: department || (doctor ? doctor.department : 'General OPD'),
      items: [
        {
          id: `item-${Date.now()}`,
          description: itemDesc || 'Hospital Clinical Service',
          category: itemCategory,
          quantity,
          unitPrice,
          total: subtotal
        }
      ],
      subtotal,
      tax: calculatedTax,
      discount,
      totalAmount,
      paymentStatus,
      paymentMethod,
      remarks: remarks || 'Clinical services rendered.'
    };

    onAddBill(newBill);
    setIsAddOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Hospital Billing & Invoicing
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md">
              {bills.length} Invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Patient treatment invoicing, doctor consultation fees, room charges, diagnostic billing, and insurance receipts.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Bill</span>
        </button>
      </div>

      {/* Revenue Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Total Settled Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            ${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Settled via Cash, Insurance & Card
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Pending Receivables</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Awaiting TPA / Patient copay settlement
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Total Invoices Issued</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {bills.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {bills.filter(b => b.paymentStatus === 'Paid').length} Paid · {bills.filter(b => b.paymentStatus === 'Pending').length} Pending
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice number, patient name, MRN, or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-xs text-slate-800 font-medium focus:outline-none"
            >
              <option value="all">All Invoices</option>
              <option value="Paid">Paid Only</option>
              <option value="Pending">Pending Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Billing Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient & MRN</th>
                <th className="py-3 px-4">Service & Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {bill.billNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{bill.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{bill.patientMrn}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">
                        {bill.items[0]?.description || 'Hospital Treatment'}
                      </div>
                      <div className="text-[11px] text-slate-500">{bill.department} · {bill.doctorName}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {bill.billDate}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      ${bill.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        <CreditCard className="w-3 h-3 text-slate-500" />
                        {bill.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onTogglePaymentStatus(bill.id)}
                        className="cursor-pointer"
                        title="Click to toggle Paid/Pending status"
                      >
                        {bill.paymentStatus === 'Paid' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBillForPrint(bill)}
                          className="p-1.5 text-cyan-700 hover:bg-cyan-50 rounded-md transition-colors cursor-pointer"
                          title="View & Print Official Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete bill ${bill.billNumber}?`)) {
                              onDeleteBill(bill.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate New Bill */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-mono font-semibold">
                  Billing Counter
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Generate Hospital Invoice
                </h2>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Patient</label>
                  <select
                    value={patientId}
                    onChange={(e) => {
                      setPatientId(e.target.value);
                      const pt = patients.find(p => p.id === e.target.value);
                      if (pt) setDepartment(pt.department);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                    required
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Attending Doctor</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                    required
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Service Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setItemCategory(cat);
                      if (cat === 'Consultation') { setItemDesc('Specialist Clinical Consultation'); setUnitPrice(175); }
                      else if (cat === 'Bed Charge') { setItemDesc('ICU / Inpatient Bed Charge (Per Day)'); setUnitPrice(450); }
                      else if (cat === 'Laboratory') { setItemDesc('Comprehensive Diagnostic Lab Panel'); setUnitPrice(85); }
                      else if (cat === 'Surgery') { setItemDesc('Minor Surgical / Cath Lab Procedure'); setUnitPrice(650); }
                      else if (cat === 'Pharmacy') { setItemDesc('Hospital Inpatient Pharmacy Medication'); setUnitPrice(120); }
                      else if (cat === 'Emergency') { setItemDesc('Level 1 Trauma Triage & Resuscitation'); setUnitPrice(350); }
                      else { setItemDesc('Specialized Nursing Care'); setUnitPrice(75); }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  >
                    <option value="Consultation">Doctor Consultation</option>
                    <option value="Bed Charge">Inpatient / ICU Bed Charges</option>
                    <option value="Laboratory">Laboratory & Diagnostics</option>
                    <option value="Surgery">Surgery / Operation Theater</option>
                    <option value="Pharmacy">Pharmacy & Medical Supplies</option>
                    <option value="Emergency">Emergency & Trauma Care</option>
                    <option value="Nursing">Nursing & Clinical Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Item Description</label>
                  <input
                    type="text"
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity / Days</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Discount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  >
                    <option value="Health Insurance">Health Insurance / TPA</option>
                    <option value="Credit Card">Credit Card / POS</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="UPI / Online">UPI / Net Banking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
                  >
                    <option value="Paid">Paid / Settled</option>
                    <option value="Pending">Pending Payment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Billing Remarks / Insurance Claim #</label>
                <input
                  type="text"
                  placeholder="e.g. Pre-authorized under policy #POL-89421"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Total Summary Preview */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Estimated Total Payable:</span>
                <span className="font-mono font-bold text-base text-cyan-800">
                  ${Math.max(0, (unitPrice * quantity) + ((unitPrice * quantity * taxRate) / 100) - discount).toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors cursor-pointer shadow-xs"
                >
                  Issue & Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: High-Fidelity Printable Clinical Invoice */}
      {selectedBillForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Action Bar */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-sm">Official Hospital Inpatient/Outpatient Invoice</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedBillForPrint(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Sheet */}
            <div className="p-8 space-y-6 text-xs text-slate-800 bg-white">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
                    <span className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-sm">
                      A
                    </span>
                    Aegis Health System
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Tertiary Care & Multispecialty Hospital Center<br />
                    742 Medical Center Drive, Suite 100 · Lic: HC-88921-USA<br />
                    Emergency: +1 (800) 555-9911 · Billing Help: +1 (555) 019-3300
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400">
                    TAX INVOICE
                  </div>
                  <div className="text-base font-mono font-bold text-cyan-800 mt-0.5">
                    {selectedBillForPrint.billNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Date: <span className="font-semibold text-slate-700">{selectedBillForPrint.billDate}</span>
                  </div>
                  <div className="mt-1">
                    {selectedBillForPrint.paymentStatus === 'Paid' ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        PAID IN FULL
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        PENDING PAYMENT
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient & Doctor Meta */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Billed To (Patient)</div>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{selectedBillForPrint.patientName}</div>
                  <div className="text-slate-600 font-mono mt-0.5">Medical Record #: {selectedBillForPrint.patientMrn}</div>
                  <div className="text-slate-600">Department: {selectedBillForPrint.department}</div>
                </div>

                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400">Clinical Attending</div>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{selectedBillForPrint.doctorName}</div>
                  <div className="text-slate-600 mt-0.5">Payment Mode: {selectedBillForPrint.paymentMethod}</div>
                  {selectedBillForPrint.remarks && (
                    <div className="text-[11px] text-slate-500 mt-0.5 italic">Ref: {selectedBillForPrint.remarks}</div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Item & Description</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Unit Price</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedBillForPrint.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 px-4 font-medium text-slate-900">{item.description}</td>
                        <td className="py-3 px-4 text-slate-500">{item.category}</td>
                        <td className="py-3 px-4 text-center font-mono">{item.quantity}</td>
                        <td className="py-3 px-4 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-mono font-semibold">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Subtotal & Calculations */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">${selectedBillForPrint.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable Tax (5%):</span>
                    <span className="font-mono">${selectedBillForPrint.tax.toFixed(2)}</span>
                  </div>
                  {selectedBillForPrint.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount / TPA Subsidy:</span>
                      <span className="font-mono">-${selectedBillForPrint.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-cyan-800">${selectedBillForPrint.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Seal & Authorization */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                    Authorized Hospital Accounts & TPA Desk
                  </div>
                  <div>This is a computer generated invoice valid without physical signature.</div>
                </div>

                <div className="text-right">
                  <div className="border-b border-slate-300 w-36 mb-1"></div>
                  <div>Hospital Registrar Seal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
