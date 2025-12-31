import React from 'react';
import { Activity, CheckCircle2, AlertCircle, MapPin, Map as MapIcon } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'status' | 'alert' | 'route' | 'delivered';
    title: string;
    time: string;
    description: string;
}

const activities: ActivityItem[] = [
    { id: '1', type: 'status', title: 'Route Optimization complete', time: '2m ago', description: 'Shipment #4582 optimized for fuel efficiency.' },
    { id: '2', type: 'delivered', title: 'Delivered', time: '15m ago', description: 'Amazon India (SH-102) successfully delivered to Regional DC.' },
    { id: '3', type: 'alert', title: 'Delay Warning', time: '45m ago', description: 'Heavy traffic on NH-44 affecting 4 active shipments.' },
    { id: '4', type: 'route', title: 'New Dispatch', time: '1h ago', description: 'Reliance Ind. shipment SH-904 picked up from Primary Hub.' },
];

export const LiveActivityFeed: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-indigo-600" />
                    Live Operations Feed
                </h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activities.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start group">
                        <div className="mt-1">
                            {item.type === 'status' && <MapIcon size={14} className="text-blue-500" />}
                            {item.type === 'delivered' && <CheckCircle2 size={14} className="text-emerald-500" />}
                            {item.type === 'alert' && <AlertCircle size={14} className="text-rose-500" />}
                            {item.type === 'route' && <MapPin size={14} className="text-amber-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <p className="text-[11px] font-bold text-slate-800 truncate">{item.title}</p>
                                <span className="text-[9px] font-medium text-slate-400 shrink-0">{item.time}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="p-3 text-[10px] font-bold text-indigo-600 text-center border-t border-slate-100 hover:bg-slate-50 transition-colors uppercase tracking-widest">
                View Full Logs
            </button>
        </div>
    );
};
