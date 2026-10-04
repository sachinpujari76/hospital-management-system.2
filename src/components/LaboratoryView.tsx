import React, { useState } from 'react';
import { LabReport, LabCatalogItem } from '../types/hospital';
import { 
  FlaskConical, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  RotateCw, 
  Plus, 
  FileSearch,
  Barcode,
  Thermometer,
  Layers
} from 'lucide-react';

interface LaboratoryViewProps {
  labReports: LabReport[];
  catalog: LabCatalogItem[];
  onOpenOrderLab: () => void;
  onSelectReport: (report: LabReport) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
}

export const LaboratoryView: React.FC<LaboratoryViewProps> = ({
  labReports,
  catalog,
  onOpenOrderLab,
  onSelectReport,
  onAdvanceOrderStatus
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const analyzers = [
    {
      name: 'Roche Cobas 8000 Core',
      type: 'Clinical Chemistry & Immunoassay',
      status: 'Online · Operational',
      currentThroughput: '1,140 tests/hr',
      reagentLevel: '92%',
      temp: '37.0°C ±0.1',
      lastCalibration: 'Today 04:00 AM'
    },
    {
      name: 'Sysmex XN-9000 Automation',
      type: 'Multi-Parameter Hematology',
      status: 'Online · Operational',
      currentThroughput: '480 samples/hr',
      reagentLevel: '86%',
      temp: '22.4°C Ambient',
      lastCalibration: 'Today 06:15 AM'
    },
    {
      name: 'Beckman Coulter DxC 700 AU',
      type: 'High-Throughput Clinical Chemistry',
      status: 'Online · Running Batch',
      currentThroughput: '800 tests/hr',
      reagentLevel: '78%',
      temp: '37.1°C',
      lastCalibration: 'Yesterday 18:00 PM'
    },
    {
      name: 'Bio-Rad CFX96 Deep Well',
      type: 'Real-Time PCR Molecular Core',
      status: 'Thermocycling Run (Cycle 28/40)',
      currentThroughput: '96 wells active',
      reagentLevel: '100%',
      temp: '95.0°C Denature',
      lastCalibration: '2026-10-01'
    }
  ];

  const filteredOrders = labReports.filter(order => {
    const matchesCategory = filterCategory === 'All' || order.category === filterCategory;
    const matchesPriority = filterPriority === 'All' || order.priority === filterPriority;
    return matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Central Pathology & Diagnostic Laboratory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specimen accessioning, automated clinical analyzers, and electronic verification.
          </p>
        </div>

        <button
          onClick={onOpenOrderLab}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Order Lab Panel
        </button>
      </div>

      {/* Laboratory Automated Analyzers Status Strip */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-slate-500" />
          Automated Diagnostic Analyzer Fleet Telemetry
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyzers.map((inst, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{inst.name}</span>
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">Nominal</span>
              </div>
              <p className="text-[11px] text-slate-500">{inst.type}</p>
              
              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Throughput:</span>
                  <span className="text-slate-900 font-semibold">{inst.currentThroughput}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Reagent Core:</span>
                  <span className="text-slate-900">{inst.reagentLevel}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Core Temp:</span>
                  <span className="text-slate-900">{inst.temp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Worklist & Accessioning Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Accessioning Queue & Worklist</h3>
            <p className="text-xs text-slate-500">Live specimen progress from phlebotomy collection to pathologist signoff</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Priority:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="STAT">STAT Only</option>
                <option value="Urgent">Urgent</option>
                <option value="Routine">Routine</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Hematology">Hematology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Cardiology Diagnostic">Cardiology</option>
              </select>
            </div>
          </div>
        </div>

        {/* Worklist Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                <th className="py-2.5 px-4">Specimen Barcode / Order</th>
                <th className="py-2.5 px-3">Patient / Demographics</th>
                <th className="py-2.5 px-3">Test Panel</th>
                <th className="py-2.5 px-3">Specimen Matrix</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Current Pipeline Stage</th>
                <th className="py-2.5 px-4 text-right">Laboratory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const isStat = order.priority === 'STAT';
                const isVerified = order.status === 'Verified';

                return (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-slate-900">{order.orderNumber}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Barcode className="w-3.5 h-3.5" />
                        {order.specimenBarcode}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900">{order.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {order.patientMrn} · {order.patientAge}y · {order.patientGender}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{order.testName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Code: {order.testCode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {order.specimenType}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-mono text-xs font-semibold ${isStat ? 'text-rose-700' : 'text-slate-700'}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-medium">
                        {order.status === 'Verified' && (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Reported
                          </span>
                        )}
                        {order.status === 'Analyzing' && (
                          <span className="text-cyan-700 flex items-center gap-1">
                            <RotateCw className="w-3.5 h-3.5 animate-spin" /> In Analyzer
                          </span>
                        )}
                        {order.status === 'Sample Received' && (
                          <span className="text-indigo-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Accessioned / Centrifuge
                          </span>
                        )}
                        {order.status === 'Pending Review' && (
                          <span className="text-amber-700 flex items-center gap-1">
                            <FileSearch className="w-3.5 h-3.5" /> Awaiting Pathologist
                          </span>
                        )}
                        {order.status === 'Pending Sample' && (
                          <span className="text-slate-400">Sample Pending Collection</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {!isVerified && (
                        <button
                          onClick={() => onAdvanceOrderStatus(order.id)}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                          title="Advance stage in laboratory workflow"
                        >
                          Advance Stage
                        </button>
                      )}
                      <button
                        onClick={() => onSelectReport(order)}
                        className="px-2.5 py-1 text-[11px] font-medium text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-md transition-colors cursor-pointer"
                      >
                        View Report
                      </button>
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
