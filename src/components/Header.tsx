import React from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  GraduationCap, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Ambulance, 
  LayoutDashboard,
  Stethoscope,
  Users,
  FlaskConical,
  FileText,
  Building2,
  CalendarClock,
  Receipt,
  BarChart3,
  Code2
} from 'lucide-react';
import { UserSession } from '../types/hospital';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAdmit: () => void;
  onOpenBook: () => void;
  onOpenOrderLab: () => void;
  onOpenAiAssistant: () => void;
  onOpenEmergency: () => void;
  onOpenLoginModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userSession: UserSession;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenAdmit,
  onOpenBook,
  onOpenOrderLab,
  onOpenAiAssistant,
  onOpenEmergency,
  onOpenLoginModal,
  searchQuery,
  onSearchChange,
  userSession
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Bookings', icon: CalendarClock },
    { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
    { id: 'tests_reports', label: 'Tests & Reports', icon: FileText },
    { id: 'services', label: 'Services', icon: Building2 },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'code_export', label: 'Flask & MySQL Code', icon: Code2, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2 font-bold text-base tracking-tight text-slate-900 hover:text-cyan-700 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span>Hospital Management System</span>
          </button>

          <span className="hidden xl:inline text-xs text-slate-400 border-l border-slate-200 pl-3 font-mono">
            College Mini-Project
          </span>
        </div>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white font-semibold shadow-2xs'
                    : tab.highlight
                    ? 'text-cyan-700 hover:bg-cyan-50 font-medium border border-cyan-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section Actions & User */}
        <div className="flex items-center gap-2">
          {/* AI Clinical Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 hover:bg-cyan-100 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
            title="Open Gemini AI Clinical Decision Support"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden sm:inline">AI Doctor</span>
          </button>

          {/* Emergency Ambulance Dispatch Simulator */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors text-xs font-semibold cursor-pointer"
            title="Emergency Trauma Hotline & Ambulance Dispatch"
          >
            <Ambulance className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">Trauma Dispatch</span>
          </button>

          {/* User Session / Role Switcher Modal Button */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-medium cursor-pointer transition-colors"
            title="Click to switch user role or manage session"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase text-[11px] font-mono font-bold text-emerald-700">
              {userSession.role}
            </span>
          </button>

          {/* Quick Action: Admit Patient */}
          <button
            onClick={onOpenAdmit}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Admit</span>
          </button>
        </div>
      </div>

      {/* Mobile Scrollable Tabs */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-1 text-xs bg-slate-50">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                isActive ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
