import React, { useState } from 'react';
import { LabReport, LabCatalogItem } from '../types/hospital';
import { 
  FileText, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Plus,
  BookOpen,
  FlaskConical
} from 'lucide-react';

interface TestsReportsViewProps {
  reports: LabReport[];
  catalog: LabCatalogItem[];
  onSelectReport: (report: LabReport) => void;
  onOpenOrderLab: () => void;
  searchQuery: string;
}

export const TestsReportsView: React.FC<TestsReportsViewProps> = ({
  reports,
  catalog,
  onSelectReport,
  onOpenOrderLab,
  searchQuery: externalSearch
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'catalog'>('reports');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [flagFilter, setFlagFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const activeSearch = (externalSearch || localSearch).toLowerCase();

  const filteredReports = reports.filter((rep) => {
    const matchesSearch = !activeSearch ||
      rep.patientName.toLowerCase().includes(activeSearch) ||
      rep.patientMrn.toLowerCase().includes(activeSearch) ||
      rep.testName.toLowerCase().includes(activeSearch) ||
      rep.orderNumber.toLowerCase().includes(activeSearch) ||
      rep.doctorName.toLowerCase().includes(activeSearch);

    const hasCritical = rep.parameters.some(p => p.flag === 'CRITICAL_HIGH' || p.flag === 'CRITICAL_LOW');
    const hasAbnormal = rep.parameters.some(p => p.flag !== 'NORMAL');
    const isAllNormal = rep.parameters.every(p => p.flag === 'NORMAL');

    let matchesFlag = true;
    if (flagFilter === 'Critical') matchesFlag = hasCritical;
    else if (flagFilter === 'Abnormal') matchesFlag = hasAbnormal;
    else if (flagFilter === 'Normal') matchesFlag = isAllNormal;

    const matchesCategory = categoryFilter === 'All' || rep.category === categoryFilter;

    return matchesSearch && matchesFlag && matchesCategory;
  });

  const filteredCatalog = catalog.filter((item) => {
    return !activeSearch ||
      item.name.toLowerCase().includes(activeSearch) ||
      item.code.toLowerCase().includes(activeSearch) ||
      item.category.toLowerCase().includes(activeSearch) ||
      item.commonIndications.toLowerCase().includes(activeSearch);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Diagnostic Tests Catalog & Clinical Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified pathology reports with biological reference intervals, flags, and diagnostic test compendium.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenOrderLab}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Order Test Panel
          </button>
        </div>
      </div>

      {/* Segmented Top Navigation: Reports Archive vs Catalog */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient Reports Archive ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diagnostic Test Catalog ({catalog.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by test, patient, MRN..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
          />
        </div>
      </div>

      {/* View 1: Patient Reports Archive */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Result Flag:</span>
              <div className="flex items-center gap-1">
                {['All', 'Critical', 'Abnormal', 'Normal'].map(flag => (
                  <button
                    key={flag}
                    onClick={() => setFlagFilter(flag)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      flagFilter === flag 
                        ? 'bg-slate-900 text-white font-medium' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Hematology">Hematology</option>
                <option value="Cardiology Diagnostic">Cardiology</option>
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                    <th className="py-2.5 px-4">Report / Order ID</th>
                    <th className="py-2.5 px-3">Patient Demographics</th>
                    <th className="py-2.5 px-3">Test Name & Code</th>
                    <th className="py-2.5 px-3">Referring Doctor</th>
                    <th className="py-2.5 px-3 text-center">Diagnostic Finding</th>
                    <th className="py-2.5 px-3">Verification Date</th>
                    <th className="py-2.5 px-4 text-right">Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => {
                    const hasCritical = report.parameters.some(p => p.flag === 'CRITICAL_HIGH' || p.flag === 'CRITICAL_LOW');
                    const hasHighOrLow = report.parameters.some(p => p.flag === 'HIGH' || p.flag === 'LOW');

                    return (
                      <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono font-semibold text-slate-900">{report.orderNumber}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Priority: <span className={report.priority === 'STAT' ? 'text-rose-700 font-bold' : ''}>{report.priority}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-900">{report.patientName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {report.patientMrn} · {report.patientAge}y · {report.patientGender}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{report.testName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{report.testCode} · {report.category}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {report.doctorName}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {hasCritical ? (
                            <span className="font-bold text-rose-700 font-mono text-[11px]">
                              ▲▲ CRITICAL ALERT
                            </span>
                          ) : hasHighOrLow ? (
                            <span className="font-semibold text-amber-800 font-mono text-[11px]">
                              ▲ Abnormal Range
                            </span>
                          ) : (
                            <span className="font-medium text-emerald-700 font-mono text-[11px]">
                              ● Normal Reference
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                          {report.reportedAt || 'Processing in progress'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectReport(report)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Digital Report
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-500">
                No reports match your search or filter options.
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Diagnostic Test Catalog */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-900">
                    ${item.standardFee}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.category}</p>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Specimen:</span>
                    <span className="font-medium text-slate-800 text-right">{item.specimen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Turnaround:</span>
                    <span className="font-mono text-slate-800">{item.turnaroundTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fasting:</span>
                    <span className="font-medium text-slate-800">
                      {item.fastingRequired ? 'Yes (8-12 hrs)' : 'No fasting required'}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  <strong>Indications:</strong> {item.commonIndications}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={onOpenOrderLab}
                  className="w-full py-1.5 text-xs font-medium text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Order This Test Panel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
