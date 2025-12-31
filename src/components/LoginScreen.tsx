import { useState } from 'react';
import { Shield, Users, Briefcase, Loader2, User as UserIcon, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = () => {
    const { login } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const handleLogin = async (role: 'ADMIN' | 'EMPLOYEE') => {
        setSelectedRole(role);
        setIsLoggingIn(true);
        // Simulate a slight network delay for professional feel (0.8s)
        await new Promise(resolve => setTimeout(resolve, 800));
        await login(role);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="bg-white rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden max-w-4xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-700 border border-slate-800/10 relative z-10">

                {/* Visual Side */}
                <div className="w-full md:w-[45%] bg-indigo-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
                    {/* High-Tech Grid & Map Pattern */}
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <Globe size={400} className="absolute -bottom-20 -left-20 text-white opacity-20" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                                <Briefcase className="text-white" size={24} strokeWidth={2.5} />
                            </div>
                            <span className="font-black text-2xl tracking-tighter uppercase">UltraShip TMS</span>
                        </div>
                        <h1 className="text-4xl font-black mb-6 leading-[1.1] tracking-tight">Enterprise Logistics Management</h1>
                        <p className="text-indigo-100 text-lg font-medium leading-relaxed opacity-90">Secure, efficient, and role-based control for your entire fleet operations.</p>

                        <div className="mt-10 flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest">Global Fleet</div>
                            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest">Real-time Sync</div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] font-bold text-indigo-200/80 uppercase tracking-widest">
                        <span>© 2025 UltraShip Logistics Inc.</span>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            Cluster: Asia-04
                        </div>
                    </div>
                </div>

                {/* Selection Side */}
                <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center bg-slate-50 relative">
                    {isLoggingIn && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                            <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Authenticating {selectedRole}...</p>
                        </div>
                    )}

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Control</h2>
                        <p className="text-slate-500 mt-2 font-medium">Identify your security profile to continue.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Demo Username Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current Session User</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    readOnly
                                    value="Jagadesh S"
                                    className="w-full bg-white border border-slate-200 px-12 py-3.5 rounded-xl text-sm font-bold text-slate-800 shadow-sm focus:ring-0 outline-none cursor-default group-hover:border-slate-300 transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200">VERIFIED</span>
                            </div>
                        </div>

                        <div className="pt-2 space-y-4">
                            <button
                                onClick={() => handleLogin('ADMIN')}
                                className="w-full bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-600 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300 group text-left relative overflow-hidden"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <Shield size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Admin Level</h3>
                                            <span className="text-[10px] font-black text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">FULL ACCESS</span>
                                        </div>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">Full operational control: Create, Edit, & Dispatch.</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleLogin('EMPLOYEE')}
                                className="w-full bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-600 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300 group text-left"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <Users size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Staff Level</h3>
                                            <span className="text-[10px] font-black text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">READ ONLY</span>
                                        </div>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">Operational oversight and shipment tracking only.</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 pt-8 border-t border-slate-200/60 flex items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Engine</p>
                            <p className="text-[11px] font-bold text-slate-600 mt-0.5">v1.0.4-stable</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">System Status: Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
