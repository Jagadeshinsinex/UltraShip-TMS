import React from 'react';
import { ArrowRight, Package } from 'lucide-react';
import { gql, useQuery } from '@apollo/client';
import { StatusBadge } from './StatusBadge';
import type { Shipment } from '../types';

const GET_RECENT_SHIPMENTS = gql`
  query GetRecentShipments {
    getShipments(limit: 5, offset: 0, sortBy: "age_ASC") {
      shipments {
        id
        name
        attendance
        class
      }
    }
  }
`;

interface RecentShipmentsWidgetProps {
    onViewAll: () => void;
    onSelectShipment?: (shipment: Shipment) => void;
}

export const RecentShipmentsWidget: React.FC<RecentShipmentsWidgetProps> = ({ onViewAll, onSelectShipment }) => {
    const { data, loading } = useQuery(GET_RECENT_SHIPMENTS, {
        fetchPolicy: 'cache-first'
    });

    const shipments = data?.getShipments?.shipments || [];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Package size={14} className="text-indigo-600" />
                    Recent Shipments
                </h3>
                <button
                    onClick={onViewAll}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
                >
                    View All
                    <ArrowRight size={12} />
                </button>
            </div>

            {loading ? (
                <div className="p-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {shipments.map((shipment: Shipment) => {
                        const status = shipment.attendance >= 100 ? 'Delivered' : shipment.attendance === 0 ? 'Pending' : 'In Transit';

                        return (
                            <div
                                key={shipment.id}
                                onClick={() => onSelectShipment?.(shipment)}
                                className="px-5 py-3 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-900 font-mono">{shipment.id}</span>
                                            <span className="text-xs text-slate-600 truncate">{shipment.name}</span>
                                        </div>
                                    </div>
                                    <StatusBadge status={status} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
