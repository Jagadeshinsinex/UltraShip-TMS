import React from 'react';
import { clsx } from 'clsx';

interface StatusBadgeProps {
    status: string;
    type?: 'status' | 'priority';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'In Transit':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Delivered':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Delayed':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'Pending':
                return 'bg-slate-100 text-slate-600 border-slate-200';

            // Priorities
            case 'Critical':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'High':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Medium':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Low':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'Normal':
                return 'bg-slate-50 text-slate-600 border-slate-200';

            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={clsx(
            "px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm transition-all uppercase tracking-wider",
            getStatusStyles(status)
        )}>
            {status}
        </span>
    );
};
