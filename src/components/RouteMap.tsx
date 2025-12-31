import React from 'react';
import { Truck } from 'lucide-react';

interface RouteMapProps {
    progress: number; // 0 to 100
}

export const RouteMap: React.FC<RouteMapProps> = ({ progress }) => {
    // SVG path for a stylistic curved route
    const pathD = "M 50 150 Q 250 50 450 150";

    // Calculate truck position along the path (simplified interpolation)
    const t = progress / 100;
    const truckX = 50 + (400 * t);
    const truckY = Math.pow(1 - t, 2) * 150 + 2 * (1 - t) * t * 50 + Math.pow(t, 2) * 150;

    return (
        <div className="relative w-full h-[280px] bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden shadow-2xl group font-sans">
            {/* Satellite Grid Background */}
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* Subtle Stylistic Landmass (SVG Continents) */}
            <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none fill-slate-300">
                <path d="M150,120 Q180,100 220,130 T280,110 T350,150 T450,140 T550,180 T650,150 T750,200 L750,350 L150,350 Z" />
                <path d="M50,200 Q80,180 120,220 T200,190 T250,230 T300,210 T350,250 L350,380 L50,380 Z" />
            </svg>

            <div className="absolute inset-x-0 bottom-4 text-center z-10">
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-slate-500/50">Tactical Satellite Feed // Alpha-7 Sector</span>
            </div>

            <svg viewBox="0 0 500 250" className="w-full h-full relative z-10">
                {/* Background Radar Rings */}
                <circle cx="450" cy="150" r="40" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
                <circle cx="450" cy="150" r="80" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" />

                {/* Route Line Shadow (Glow) */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.2)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out blur-sm"
                />

                {/* Main Route Path (Base) */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Active Progress Path (The Glow Line) */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="1000"
                    strokeDashoffset={1000 - (1000 * (progress / 100))}
                    className="transition-all duration-1000 ease-out"
                />

                {/* Origin Signal */}
                <g transform="translate(50, 150)">
                    <circle r="15" className="fill-indigo-500/10 animate-ping" />
                    <circle r="4" className="fill-indigo-400" />
                    <text y="20" textAnchor="middle" className="text-[8px] font-black fill-slate-500 tracking-tighter uppercase">Origin_PT</text>
                </g>

                {/* Destination Signal */}
                <g transform="translate(450, 150)">
                    <circle r="15" className="fill-emerald-500/10 animate-pulse" />
                    <circle r="5" className="fill-emerald-500" />
                    <text y="20" textAnchor="middle" className="text-[8px] font-black fill-emerald-500/70 tracking-tighter uppercase font-mono text-xs">HUB_DC_01</text>
                </g>

                {/* Moving Truck Icon */}
                <g
                    transform={`translate(${truckX}, ${truckY})`}
                    className="transition-all duration-1000 ease-out"
                >
                    {/* Shadow/Glow under truck */}
                    <circle r="15" className="fill-indigo-400/20 blur-md" />

                    {/* Truck Background Card */}
                    <rect x="-24" y="-14" width="48" height="28" rx="6" className="fill-slate-900 border border-indigo-500/50" />
                    <rect x="-24" y="-14" width="48" height="28" rx="6" fill="none" stroke="#6366f1" strokeWidth="1" className="opacity-50" />

                    <Truck
                        size={14}
                        className="text-indigo-400"
                        style={{ transform: `translate(-7px, -7px)` }}
                    />

                    {/* Tooltip HUD */}
                    <g transform="translate(0, -32)">
                        <rect x="-20" y="-10" width="40" height="16" rx="4" className="fill-indigo-600" />
                        <text y="2" textAnchor="middle" className="text-[10px] fill-white font-mono font-bold tracking-tighter">{progress}%</text>
                    </g>
                </g>
            </svg>

            {/* HUD Overlay: Top Right Metadata */}
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl space-y-2 z-20">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sys_Status: Active</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-[8px] text-slate-500 font-mono">LAT:</span>
                    <span className="text-[8px] text-indigo-400 font-mono">40.7128N</span>
                    <span className="text-[8px] text-slate-500 font-mono">LNG:</span>
                    <span className="text-[8px] text-indigo-400 font-mono">74.0060W</span>
                </div>
            </div>

            {/* HUD Overlay: Bottom Left Legend */}
            <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                <div className="bg-slate-900/60 backdrop-blur-sm px-2 py-1 rounded border border-slate-800 text-[8px] font-mono text-slate-400 uppercase">
                    Sat_Feed: LIVE
                </div>
                <div className="bg-slate-900/60 backdrop-blur-sm px-2 py-1 rounded border border-slate-800 text-[8px] font-mono text-slate-400 uppercase">
                    30.2ms Latency
                </div>
            </div>
        </div>
    );
};
