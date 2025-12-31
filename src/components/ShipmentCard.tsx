import React, { useState } from 'react';
import type { Shipment } from '../types';
import { MoreVertical, MapPin, Package } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from './StatusBadge';


interface ShipmentCardProps {
    shipment: Shipment;
    onClick: () => void;
    onEdit?: () => void;
    onDelete?: (id: string) => void;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment, onClick, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const { showToast } = useToast();

    const status = shipment.attendance >= 100 ? 'Delivered' : shipment.attendance === 0 ? 'Pending' : 'In Transit';

    return (
        <div
            className="bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer group relative flex flex-col h-full"
            onClick={onClick}
        >
            <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Customer</div>
                        <h3 className="font-bold text-slate-800 text-base line-clamp-1">{shipment.name}</h3>
                        <p className="text-[11px] text-slate-400 font-mono italic">{shipment.id}</p>
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <MoreVertical size={18} />
                        </button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <button onClick={() => { onEdit?.(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">Edit</button>
                                    <button onClick={() => showToast(`Flagged ${shipment.id}`, 'success')} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-orange-600">Flag</button>
                                    <div className="border-t border-slate-100 my-1"></div>
                                    <button onClick={() => { onDelete?.(shipment.id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-indigo-400" />
                        <span className="text-xs text-slate-600 font-medium">{shipment.class}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Package size={14} className="text-indigo-400" />
                        <span className="text-xs text-slate-600 truncate">{shipment.subjects.join(', ')}</span>
                    </div>
                </div>
            </div>

            {/* Essential Progress & Status */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex justify-between items-center">
                <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex justify-between items-center pr-4">
                        <span className="text-[10px] text-slate-500 font-medium">Progress</span>
                        <span className="text-[10px] text-indigo-600 font-bold">{shipment.attendance}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 mr-4">
                        <div
                            className={`h-1 rounded-full ${shipment.attendance >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                            style={{ width: `${Math.min(shipment.attendance, 100)}%` }}
                        ></div>
                    </div>
                </div>
                <div className="shrink-0">
                    <StatusBadge status={status} />
                </div>
            </div>
        </div>
    );
};
