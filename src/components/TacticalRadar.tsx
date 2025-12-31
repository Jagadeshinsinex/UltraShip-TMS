import React from 'react';
import { Target, ShieldCheck } from 'lucide-react';

export const TacticalRadar: React.FC = () => {
    return (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full group relative">
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="p-4 border-b border-slate-800 flex items-center justify-between relative z-10 bg-[#0f172ae6] backdrop-blur-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-indigo-400 animate-pulse" />
                    Fleet Coverage Radar
                </h3>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-6 min-h-[160px]">
                {/* Radar Circles */}
                <div className="absolute w-32 h-32 rounded-full border border-indigo-500/10"></div>
                <div className="absolute w-44 h-44 rounded-full border border-indigo-500/5"></div>
                <div className="absolute w-full h-full flex items-center justify-center">
                    <div className="w-[1px] h-full bg-indigo-500/5 absolute"></div>
                    <div className="h-[1px] w-full bg-indigo-500/5 absolute"></div>
                </div>

                {/* Animated Scanner */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 origin-center animate-[spin_4s_linear_infinite]"></div>

                {/* Active Hub Points */}
                <div className="relative z-10 w-full h-full">
                    <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                    <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                    <div className="absolute top-[40%] left-[10%] w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-bounce"></div>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-bold text-slate-300">Sector Secure</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-around relative z-10">
                <div className="text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Hubs</p>
                    <p className="text-xs font-black text-white">12</p>
                </div>
                <div className="text-center border-x border-slate-800 px-6">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Active</p>
                    <p className="text-xs font-black text-emerald-400">08</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Alerts</p>
                    <p className="text-xs font-black text-rose-400">01</p>
                </div>
            </div>
        </div>
    );
};
