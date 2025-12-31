import React, { useState } from 'react';
import type { Shipment } from '../types';
import { MoreVertical } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ShipmentTableProps {
    shipments: Shipment[];
    onSelectShipment: (shipment: Shipment) => void;
    onEdit?: (shipment: Shipment) => void;
    onDelete?: (id: string) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({ shipments, onSelectShipment, onEdit, onDelete }) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-xs md:text-sm text-left border-collapse min-w-[1000px]">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Origin</th>
                        <th className="px-4 py-3">Destination</th>
                        <th className="px-4 py-3">Transit Time</th>
                        <th className="px-4 py-3">Freight Class</th>
                        <th className="px-4 py-3">Cargo Items</th>
                        <th className="px-4 py-3">Progress</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {shipments.map((shipment) => {
                        const status = shipment.attendance >= 100 ? 'Delivered' : shipment.attendance === 0 ? 'Pending' : 'In Transit';
                        const priority = shipment.class === 'Express' ? 'High' : 'Normal';

                        return (
                            <tr
                                key={shipment.id}
                                onClick={() => onSelectShipment(shipment)}
                                className="hover:bg-slate-50/50 transition-colors cursor-pointer group whitespace-nowrap"
                            >
                                <td className="px-4 py-3 font-medium text-slate-900">{shipment.id}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={status} />
                                </td>
                                <td className="px-4 py-3 text-slate-700 font-medium">{shipment.name}</td>
                                <td className="px-4 py-3 text-slate-500 italic">{shipment.origin || 'Primary Hub'}</td>
                                <td className="px-4 py-3 text-slate-500 italic">{shipment.destination || 'Regional DC'}</td>
                                <td className="px-4 py-3 text-slate-600 font-mono">{shipment.age} Days</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">
                                        {shipment.class}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate">
                                    {shipment.subjects.join(', ')}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-slate-100 rounded-full h-1">
                                            <div
                                                className={`h-1 rounded-full ${shipment.attendance >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                                style={{ width: `${Math.min(shipment.attendance, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-slate-500">{shipment.attendance}%</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={shipment.priority || priority} />
                                </td>
                                <td className="px-4 py-3 text-right relative" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === shipment.id ? null : shipment.id)}
                                        className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {activeMenu === shipment.id && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                            <div className="absolute right-4 top-10 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                                <button
                                                    onClick={() => { onEdit?.(shipment); setActiveMenu(null); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                                >
                                                    Edit Shipment
                                                </button>
                                                <button
                                                    onClick={() => setActiveMenu(null)}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                                >
                                                    View Details
                                                </button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button
                                                    onClick={() => { onDelete?.(shipment.id); setActiveMenu(null); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
