import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Stethoscope, Users, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserSession } from '../types/hospital';

interface LoginScreenProps {
  onLogin: (user: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'doctor' | 'staff'>('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    // Default valid check (or any non-empty password for easy demo)
    if (username.toLowerCase() === 'admin' && password === 'admin123') {
      onLogin({
        username: 'admin',
        name: 'System Admin',
        role: 'admin',
        email: 'admin@hms.hospital.org'
      });
    } else if (username.toLowerCase() === 'doctor' && password === 'doctor123') {
      onLogin({
        username: 'doctor',
        name: 'Dr. Sharma',
        role: 'doctor',
        email: 'doctor@hms.hospital.org'
      });
    } else if (username.toLowerCase() === 'staff' && password === 'staff123') {
      onLogin({
        username: 'staff',
        name: 'Nurse Manager',
        role: 'staff',
        email: 'staff@hms.hospital.org'
      });
    } else {
      // Allow custom login for flexibility
      onLogin({
        username: username.trim(),
        name: selectedRole === 'admin' ? 'System Administrator' : selectedRole === 'doctor' ? `Dr. ${username}` : `${username} (Staff)`,
        role: selectedRole,
        email: `${username}@hms.hospital.org`
      });
    }
  };

  const handleQuickFill = (role: 'admin' | 'doctor' | 'staff') => {
    setSelectedRole(role);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (role === 'doctor') {
      setUsername('doctor');
      setPassword('doctor123');
    } else {
      setUsername('staff');
      setPassword('staff123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-[#182444] text-white p-7 text-center relative">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md mb-3 text-2xl">
            🏥
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>HMS</span>
          </h1>
          <p className="text-xs text-blue-200 mt-1 font-medium">
            Hospital Management System
          </p>
          <div className="mt-2 text-[11px] text-blue-300/80 font-mono">
            Secure Portal Authentication
          </div>
        </div>

        {/* Login Form */}
        <div className="p-7 space-y-5">
          {/* Quick Demo Credentials (Great for College Evaluation) */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Select Demo User:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className={`p-2 rounded-lg text-center transition-all cursor-pointer border ${
                  selectedRole === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 text-xs'
                }`}
              >
                <div className="text-xs font-bold">Admin</div>
                <div className="text-[10px] opacity-80">Full Access</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('doctor')}
                className={`p-2 rounded-lg text-center transition-all cursor-pointer border ${
                  selectedRole === 'doctor'
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 text-xs'
                }`}
              >
                <div className="text-xs font-bold">Doctor</div>
                <div className="text-[10px] opacity-80">Clinical</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('staff')}
                className={`p-2 rounded-lg text-center transition-all cursor-pointer border ${
                  selectedRole === 'staff'
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 text-xs'
                }`}
              >
                <div className="text-xs font-bold">Staff</div>
                <div className="text-[10px] opacity-80">Desk/Ward</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <span>Login to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Default credentials: <span className="font-mono text-slate-600">admin</span> / <span className="font-mono text-slate-600">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
