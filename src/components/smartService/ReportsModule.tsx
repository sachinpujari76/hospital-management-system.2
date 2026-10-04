import React from 'react';
import { BarChart3, Printer, TrendingUp, Users, CalendarCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Appointment, Bill, Customer, ServiceItem, Staff } from '../../types/serviceSystem';

interface ReportsModuleProps {
  customers: Customer[];
  staff: Staff[];
  services: ServiceItem[];
  appointments: Appointment[];
  bills: Bill[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  customers,
  staff,
  services,
  appointments,
  bills
}) => {
  const totalRevenue = bills
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingRevenue = bills
    .filter(b => b.paymentStatus === 'Unpaid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const paidBillsCount = bills.filter(b => b.paymentStatus === 'Paid').length;
  const unpaidBillsCount = bills.filter(b => b.paymentStatus === 'Unpaid').length;

  const statusCounts = {
    Confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    Completed: appointments.filter(a => a.status === 'Completed').length,
    Pending: appointments.filter(a => a.status === 'Pending').length,
    Cancelled: appointments.filter(a => a.status === 'Cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            System Reports & Business Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical breakdown of revenues, technician workloads, and service package performance.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Report Summary
        </button>
      </div>

      {/* Revenue & Billing Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Collected Revenue
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              ₹ {totalRevenue.toFixed(2)}
            </h3>
            <span className="text-xs text-emerald-600 font-medium">({paidBillsCount} paid)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Pending Collections
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold font-mono text-amber-700 tabular-nums">
              ₹ {pendingRevenue.toFixed(2)}
            </h3>
            <span className="text-xs text-amber-600 font-medium">({unpaidBillsCount} unpaid)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Customer Base
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {customers.length}
            </h3>
            <span className="text-xs text-slate-500">active accounts</span>
          </div>
        </div>
      </div>

      {/* Grid: Booking Status Distribution & Staff Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Appointment Status Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Breakdown of {appointments.length} total scheduled requests</p>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Confirmed Bookings</span>
                <span className="font-mono font-semibold text-slate-900">{statusCounts.Confirmed}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2 rounded-full" 
                  style={{ width: `${(statusCounts.Confirmed / Math.max(1, appointments.length)) * 100}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Completed Tasks</span>
                <span className="font-mono font-semibold text-slate-900">{statusCounts.Completed}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-600 h-2 rounded-full" 
                  style={{ width: `${(statusCounts.Completed / Math.max(1, appointments.length)) * 100}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Pending Confirmation</span>
                <span className="font-mono font-semibold text-slate-900">{statusCounts.Pending}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${(statusCounts.Pending / Math.max(1, appointments.length)) * 100}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Cancelled</span>
                <span className="font-mono font-semibold text-slate-900">{statusCounts.Cancelled}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-2 rounded-full" 
                  style={{ width: `${(statusCounts.Cancelled / Math.max(1, appointments.length)) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Staff Workload Report */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Technician Workload Allocation</h3>
            <p className="text-xs text-slate-500">Service tasks assigned to each staff member</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-medium">
                <tr>
                  <th className="py-2 px-4">Staff Name</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-4 text-right">Assigned Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map((s) => {
                  const assignedCount = appointments.filter(a => a.staffId === s.id).length;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{s.role}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-cyan-800">
                        {assignedCount} bookings
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service Popularity & Revenue Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Service Revenue & Demand Breakdown</h3>
          <p className="text-xs text-slate-500">Performance and sales volume per catalog offering</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="py-2.5 px-4">Service Offering</th>
                <th className="py-2.5 px-3 font-mono">Catalog Rate (₹)</th>
                <th className="py-2.5 px-3 text-center">Times Booked</th>
                <th className="py-2.5 px-4 text-right font-mono">Realized Revenue (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((srv) => {
                const timesBooked = appointments.filter(a => a.serviceId === srv.id).length;
                const revenue = bills
                  .filter(b => b.serviceId === srv.id && b.paymentStatus === 'Paid')
                  .reduce((acc, curr) => acc + curr.totalAmount, 0);

                return (
                  <tr key={srv.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{srv.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">₹ {srv.price.toFixed(2)}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{timesBooked}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      ₹ {revenue.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
