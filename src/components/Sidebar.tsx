import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { UserSession } from '../types/hospital';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userSession: UserSession;
  onLogout: () => void;
  onOpenAiAssistant: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  userSession,
  onLogout,
  onOpenAiAssistant
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'patients', label: 'Patients', icon: '🧑' },
    { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'appointments', label: 'Appointments', icon: '🗓️' },
    { id: 'billing', label: 'Billing', icon: '💰' },
    { id: 'pharmacy', label: 'Pharmacy', icon: '💊' },
    { id: 'laboratory', label: 'Laboratory', icon: '🧪' },
    { id: 'rooms_beds', label: 'Rooms & Beds', icon: '🛏️' },
    { id: 'staff', label: 'Staff', icon: '👥' }
  ];

  return (
    <aside className="w-60 shrink-0 bg-[#182444] text-white flex flex-col justify-between min-h-screen sticky top-0 z-30 select-none shadow-lg">
      <div>
        {/* Brand Header */}
        <div className="pt-6 pb-5 px-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-xl shadow-xs">
              🏥
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-white leading-none">
                HMS
              </div>
              <div className="text-[11px] text-blue-200/80 font-medium mt-1">
                Hospital Management
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md translate-x-1'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: AI Doctor & User Profile */}
      <div className="p-4 border-t border-slate-700/50 space-y-2.5">
        {/* AI Doctor Assistant Button */}
        <button
          onClick={onOpenAiAssistant}
          className="w-full py-2 px-3 bg-linear-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 border border-cyan-400/40 text-cyan-200 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-all shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
            <span>AI Doctor</span>
          </span>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">
            Gemini
          </span>
        </button>

        {/* Logged in User Bar */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-blue-200">
              {userSession.name.charAt(0)}
            </div>
            <div className="truncate">
              <div className="text-[11px] font-semibold text-white truncate">{userSession.name}</div>
              <div className="text-[10px] text-blue-300 uppercase font-mono">{userSession.role}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
