import React, { useState } from 'react';
import { Receipt, Plus, Printer, Trash2, CheckCircle2, Clock, X, Search, FileText } from 'lucide-react';
import { Bill, Customer, ServiceItem, UserSession } from '../../types/serviceSystem';

interface BillingModuleProps {
  bills: Bill[];
  customers: Customer[];
  services: ServiceItem[];
  userSession: UserSession;
  onAddBill: (bill: Omit<Bill, 'id' | 'billDate'>) => void;
  onToggleStatus: (id: number) => void;
  onDeleteBill: (id: number) => void;
  isCreateOpenInitially?: boolean;
  onCloseCreateModal?: () => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({
  bills,
  customers,
  services,
  userSession,
  onAddBill,
  onToggleStatus,
  onDeleteBill,
  isCreateOpenInitially = false,
  onCloseCreateModal
}) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(isCreateOpenInitially);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState<Bill | null>(null);

  // Form states
  const [customerId, setCustomerId] = useState<number>(customers[0]?.id || 1);
  const [serviceId, setServiceId] = useState<number>(services[0]?.id || 1);
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Unpaid'>('Paid');

  const selectedService = services.find(s => s.id === serviceId) || services[0];
  const calculatedTotal = (selectedService?.price || 0) * (quantity || 1);

  const filteredBills = bills.filter(b => {
    const q = search.toLowerCase();
    return b.billNumber.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q);
  });

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId) || customers[0];
    const srv = services.find(s => s.id === serviceId) || services[0];
    const randomInv = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    onAddBill({
      billNumber: randomInv,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerEmail: cust.email,
      serviceId: srv.id,
      serviceName: srv.name,
      quantity,
      price: srv.price,
      totalAmount: srv.price * quantity,
      paymentStatus
    });

    setIsAddOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Billing & Invoicing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate tax receipts, track payment clearance, and print customer bills.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Generate Invoice
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice number, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          {filteredBills.length} invoices generated
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-2.5 px-4">Invoice #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Service Rendered</th>
                <th className="py-2.5 px-3 font-mono">Rate & Qty</th>
                <th className="py-2.5 px-3 font-mono">Total (₹)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-700">
                    {b.billNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">
                    {b.billDate}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{b.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{b.customerPhone}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {b.serviceName}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    ₹ {b.price.toFixed(2)} &times; {b.quantity}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ₹ {b.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onToggleStatus(b.id)}
                      className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        b.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                      title="Click to toggle Paid/Unpaid"
                    >
                      {b.paymentStatus === 'Paid' ? '✓ Paid' : '⏳ Unpaid'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => setSelectedBillForPrint(b)}
                      className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      title="Print Invoice / View Receipt"
                    >
                      <Printer className="w-3.5 h-3.5 inline" />
                    </button>
                    {userSession.role === 'admin' && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete invoice ${b.billNumber}?`)) {
                            onDeleteBill(b.id);
                          }
                        }}
                        className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Invoice"
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

        {filteredBills.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-400">
            No bills found.
          </div>
        )}
      </div>

      {/* Generate Bill Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Generate Service Invoice</h3>
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
            <form onSubmit={handleSaveBill} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Delivered *</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                >
                  {services.filter(s => s.status === 'Available').map(s => (
                    <option key={s.id} value={s.id}>{s.name} (₹ {s.price})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              {/* Live Price Calculator */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-1">
                <span className="text-[11px] text-slate-400 block">Total Calculated Bill</span>
                <div className="font-mono text-xl font-bold text-cyan-700">
                  ₹ {calculatedTotal.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  (₹ {selectedService?.price || 0} &times; {quantity})
                </span>
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
                  Create & Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedBillForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white print:hidden">
              <span className="font-mono text-xs text-slate-300">
                Tax Invoice / {selectedBillForPrint.billNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 inline mr-1" /> Print Invoice
                </button>
                <button
                  onClick={() => setSelectedBillForPrint(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Receipt */}
            <div id="printable-report" className="p-8 text-slate-900 bg-white space-y-6">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">SmartService Systems</h2>
                  <p className="text-xs text-slate-500">Tech & Appliance Management Care</p>
                  <p className="text-xs text-slate-400">GSTIN: 07AAAAA0000A1Z5 &middot; Support: 1800-SMART-SERV</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-sm text-slate-700">TAX INVOICE</h3>
                  <div className="font-mono text-xs font-bold text-cyan-800">{selectedBillForPrint.billNumber}</div>
                  <div className="text-xs text-slate-500 font-mono">{selectedBillForPrint.billDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block mb-0.5">Billed To:</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedBillForPrint.customerName}</div>
                  <div className="text-slate-600 font-mono">Phone: {selectedBillForPrint.customerPhone}</div>
                  <div className="text-slate-600">Email: {selectedBillForPrint.customerEmail || 'N/A'}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block mb-0.5">Payment Status:</span>
                  <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                    selectedBillForPrint.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedBillForPrint.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="py-2.5 px-4">Service Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate</th>
                      <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {selectedBillForPrint.serviceName}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">{selectedBillForPrint.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">₹ {selectedBillForPrint.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ₹ {selectedBillForPrint.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t border-slate-200 bg-slate-50 font-bold">
                    <tr>
                      <td colSpan={3} className="py-2.5 px-4 text-right">Total Invoice Value:</td>
                      <td className="py-2.5 px-4 text-right font-mono text-cyan-800 text-sm">
                        ₹ {selectedBillForPrint.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100">
                Thank you for your business. Smart Service Management System &copy; 2026.
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right print:hidden">
              <button
                onClick={() => setSelectedBillForPrint(null)}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
