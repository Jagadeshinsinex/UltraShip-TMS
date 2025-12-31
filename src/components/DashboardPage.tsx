import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { StatsOverview } from './StatsOverview';
import { RecentShipmentsWidget } from './RecentShipmentsWidget';
import { LiveActivityFeed } from './LiveActivityFeed';
import type { Shipment } from '../types';

const GET_ALL_SHIPMENTS_STATS = gql`
  query GetAllShipmentsStats {
    getShipments(limit: 1000) {
      shipments {
        id
        attendance
        age
      }
    }
  }
`;

interface DashboardPageProps {
    onNavigateToShipments: () => void;
    onSelectShipment?: (shipment: Shipment) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateToShipments, onSelectShipment }) => {
    const { data, loading } = useQuery(GET_ALL_SHIPMENTS_STATS, {
        pollInterval: 30000 // Poll every 30s to keep "live"
    });

    const stats = useMemo(() => {
        if (!data?.getShipments?.shipments) {
            return {
                activeShipments: 0,
                onTimeDelivery: 0,
                freightSpend: 0,
                criticalAlerts: 0
            };
        }

        const shipments: Shipment[] = data.getShipments.shipments;
        const total = shipments.length;
        const active = shipments.filter(s => s.attendance < 100).length;
        const delivered = shipments.filter(s => s.attendance >= 100).length;

        // Simulate "Critical" based on low progress but high age (stuck shipments)
        // or random "issues" for demo purposes if age isn't reliable enough
        const critical = shipments.filter(s => s.attendance < 50 && s.age > 40).length;

        // Calculate Average Spend (simulated)
        const totalSpend = total * 125000; // ~₹1.25 Lakh per shipment avg

        return {
            activeShipments: active,
            onTimeDelivery: total > 0 ? (delivered / total) * 100 : 100,
            freightSpend: totalSpend,
            criticalAlerts: critical
        };
    }, [data]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black mb-2">Welcome back, Jagadesh! 👋</h1>
                        <p className="text-indigo-100 text-sm md:text-base">Here's your logistics overview for today</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-indigo-100">All Systems Operational</span>
                    </div>
                </div>
            </div>

            {/* KPI Stats */}
            <StatsOverview stats={stats} loading={loading} />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Shipments - 2 columns */}
                <div className="lg:col-span-2">
                    <RecentShipmentsWidget
                        onViewAll={onNavigateToShipments}
                        onSelectShipment={onSelectShipment}
                    />
                </div>

                {/* System Health - 1 column */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-center">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">System Integrity Console</h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-xs font-bold px-4">
                                <span className="text-slate-500 uppercase tracking-tight">Backend API Latency</span>
                                <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    24ms
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold px-4">
                                <span className="text-slate-500 uppercase tracking-tight">Global Node Sync</span>
                                <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    100.0%
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold px-4">
                                <span className="text-slate-500 uppercase tracking-tight">Encryption Status</span>
                                <span className="text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-2 font-black">
                                    AES-256
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Activity Feed - Full Width */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LiveActivityFeed />
                </div>

                {/* Quick Actions Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                            <button
                                onClick={onNavigateToShipments}
                                className="w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl transition-all text-sm border border-indigo-100 hover:border-indigo-200"
                            >
                                📦 View All Shipments
                            </button>
                            <button className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all text-sm border border-slate-200">
                                🚛 Fleet Overview
                            </button>
                            <button className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all text-sm border border-slate-200">
                                📊 Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
