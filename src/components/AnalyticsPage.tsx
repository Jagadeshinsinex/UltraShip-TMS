import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Package, Award, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Shipment } from '../types';
import { gql, useQuery } from '@apollo/client';
import { clsx } from 'clsx';
import { useToast } from '../context/ToastContext';

const GET_SHIPMENTS = gql`
  query GetShipments {
    getShipments(limit: 1000) {
      shipments {
        id
        name
        age
        class
        subjects
        attendance
      }
    }
  }
`;

export const AnalyticsPage: React.FC = () => {
    const { loading, error, data } = useQuery(GET_SHIPMENTS);
    const { showToast } = useToast();

    const analytics = useMemo(() => {
        if (!data?.getShipments?.shipments) return null;

        const shipments: Shipment[] = data.getShipments.shipments;

        // Breakdown by class
        const classCounts = shipments.reduce((acc, ship) => {
            acc[ship.class] = (acc[ship.class] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Performance score (average attendance)
        const avgAttendance = shipments.reduce((acc, ship) => acc + ship.attendance, 0) / shipments.length;

        // Status breakdown
        const statusCounts = {
            pending: shipments.filter(s => s.attendance === 0).length,
            inTransit: shipments.filter(s => s.attendance > 0 && s.attendance < 100).length,
            delivered: shipments.filter(s => s.attendance >= 100).length
        };

        // Top performers (highest attendance)
        const topPerformers = [...shipments]
            .sort((a, b) => b.attendance - a.attendance)
            .slice(0, 5);

        // At risk (low attendance, not yet delivered)
        const atRisk = shipments.filter(s => s.attendance > 0 && s.attendance < 30);

        return {
            classCounts,
            avgAttendance,
            statusCounts,
            topPerformers,
            atRisk,
            totalShipments: shipments.length
        };
    }, [data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
                Error loading analytics: {error.message}
            </div>
        );
    }

    if (!analytics) return null;

    const maxClassCount = Math.max(...Object.values(analytics.classCounts));

    const handleExport = () => {
        if (!analytics) return;

        const rows = [
            ['Metric', 'Value'],
            ['Total Shipments', analytics.totalShipments],
            ['Delivered', analytics.statusCounts.delivered],
            ['In Transit', analytics.statusCounts.inTransit],
            ['Pending', analytics.statusCounts.pending],
            ['Average Performance', `${analytics.avgAttendance.toFixed(2)}%`],
            ['At Risk Count', analytics.atRisk.length]
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ultraship_analytics_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('Report downloaded successfully', 'success');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Analytics & Reports</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Performance insights and business intelligence</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => showToast('PDF Export feature coming soon', 'success')}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Export PDF
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        Generate CSV Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-indigo-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-indigo-100 font-medium">Total Shipments</p>
                            <p className="text-3xl font-black mt-2">{analytics.totalShipments}</p>
                            <p className="text-xs text-indigo-100 mt-2">All time</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Package className="text-white" size={28} />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-emerald-100 font-medium">Delivered</p>
                            <p className="text-3xl font-black mt-2">{analytics.statusCounts.delivered}</p>
                            <p className="text-xs text-emerald-100 mt-2">
                                {((analytics.statusCounts.delivered / analytics.totalShipments) * 100).toFixed(0)}% success rate
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="text-white" size={28} />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg shadow-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-purple-100 font-medium">Performance Score</p>
                            <p className="text-3xl font-black mt-2">{analytics.avgAttendance.toFixed(1)}%</p>
                            <p className="text-xs text-purple-100 mt-2">Average progress</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Award className="text-white" size={28} />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg shadow-orange-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-orange-100 font-medium">At Risk</p>
                            <p className="text-3xl font-black mt-2">{analytics.atRisk.length}</p>
                            <p className="text-xs text-orange-100 mt-2">Low progress shipments</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <AlertCircle className="text-white" size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipment Breakdown by Class */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                            <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">Shipments by Freight Class</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution across categories</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(analytics.classCounts)
                            .sort((a, b) => b[1] - a[1])
                            .map(([className, count]) => (
                                <div key={className}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{className}</span>
                                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{count}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${(count / maxClassCount) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-slate-400 dark:text-slate-500">
                                            {((count / analytics.totalShipments) * 100).toFixed(1)}% of total
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">Status Overview</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Current shipment states</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-700">Pending</span>
                                <span className="text-2xl font-black text-slate-600">{analytics.statusCounts.pending}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-slate-500 h-2 rounded-full"
                                    style={{ width: `${(analytics.statusCounts.pending / analytics.totalShipments) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-blue-700">In Transit</span>
                                <span className="text-2xl font-black text-blue-600">{analytics.statusCounts.inTransit}</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${(analytics.statusCounts.inTransit / analytics.totalShipments) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-emerald-700">Delivered</span>
                                <span className="text-2xl font-black text-emerald-600">{analytics.statusCounts.delivered}</span>
                            </div>
                            <div className="w-full bg-emerald-200 rounded-full h-2">
                                <div
                                    className="bg-emerald-600 h-2 rounded-full"
                                    style={{ width: `${(analytics.statusCounts.delivered / analytics.totalShipments) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Award className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">Top Performing Shipments</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Highest progress rates</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {analytics.topPerformers.map((shipment, index) => (
                            <div
                                key={shipment.id}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all"
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                                    index === 0 ? "bg-yellow-100 text-yellow-700" :
                                        index === 1 ? "bg-slate-200 text-slate-700" :
                                            index === 2 ? "bg-orange-100 text-orange-700" :
                                                "bg-slate-100 text-slate-600"
                                )}>
                                    #{index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-slate-200 text-sm truncate">{shipment.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{shipment.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-purple-600 dark:text-purple-400">{shipment.attendance}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* At Risk Shipments */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-orange-600 dark:text-orange-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">At-Risk Shipments</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Requiring immediate attention</p>
                        </div>
                    </div>

                    {analytics.atRisk.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.atRisk.slice(0, 5).map((shipment) => (
                                <div
                                    key={shipment.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-orange-100 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-900/10"
                                >
                                    <AlertCircle className="text-orange-500 shrink-0" size={20} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 dark:text-slate-200 text-sm truncate">{shipment.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{shipment.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-orange-600 dark:text-orange-400">{shipment.attendance}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={32} />
                            <p className="text-sm font-semibold">All shipments on track!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
