import React from 'react';
import { ShipmentList } from './ShipmentList';
import type { Shipment } from '../types';

interface ShipmentsPageProps {
    onEdit?: (shipment: Shipment) => void;
    onNew?: () => void;
}

export const ShipmentsPage: React.FC<ShipmentsPageProps> = ({ onEdit, onNew }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Shipment Operations</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and track all active shipments</p>
                </div>
            </div>

            {/* Shipment List (includes search/filter toolbar) */}
            <ShipmentList onEdit={onEdit} onNew={onNew} />
        </div>
    );
};
