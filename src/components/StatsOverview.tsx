import React from 'react';
import { Truck, Clock, AlertTriangle, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendType?: 'up' | 'down';
    icon: React.ElementType;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendType, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={clsx("p-2.5 rounded-xl", color)}>
                <Icon size={20} className="text-white" />
            </div>
            {trend && (
                <div className={clsx(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                    trendType === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                )}>
                    {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {trend}
                </div>
            )}
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
);

interface StatsOverviewProps {
    stats: {
        activeShipments: number;
        onTimeDelivery: number;
        freightSpend: number;
        criticalAlerts: number;
    };
    loading?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-32 animate-pulse">
                        <div className="h-8 w-8 bg-slate-100 rounded-lg mb-4"></div>
                        <div className="h-4 w-24 bg-slate-100 rounded mb-2"></div>
                        <div className="h-8 w-16 bg-slate-100 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatCard
                label="Active Shipments"
                value={stats.activeShipments.toLocaleString()}
                trend="+12%"
                trendType="up"
                icon={Truck}
                color="bg-indigo-600"
            />
            <StatCard
                label="On-Time Delivery"
                value={`${stats.onTimeDelivery.toFixed(1)}%`}
                trend="+0.5%"
                trendType="up"
                icon={Clock}
                color="bg-emerald-500"
            />
            <StatCard
                label="Freight Spend"
                value={`₹${stats.freightSpend.toLocaleString()}`}
                trend="-3.2%"
                trendType="down"
                icon={IndianRupee}
                color="bg-amber-500"
            />
            <StatCard
                label="Critical Alerts"
                value={stats.criticalAlerts.toString()}
                trend={stats.criticalAlerts > 0 ? "Action Needed" : "All Clear"}
                trendType={stats.criticalAlerts > 0 ? "down" : "up"}
                icon={AlertTriangle}
                color={stats.criticalAlerts > 0 ? "bg-rose-500" : "bg-emerald-500"}
            />
        </div>
    );
};
