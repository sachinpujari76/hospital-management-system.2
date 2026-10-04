import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, Stethoscope, Users, LogIn, CheckCircle2 } from 'lucide-react';
import { UserSession } from '../types/hospital';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  onLogin: (user: UserSession) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'doctor' | 'staff'>('admin');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    const newUser: UserSession = {
      username: username.toLowerCase().trim(),
      name: role === 'admin' ? 'Chief Admin Officer' : role === 'doctor' ? 'Dr. Attending Physician' : 'Senior Staff Nurse',
      role,
      email: `${username.toLowerCase().trim()}@hospital.org`
    };

    onLogin(newUser);
    setError('');
    onClose();
  };

  const handleQuickLogin = (demoRole: 'admin' | 'doctor' | 'staff') => {
    if (demoRole === 'admin') {
      onLogin({
        username: 'admin',
        name: 'Chief Admin Dr. Sarah Miller',
        role: 'admin',
        email: 'admin@hospital.org'
      });
    } else if (demoRole === 'doctor') {
      onLogin({
        username: 'doctor',
        name: 'Dr. Elena Vance (Cardiology)',
        role: 'doctor',
        email: 'e.vance@hospital.org'
      });
    } else {
      onLogin({
        username: 'staff',
        name: 'Nurse Manager Rachel Kim',
        role: 'staff',
        email: 'r.kim@hospital.org'
      });
    }
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Hospital System Authentication
              </h2>
              <p className="text-[11px] text-slate-400">
                Current Session: <span className="text-cyan-400 font-semibold uppercase">{currentUser.role}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* 1-Click Quick Demo Sign-In (For College Presentation) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block mb-2">
              🎓 1-Click Quick Demo Sign-In (For College Presentation):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-400 rounded-lg text-center transition-colors cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <span className="font-bold text-slate-900 block text-[11px]">Admin</span>
                <span className="text-[10px] text-slate-400">Full Control</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('doctor')}
                className="p-2 bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-400 rounded-lg text-center transition-colors cursor-pointer shadow-2xs"
              >
                <Stethoscope className="w-4 h-4 mx-auto text-cyan-600 mb-1" />
                <span className="font-bold text-slate-900 block text-[11px]">Doctor</span>
                <span className="text-[10px] text-slate-400">Clinical OPD</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff')}
                className="p-2 bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-400 rounded-lg text-center transition-colors cursor-pointer shadow-2xs"
              >
                <Users className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                <span className="font-bold text-slate-900 block text-[11px]">Staff</span>
                <span className="text-[10px] text-slate-400">Ward & Desk</span>
              </button>
            </div>
          </div>

          <div className="relative my-2 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-2 text-[11px] text-slate-400 uppercase font-mono">
              or standard credentials
            </span>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[11px] font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="admin">Administrator (System & Finance)</option>
                <option value="doctor">Medical Doctor / Surgeon</option>
                <option value="staff">Clinical Staff / Nursing</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Username</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="admin or doctor"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="text-slate-500 hover:text-rose-600 transition-colors font-medium text-xs cursor-pointer"
              >
                Log Out Current Session
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
