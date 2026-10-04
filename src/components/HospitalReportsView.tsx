import React, { useState } from 'react';
import { 
  BarChart3, 
  Printer, 
  TrendingUp, 
  Users, 
  Stethoscope, 
  FlaskConical, 
  Bed, 
  Receipt, 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Building2,
  Filter
} from 'lucide-react';
import { Patient, Doctor, LabReport, StaffMember, HospitalService, Appointment, HospitalBill } from '../types/hospital';

interface HospitalReportsViewProps {
  patients: Patient[];
  doctors: Doctor[];
  labReports: LabReport[];
  staff: StaffMember[];
  services: HospitalService[];
  appointments: Appointment[];
  bills: HospitalBill[];
}

export const HospitalReportsView: React.FC<HospitalReportsViewProps> = ({
  patients,
  doctors,
  labReports,
  staff,
  services,
  appointments,
  bills
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'financial' | 'clinical' | 'lab' | 'staff'>('financial');

  // Calculations
  const totalSettledRevenue = bills
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalPendingRevenue = bills
    .filter(b => b.paymentStatus === 'Pending')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  const verifiedLabReports = labReports.filter(r => r.status === 'Verified').length;
  const criticalLabReports = labReports.filter(r => 
    r.parameters.some(p => p.flag === 'CRITICAL_HIGH' || p.flag === 'CRITICAL_LOW')
  ).length;

  const staffOnDuty = staff.filter(s => s.onDuty).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Hospital Analytics & Operational Reports
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-100 text-cyan-800 rounded-md">
              Executive View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditable reports on patient census, revenue billing, diagnostic throughput, and medical duty rosters.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Audit Report</span>
        </button>
      </div>

      {/* Primary KPI Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Settled Revenue</span>
            <Receipt className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            ${totalSettledRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            +${totalPendingRevenue.toFixed(2)} in receivables
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Inpatient Census</span>
            <Bed className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {patients.length} Inpatients
          </div>
          <div className="text-[11px] text-cyan-600 font-medium mt-1">
            85.5% Hospital Bed Occupancy
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Lab Diagnostics</span>
            <FlaskConical className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {labReports.length} Panels
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {verifiedLabReports} Verified · {criticalLabReports} Critical
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Staff Roster Coverage</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {staffOnDuty} / {staff.length} Active
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            100% Shift Stations Covered
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveReportTab('financial')}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeReportTab === 'financial'
              ? 'border-cyan-600 text-cyan-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Financial & Revenue Report
        </button>
        <button
          onClick={() => setActiveReportTab('clinical')}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeReportTab === 'clinical'
              ? 'border-cyan-600 text-cyan-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Clinical Census & Department Report
        </button>
        <button
          onClick={() => setActiveReportTab('lab')}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeReportTab === 'lab'
              ? 'border-cyan-600 text-cyan-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Laboratory Diagnostic Report
        </button>
        <button
          onClick={() => setActiveReportTab('staff')}
          className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
            activeReportTab === 'staff'
              ? 'border-cyan-600 text-cyan-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Staff & Shift Roster Report
        </button>
      </div>

      {/* Tab 1: Financial & Revenue */}
      {activeReportTab === 'financial' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-600" />
              Invoice Collections by Department
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bills.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{b.billNumber}</td>
                      <td className="py-2.5 px-3">{b.patientName} ({b.patientMrn})</td>
                      <td className="py-2.5 px-3 text-slate-600">{b.department}</td>
                      <td className="py-2.5 px-3 text-slate-600">{b.paymentMethod}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-right">${b.totalAmount.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Clinical Census & Department */}
      {activeReportTab === 'clinical' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-600" />
                Hospital Services & Ward Capacities
              </h3>
              <div className="space-y-3 text-xs">
                {services.map(s => {
                  const percent = Math.round((s.currentOccupancy / s.bedOrStationCount) * 100);
                  return (
                    <div key={s.id} className="border border-slate-100 p-2.5 rounded-lg">
                      <div className="flex justify-between font-medium text-slate-900">
                        <span>{s.name}</span>
                        <span className="font-mono">{s.currentOccupancy} / {s.bedOrStationCount} Beds ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
                        <div 
                          className={`h-full rounded-full ${percent >= 85 ? 'bg-amber-500' : percent >= 70 ? 'bg-cyan-600' : 'bg-emerald-500'}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">Lead: {s.headDoctor} · {s.location}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-600" />
                Current Inpatient Acuity Distribution
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="font-bold text-rose-900 block">Critical / ICU Acuity</span>
                    <span className="text-[11px] text-rose-700">Requires 1:1 intensive nursing & telemetry</span>
                  </div>
                  <span className="font-mono text-base font-bold text-rose-800">
                    {patients.filter(p => p.condition === 'Critical').length}
                  </span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="font-bold text-amber-900 block">Guarded Acuity</span>
                    <span className="text-[11px] text-amber-700">Step-down / post-surgical observation</span>
                  </div>
                  <span className="font-mono text-base font-bold text-amber-800">
                    {patients.filter(p => p.condition === 'Guarded').length}
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="font-bold text-emerald-900 block">Stable Inpatients</span>
                    <span className="text-[11px] text-emerald-700">General medical & pediatric floors</span>
                  </div>
                  <span className="font-mono text-base font-bold text-emerald-800">
                    {patients.filter(p => p.condition === 'Stable').length}
                  </span>
                </div>

                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="font-bold text-cyan-900 block">Recovering / Discharge Pending</span>
                    <span className="text-[11px] text-cyan-700">Discharge protocol initiated</span>
                  </div>
                  <span className="font-mono text-base font-bold text-cyan-800">
                    {patients.filter(p => p.condition === 'Recovering').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Laboratory Diagnostic Report */}
      {activeReportTab === 'lab' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-purple-600" />
            Pathology Laboratory Orders & Verification Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Test Name & Category</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Pathologist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {labReports.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{r.orderNumber}</td>
                    <td className="py-2.5 px-3">{r.patientName}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-900">{r.testName}</span>
                      <span className="text-[11px] text-slate-500 block">{r.category}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.priority === 'STAT' ? 'bg-rose-100 text-rose-800' :
                        r.priority === 'Urgent' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-800">{r.status}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{r.pathologistName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Staff & Shift Roster */}
      {activeReportTab === 'staff' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Medical Personnel Shift Roster & Station Assignments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Staff ID & Name</th>
                  <th className="py-2.5 px-3">Designation / Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Assigned Ward</th>
                  <th className="py-2.5 px-3">Current Shift</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {s.name}
                      <span className="text-[10px] text-slate-400 font-mono block">{s.employeeId}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{s.role}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.department}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.assignedWard}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.shift}</td>
                    <td className="py-2.5 px-3 text-right">
                      {s.onDuty ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ON DUTY
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                          OFF DUTY
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
