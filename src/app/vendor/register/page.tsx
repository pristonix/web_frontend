'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, Store, ArrowRight, CheckCircle2, ChevronLeft, UtensilsCrossed, MapPin, FileText, Upload } from 'lucide-react';

export default function VendorRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        phone_number: '',
        business_name: '',
        description: '',
        city: '',
        fssai_license: '',
        gst_number: '',
        logo_url: '',
        role: 'vendor_admin',
        service_type: 'food'
    });

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone_number })
            });
            const result = await res.json();
            if (res.ok) {
                setStep(2);
            } else {
                setError(result.error || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone_number, otp: otp.join('') })
            });
            const result = await res.json();
            if (res.ok) {
                setStep(3);
            } else {
                setError(result.error || 'Invalid OTP');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Append extra details to description for now since DB schema is fixed
            const extendedDescription = JSON.stringify({
                desc: formData.description,
                city: formData.city,
                fssai: formData.fssai_license,
                gst: formData.gst_number
            });

            const payload = {
                ...formData,
                description: extendedDescription
            };

            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Registration failed');
            }

            router.push('/?registered=true');

        } catch (err: any) {
            setError(err.message === 'Failed to fetch' ? 'Cannot connect to backend server' : err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-900 relative overflow-hidden font-sans p-6">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[600px] z-10"
            >
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative bg-white/90 backdrop-blur-3xl border border-slate-200 rounded-[2rem] shadow-2xl p-8 md:p-10 overflow-hidden">

                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-2">
                                Partner Onboarding
                            </h1>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                Step {step} of 3 • {step === 1 ? 'Mobile Verification' : step === 2 ? 'Verify OTP' : 'Business Details'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* Step 1: Phone Number */}
                            {step === 1 && (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handlePhoneSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="text-slate-400 group-focus-within/input:text-amber-500 transition-colors" size={16} />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone_number}
                                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-400"
                                                placeholder="+91 ***** *****"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || formData.phone_number.length < 10}
                                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Sending...' : 'Get OTP'} <ArrowRight size={16} />
                                    </button>
                                </motion.form>
                            )}

                            {/* Step 2: OTP Verification */}
                            {step === 2 && (
                                <motion.form
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleOtpVerify}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2 text-center">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enter Verification Code</label>
                                        <p className="text-xs text-slate-400 mb-4">Sent to {formData.phone_number}</p>
                                        <div className="flex justify-center gap-3">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    id={`otp-${i}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                />
                                            ))}
                                        </div>
                                        {error && <p className="text-red-500 text-xs font-bold mt-2">{error}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || otp.join('').length < 6}
                                        className="w-full bg-amber-500 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Continue'}
                                    </button>
                                </motion.form>
                            )}

                            {/* Step 3: Registration Details */}
                            {step === 3 && (
                                <motion.form
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleRegister}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Business Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.business_name}
                                                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                placeholder="Restaurant Name"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Owner Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Type</label>
                                        <select
                                            value={formData.service_type}
                                            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        >
                                            <option value="food">Food Delivery</option>
                                            <option value="logistics">Package Logistics</option>
                                        </select>
                                    </div>


                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                placeholder="e.g. Mumbai"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {formData.service_type === 'food' && (
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">FSSAI License</label>
                                                <input
                                                    type="text"
                                                    value={formData.fssai_license}
                                                    onChange={(e) => setFormData({ ...formData, fssai_license: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                    placeholder="License No."
                                                />
                                            </div>
                                        )}
                                        <div className={`space-y-1 ${formData.service_type !== 'food' ? 'col-span-2' : ''}`}>
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">GST Number</label>
                                            <input
                                                type="text"
                                                value={formData.gst_number}
                                                onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                placeholder="GSTIN"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Details / Cuisine</label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            placeholder="e.g. Italian, Chinese..."
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Logo URL</label>
                                        <input
                                            type="url"
                                            value={formData.logo_url}
                                            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                placeholder="Password"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Registering...' : 'Complete Registration'} <CheckCircle2 size={16} />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div >
        </div >
    );
}
