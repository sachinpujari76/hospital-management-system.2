import React, { useState } from 'react';
import { HospitalService } from '../types/hospital';
import { 
  Building2, 
  Stethoscope, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Ambulance, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Bed,
  Plus
} from 'lucide-react';

interface ServicesViewProps {
  services: HospitalService[];
  onOpenAdmit: () => void;
  onOpenBook: () => void;
  onTriggerEmergency: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onOpenAdmit,
  onOpenBook,
  onTriggerEmergency
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedServiceModal, setSelectedServiceModal] = useState<HospitalService | null>(null);

  const categories = [
    'All',
    'Emergency & Trauma',
    'Critical Care',
    'Surgical Services',
    'Diagnostics & Imaging',
    'Support Services'
  ];

  const filteredServices = services.filter((srv) => {
    return selectedCategory === 'All' || srv.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Hospital Clinical Services & Specialized Units
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            24/7 Level 1 Trauma care, intensive care pods, robotic surgical suites, and diagnostic cores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerEmergency}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Ambulance className="w-3.5 h-3.5" />
            Trauma Dispatch Hotline
          </button>
        </div>
      </div>

      {/* Emergency Center Hero Feature Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            24/7 EMERGENCY & LEVEL 1 TRAUMA CARE CENTER
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Immediate Resuscitation & Rapid Medical Intervention
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Staffed round-the-clock by board-certified emergency medicine physicians, trauma surgeons, and critical care transport teams. Equipped with integrated point-of-care CT diagnostics and direct rooftop helipad connection.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onTriggerEmergency}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Alert Trauma Bay Team
            </button>
            <button
              onClick={onOpenAdmit}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Direct Emergency Admission
            </button>
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-right font-mono text-xs text-slate-400 space-y-1 border-l border-slate-800 pl-6">
          <p className="text-slate-200 font-bold text-sm">Emergency Bay Stats</p>
          <p>Trauma Bays: <span className="text-slate-100 font-bold">32 Ready</span></p>
          <p>Ambulances Active: <span className="text-emerald-400 font-bold">6 Units</span></p>
          <p>Avg Door-to-Doctor: <span className="text-cyan-400 font-bold">12 Mins</span></p>
          <p>Helipad Status: <span className="text-emerald-400 font-bold">Operational</span></p>
        </div>
      </div>

      {/* Category Segmented Control */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <span className="text-slate-400 font-medium mr-2">Service Sector:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => {
          const occupancyPercent = Math.round((service.currentOccupancy / service.bedOrStationCount) * 100);

          return (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono text-cyan-800 font-semibold bg-cyan-50 px-2 py-0.5 rounded">
                    {service.category}
                  </span>
                  {service.emergencyAvailable24x7 && (
                    <span className="text-[11px] font-mono text-rose-700 font-semibold">
                      24/7 Available
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1">{service.name}</h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {service.location}
                </p>

                {/* Capacity progress */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Bed / Station Capacity</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {service.currentOccupancy} / {service.bedOrStationCount} ({occupancyPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        occupancyPercent > 85 ? 'bg-amber-600' : 'bg-cyan-600'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Director & Contact */}
                <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Service Director:</span>
                    <span className="font-medium text-slate-800">{service.headDoctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Phone:</span>
                    <span className="font-mono text-slate-800">{service.contactDirect}</span>
                  </div>
                </div>

                {/* Equipments chips */}
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700 block mb-1">Key Diagnostic Technology:</span>
                  <div className="flex flex-wrap gap-1">
                    {service.keyEquipments.map((eq, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={onOpenAdmit}
                  className="w-full py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Admit to this Unit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
