import React from 'react';
import { 
  Users, 
  UserCheck, 
  Cog, 
  CalendarCheck, 
  Receipt, 
  ArrowUpRight, 
  Plus, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileCode2
} from 'lucide-react';
import { Customer, Staff, ServiceItem, Appointment, Bill } from '../../types/serviceSystem';

interface DashboardModuleProps {
  customers: Customer[];
  staff: Staff[];
  services: ServiceItem[];
  appointments: Appointment[];
  bills: Bill[];
  onNavigateTab: (tab: string) => void;
  onOpenNewBooking: () => void;
  onOpenNewBill: () => void;
  onOpenNewCustomer: () => void;
  onOpenAiAssistant: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  customers,
  staff,
  services,
  appointments,
  bills,
  onNavigateTab,
  onOpenNewBooking,
  onOpenNewBill,
  onOpenNewCustomer,
  onOpenAiAssistant
}) => {
  const totalRevenue = bills
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingBookings = appointments.filter(a => a.status === 'Pending').length;
  const confirmedBookings = appointments.filter(a => a.status === 'Confirmed').length;
  const completedBookings = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            System Operational Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time management overview for Smart Service System (Python Flask + MySQL backend).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAiAssistant}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-900 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            AI Service Advisor
          </button>
          <button
            onClick={onOpenNewBooking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Schedule Booking
          </button>
          <button
            onClick={onOpenNewBill}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            Generate Bill
          </button>
        </div>
      </div>

      {/* College Project Presentation Callout Banner */}
      <div className="bg-linear-to-r from-slate-900 to-cyan-950 text-white p-4 sm:p-5 rounded-xl border border-cyan-800/40 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
              BTech Project
            </span>
            <span className="text-xs text-slate-300">
              Python Flask 3.0 &middot; MySQL Database &middot; Bootstrap 5
            </span>
          </div>
          <h2 className="text-sm font-bold text-white">
            Smart Service Management System (Complete Source Code Available)
          </h2>
          <p className="text-xs text-slate-300">
            All code files (<code className="text-cyan-300">app.py</code>, <code className="text-cyan-300">database.sql</code>, HTML templates, CSS, JS) are ready in the folder structure and downloadable.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('code_export')}
          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <FileCode2 className="w-3.5 h-3.5" />
          View Python & MySQL Code
        </button>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Customers */}
        <div 
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-500">Total Customers</span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{customers.length}</span>
            <span className="text-xs text-emerald-600 font-medium">Registered</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Active clients in database
          </div>
        </div>

        {/* Card 2: Total Staff */}
        <div 
          onClick={() => onNavigateTab('staff')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-500">Service Staff</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{staff.length}</span>
            <span className="text-xs text-indigo-600 font-medium">{staff.filter(s => s.status === 'Active').length} Active</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Certified technical staff
          </div>
        </div>

        {/* Card 3: Total Services */}
        <div 
          onClick={() => onNavigateTab('services')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-500">Catalog Services</span>
            <Cog className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{services.length}</span>
            <span className="text-xs text-slate-500">Packages</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            All services available
          </div>
        </div>

        {/* Card 4: Appointments / Bookings */}
        <div 
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-500">Total Bookings</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{appointments.length}</span>
            <span className="text-xs text-amber-600 font-medium font-mono">{pendingBookings} Pending</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {confirmedBookings} Confirmed &middot; {completedBookings} Completed
          </div>
        </div>
      </div>

      {/* Revenue Highlight Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Realized Revenue (Collected)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              ₹ {totalRevenue.toFixed(2)}
            </h3>
            <span className="text-xs text-emerald-700 font-medium">
              from {bills.filter(b => b.paymentStatus === 'Paid').length} paid invoices
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('billing')}
            className="px-3.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            View Invoices & Billing
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            Full Analytics Report
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Bookings & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Service Bookings</h3>
              <p className="text-xs text-slate-500">Live service appointments and technician assignments</p>
            </div>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-semibold text-cyan-700 hover:underline cursor-pointer"
            >
              View All ({appointments.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Assigned Staff</th>
                  <th className="py-2.5 px-3">Scheduled Date</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {apt.customerName}
                      <span className="block text-[11px] font-normal text-slate-400 font-mono">
                        {apt.customerPhone}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-800">
                      {apt.serviceName}
                      <span className="block text-[11px] font-mono text-cyan-700">
                        ₹ {apt.servicePrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {apt.staffName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {apt.bookingDate} {apt.bookingTime}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`font-mono text-[11px] font-semibold ${
                        apt.status === 'Confirmed'
                          ? 'text-emerald-700'
                          : apt.status === 'Completed'
                          ? 'text-cyan-700'
                          : apt.status === 'Cancelled'
                          ? 'text-rose-600'
                          : 'text-amber-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Invoices */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Recent Invoices</h3>
                <p className="text-xs text-slate-500">Latest customer billings</p>
              </div>
              <button
                onClick={() => onNavigateTab('billing')}
                className="text-xs font-semibold text-cyan-700 hover:underline cursor-pointer"
              >
                All Bills →
              </button>
            </div>

            <div className="p-4 space-y-3">
              {bills.slice(0, 4).map((bill) => (
                <div key={bill.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-slate-900">{bill.billNumber}</div>
                    <div className="text-[11px] text-slate-500">{bill.customerName} &middot; {bill.serviceName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">₹ {bill.totalAmount.toFixed(2)}</div>
                    <span className={`text-[11px] font-mono font-semibold ${
                      bill.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {bill.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={onOpenNewBill}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              + Generate New Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
