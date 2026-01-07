'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ShieldCheck, Lock, Mail, ArrowRight, UserPlus, CheckCircle2, ChevronRight, Phone, MessageSquare } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'admin' | 'vendor'>('admin');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    email: role === 'admin' ? 'admin@pristonix.com' : 'apollo@tacos.com',
    password: 'password',
    phone: ''
  });

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess('Application submitted! Our team will verify your business soon.');
    }
  }, [searchParams]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to send OTP');
      setOtpSent(true);
      setSuccess('OTP Sent: 123456');
    } catch (err: any) {
      setError(err.message === 'Failed to fetch' ? 'Cannot connect to backend server' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let url = 'http://localhost:5000/api/auth/login';
      let body = {};

      if (loginMethod === 'password') {
        body = { email: formData.email, password: formData.password };
      } else {
        url = 'http://localhost:5000/api/auth/login-otp';
        body = { phone: formData.phone, otp };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Validate Role match manually if needed, or just redirect based on returned user role
      if (role === 'admin' && result.user.role !== 'super_admin' && result.user.role !== 'admin') {
        throw new Error('Unauthorized role for Admin Portal');
      }
      if (role === 'vendor' && result.user.role !== 'vendor_admin') {
        throw new Error('Unauthorized role for Vendor Portal');
      }

      localStorage.setItem('user', JSON.stringify(result.user));

      if (result.user.role === 'super_admin') router.push('/admin/dashboard');
      else if (result.user.role === 'vendor_admin') router.push('/vendor/dashboard');
      else setError('Unauthorized role for this portal');

    } catch (err: any) {
      setError(err.message === 'Failed to fetch' ? 'Cannot connect to backend server' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] z-10 p-6"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative bg-white/90 backdrop-blur-3xl border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 md:p-10 overflow-hidden">

            {/* Logo Section */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                Admin Login
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-[1px] w-4 bg-amber-500" />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Fast and Food</p>
                <div className="h-[1px] w-4 bg-amber-500" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-tight mb-6 flex items-center gap-3"
                >
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-tight mb-6 flex items-center gap-3"
                >
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Role Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200 relative">
              <div
                className={`absolute inset-y-1 transition-all duration-300 rounded-xl bg-white shadow-sm border border-slate-200 ${role === 'admin' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-6px)]'}`}
              />
              <button
                type="button"
                onClick={() => { setRole('admin'); setFormData({ ...formData, email: 'admin@pristonix.com' }); }}
                className={`flex-1 relative z-10 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${role === 'admin' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => { setRole('vendor'); setFormData({ ...formData, email: 'apollo@tacos.com' }); }}
                className={`flex-1 relative z-10 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${role === 'vendor' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Vendor Admin
              </button>
            </div>

            {/* Method Switcher */}
            <div className="flex justify-center gap-4 mb-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <button
                onClick={() => setLoginMethod('password')}
                className={`pb-1 border-b-2 transition-colors ${loginMethod === 'password' ? 'border-amber-500 text-slate-900' : 'border-transparent hover:text-slate-600'}`}
              >
                Password
              </button>
              <button
                onClick={() => setLoginMethod('otp')}
                className={`pb-1 border-b-2 transition-colors ${loginMethod === 'otp' ? 'border-amber-500 text-slate-900' : 'border-transparent hover:text-slate-600'}`}
              >
                OTP Login
              </button>
            </div>

            <form onSubmit={loginMethod === 'otp' && !otpSent ? handleSendOtp : handleLogin} className="space-y-6">

              {loginMethod === 'password' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Identity</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="text-slate-400 transition-colors group-focus-within/input:text-amber-500" size={16} />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-400"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="text-slate-400 transition-colors group-focus-within/input:text-amber-500" size={16} />
                      </div>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="text-slate-400 transition-colors group-focus-within/input:text-amber-500" size={16} />
                      </div>
                      <input
                        type="tel"
                        required
                        disabled={otpSent}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-400 disabled:opacity-50"
                        placeholder="+91 ***** *****"
                      />
                    </div>
                  </div>
                  {otpSent && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Code</label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MessageSquare className="text-slate-400 transition-colors group-focus-within/input:text-amber-500" size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-400"
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`w-full relative group/btn p-[1px] rounded-2xl bg-gradient-to-r ${role === 'admin' ? 'from-amber-500 to-orange-600' : 'from-orange-500 to-amber-600'} transition-all shadow-lg shadow-amber-500/20`}
              >
                <div className="bg-white group-hover/btn:bg-transparent transition-colors rounded-[15px] py-4 flex items-center justify-center">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-200 border-t-amber-600 rounded-full animate-spin" />
                  ) : (
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 group-hover/btn:text-white transition-colors">
                      {loginMethod === 'otp' && !otpSent ? 'Get OTP' : 'Login'} <ChevronRight size={16} />
                    </span>
                  )}
                </div>
              </motion.button>
            </form>

            <AnimatePresence>
              {role === 'vendor' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={() => router.push('/vendor/register')}
                    className="text-[10px] font-bold text-slate-500 hover:text-amber-500 transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-wider"
                  >
                    <UserPlus size={12} />
                    Apply for onboarding
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-6 border-t border-slate-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-black">
                  Secured under :: Cryptware Security
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-black text-xs tracking-widest uppercase">Initializing...</div>}>
      <LoginContent />
    </Suspense>
  );
}
