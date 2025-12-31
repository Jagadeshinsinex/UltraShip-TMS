import React from 'react';
import type { Shipment } from '../types';
import { ChevronLeft, Package, MapPin, Truck, User, Clock, Thermometer, Droplets, Zap, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { useToast } from '../context/ToastContext';
import { RouteMap } from './RouteMap';

interface ShipmentDetailProps {
    shipment: Shipment;
    onBack: () => void;
}

export const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment, onBack }) => {
    const { showToast } = useToast();

    // Map Progress to Steps
    const currentStep = shipment.attendance >= 100 ? 4 : shipment.attendance > 50 ? 3 : shipment.attendance > 0 ? 2 : 1;
    const steps = ['Ordered', 'Picked Up', 'In Transit', 'Delivered'];

    // Simulated Sensor Data
    const sensors = [
        { label: 'Ambient Temp', icon: Thermometer, value: '22.4°C', status: 'Optimal', color: 'text-emerald-500' },
        { label: 'Humidity', icon: Droplets, value: '45%', status: 'Stable', color: 'text-blue-500' },
        { label: 'Fleet Fuel', icon: Zap, value: '82%', status: 'Efficient', color: 'text-amber-500' },
        { label: 'G-Force/Shock', icon: Activity, value: '0.02G', status: 'Safe', color: 'text-indigo-500' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="border-b border-slate-100 p-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-4 transition-colors"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Shipments
                </button>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shipment {shipment.id}</h2>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-widest shadow-sm">
                                {shipment.attendance >= 100 ? 'Delivered' : 'Live Tracking'}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium">Global Logistics System ID: <span className="text-slate-900 font-bold">{shipment.id.toUpperCase()}</span></p>
                    </div>
                    <div className="flex items-center gap-3 self-end md:self-center">
                        <button
                            onClick={() => showToast("Invoice Download Started...", 'success')}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-xs shadow-sm uppercase tracking-wider"
                        >
                            Download Manifest
                        </button>
                        <button
                            onClick={() => showToast(`Tracking Real-time Location for: ${shipment.id}`, 'success')}
                            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-wider"
                        >
                            Contact Carrier
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Map Component */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={16} className="text-indigo-500" />
                        Dynamic Route Tracking
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span>Route Path</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span>Active Node</span>
                        </div>
                    </div>
                </div>
                <RouteMap progress={shipment.attendance} />
            </div>

            {/* Timeline */}
            <div className="p-8 border-b border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <div className="relative flex justify-between">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step, index) => {
                            const isActive = index + 1 <= currentStep;
                            return (
                                <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                                    <div
                                        className={clsx(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                                            isActive
                                                ? "bg-indigo-600 border-indigo-100 text-white shadow-lg shadow-indigo-200"
                                                : "bg-white border-slate-100 text-slate-300"
                                        )}
                                    >
                                        {index === 0 && <Package size={18} />}
                                        {index === 1 && <Truck size={18} />}
                                        {index === 2 && <MapPin size={18} />}
                                        {index === 3 && <User size={18} />}
                                    </div>
                                    <span className={clsx(
                                        "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                                        isActive ? "text-slate-800" : "text-slate-400"
                                    )}>
                                        {step}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Detail Grid */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Manifest Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Freight Class</p>
                                    <div className="flex items-center gap-2">
                                        <Package size={18} className="text-indigo-500" />
                                        <p className="text-lg font-bold text-slate-800">{shipment.class}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Standard logistics classification</p>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Transit Duration</p>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} className="text-indigo-500" />
                                        <p className="text-lg font-bold text-slate-800">{shipment.age} Days</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Calculated from dispatch timestamp</p>
                                </div>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Itemized Inventory</p>
                                <div className="flex flex-wrap gap-2">
                                    {shipment.subjects.map(item => (
                                        <span key={item} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-sm">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sensor Widgets */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {sensors.map(sensor => (
                            <div key={sensor.label} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors group">
                                <sensor.icon size={20} className={clsx("mb-3 transition-transform group-hover:scale-110", sensor.color)} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{sensor.label}</p>
                                <p className="text-base font-bold text-slate-800 my-0.5">{sensor.value}</p>
                                <p className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {sensor.status}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Stats */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-indigo-800 to-indigo-950 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Master Status</p>
                                <Activity size={16} className="text-indigo-300 animate-pulse" />
                            </div>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-5xl font-bold tracking-tighter">{shipment.attendance}%</span>
                                <span className="text-indigo-300 text-sm font-medium mb-2">COMPLETE</span>
                            </div>
                            <div className="space-y-3">
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-indigo-400 h-2 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.5)] transition-all duration-1000"
                                        style={{ width: `${shipment.attendance}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-indigo-300 font-medium">ESTIMATED ARRIVAL IN: {(100 - shipment.attendance) / 10} HOURS</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Operational Summary</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">Carrier Verification</span>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PASSED</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">Inventory Sync</span>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">SYNCED</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">Route Optimization</span>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ACTIVE</span>
                            </div>
                            <div className="pt-4 mt-2 border-t border-slate-50 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <User size={14} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-800">Assigned Dispatcher</p>
                                    <p className="text-[10px] text-slate-500">Michael S. (Unit 12)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
