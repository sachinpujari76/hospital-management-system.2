import React from 'react';
import { 
  Wrench, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Cog, 
  CalendarCheck, 
  Receipt, 
  BarChart3, 
  Code2, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  User 
} from 'lucide-react';
import { UserSession } from '../../types/serviceSystem';

interface ServiceHeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userSession: UserSession;
  onToggleRole: () => void;
  onOpenAiAssistant: () => void;
  onOpenNewBooking: () => void;
  onOpenNewBill: () => void;
}

export const ServiceHeader: React.FC<ServiceHeaderProps> = ({
  currentTab,
  onTabChange,
  userSession,
  onToggleRole,
  onOpenAiAssistant,
  onOpenNewBooking,
  onOpenNewBill
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'staff', label: 'Staff', icon: UserCheck },
    { id: 'services', label: 'Services', icon: Cog },
    { id: 'appointments', label: 'Bookings', icon: CalendarCheck },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'code_export', label: 'Flask & MySQL Code', icon: Code2, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2 font-bold text-base tracking-tight text-white hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <span>SmartService</span>
          </button>
          <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-700 pl-3 font-mono">
            BTech Mini-Project
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white font-semibold shadow-xs'
                    : tab.highlight
                    ? 'text-cyan-300 hover:bg-slate-800 hover:text-cyan-200 border border-cyan-700/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section Actions & User */}
        <div className="flex items-center gap-2.5">
          {/* AI Diagnostic Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 transition-colors text-xs font-semibold cursor-pointer"
            title="Open AI Service Diagnostics"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">AI Diagnostics</span>
          </button>

          {/* Role Switcher */}
          <button
            onClick={onToggleRole}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium hover:bg-slate-700 cursor-pointer"
            title="Click to toggle between Admin and Staff mode"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase text-[11px] font-mono font-bold text-emerald-400">
              {userSession.role}
            </span>
          </button>

          {/* Quick Create Buttons */}
          <button
            onClick={onOpenNewBooking}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            + Booking
          </button>
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800 gap-1 text-xs bg-slate-950/40">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md whitespace-nowrap ${
                isActive ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
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
