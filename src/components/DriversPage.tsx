import React, { useMemo, useState } from 'react';
import { User, Phone, Mail, Truck, TrendingUp, MapPin, Plus, Edit2, MoreVertical, Trash2 } from 'lucide-react';
import type { Shipment, Driver } from '../types';
import { gql, useQuery } from '@apollo/client';
import { clsx } from 'clsx';
import { AddDriverModal } from './AddDriverModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

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



export const DriversPage: React.FC = () => {
    const { loading, error, data } = useQuery(GET_SHIPMENTS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [editedDrivers, setEditedDrivers] = useState<Record<string, Driver>>({});
    const [localDrivers, setLocalDrivers] = useState<Driver[]>([]);
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
    const { showToast } = useToast();
    const { role } = useAuth();
    const { globalSearchQuery } = useSearch();

    // Extract unique drivers from shipment data
    const drivers: Driver[] = useMemo(() => {
        let baseDrivers: Driver[] = [];
        if (data?.getShipments?.shipments) {
            const shipments: Shipment[] = data.getShipments.shipments;
            const driverMap = new Map<string, Driver>();

            shipments.forEach((shipment, index) => {
                const driverName = shipment.name.split(' ')[0] + ' Driver';

                if (!driverMap.has(driverName)) {
                    const driverId = `DRV-${(index + 1).toString().padStart(3, '0')}`;
                    driverMap.set(driverName, {
                        id: driverId,
                        name: driverName,
                        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
                        email: `${driverName.toLowerCase().replace(' ', '.')}@ultraship.com`,
                        vehicleType: shipment.class,
                        status: 'Active',
                        totalShipments: 0,
                        completedShipments: 0,
                        performance: 0
                    });
                }

                const driver = driverMap.get(driverName)!;
                driver.totalShipments++;
                if (shipment.attendance >= 100) {
                    driver.completedShipments++;
                }
            });

            // Calculate performance
            driverMap.forEach(driver => {
                driver.performance = Math.round(
                    (driver.completedShipments / driver.totalShipments) * 100
                );
            });

            baseDrivers = Array.from(driverMap.values());
        }

        // Apply edits to base drivers
        const mergedBaseDrivers = baseDrivers.map(d => editedDrivers[d.id] || d);

        // Return merged + local, filtered
        const allDrivers = [...mergedBaseDrivers, ...localDrivers].filter(d => !deletedIds.has(d.id));

        if (!globalSearchQuery) return allDrivers;

        const lowerQuery = globalSearchQuery.toLowerCase();
        return allDrivers.filter(d =>
            d.name.toLowerCase().includes(lowerQuery) ||
            d.id.toLowerCase().includes(lowerQuery) ||
            d.email.toLowerCase().includes(lowerQuery)
        );
    }, [data, localDrivers, deletedIds, editedDrivers, globalSearchQuery]);


    const handleSaveDriver = (driver: Driver) => {
        if (driver.id && editedDrivers[driver.id]) {
            // Updating a previously edited derived driver
            setEditedDrivers(prev => ({ ...prev, [driver.id]: driver }));
            showToast('Driver updated successfully', 'success');
        } else if (localDrivers.some(d => d.id === driver.id)) {
            // Updating a local driver
            setLocalDrivers(prev => prev.map(d => d.id === driver.id ? driver : d));
            showToast('Driver updated successfully', 'success');
        } else if (drivers.some(d => d.id === driver.id)) {
            // First time editing a derived driver
            setEditedDrivers(prev => ({ ...prev, [driver.id]: driver }));
            showToast('Driver updated successfully', 'success');
        }
        else {
            // Brand new driver
            setLocalDrivers(prev => [...prev, driver]);
            showToast('Driver added successfully', 'success');
        }
        setEditingDriver(null);
    };

    const handleEditDriver = (driver: Driver) => {
        setEditingDriver(driver);
        setIsAddModalOpen(true);
    };



    const handleDeleteDriver = (id: string) => {
        if (confirm('Are you sure you want to remove this driver?')) {
            setDeletedIds(prev => new Set(prev).add(id));
            showToast('Driver removed', 'success');
        }
    };

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
                Error loading drivers: {error.message}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Driver Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and monitor driver performance</p>
                </div>
                {role === 'ADMIN' && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        Add Driver
                    </button>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Drivers</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{drivers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <User className="text-indigo-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Routes</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {drivers.reduce((acc, d) => acc + d.totalShipments, 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <MapPin className="text-emerald-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Performance</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {Math.round(drivers.reduce((acc, d) => acc + d.performance, 0) / (drivers.length || 1))}%
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {drivers.reduce((acc, d) => acc + d.completedShipments, 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Truck className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {drivers.map(driver => (
                    <div
                        key={driver.id}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 group"
                    >
                        <div className="p-5 space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                        <User className="text-indigo-600 dark:text-indigo-400" size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{driver.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{driver.id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    {role === 'ADMIN' && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === driver.id ? null : driver.id)}
                                                className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openMenuId === driver.id && (
                                                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        onClick={() => {
                                                            handleEditDriver(driver);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                                                    >
                                                        <Edit2 size={16} />
                                                        Edit Details
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteDriver(driver.id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left border-t border-slate-50 dark:border-slate-700/50"
                                                    >
                                                        <Trash2 size={16} />
                                                        Remove Driver
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-xs">
                                    <Phone size={14} className="text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-300">{driver.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Mail size={14} className="text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-300 truncate">{driver.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Truck size={14} className="text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-300">{driver.vehicleType}</span>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{driver.totalShipments}</p>
                                </div>
                                <div className="text-center border-x border-slate-100 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Done</p>
                                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{driver.completedShipments}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Score</p>
                                    <p className={clsx(
                                        "text-lg font-black",
                                        driver.performance >= 75 ? "text-emerald-600" :
                                            driver.performance >= 50 ? "text-orange-600" : "text-red-600"
                                    )}>
                                        {driver.performance}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddDriverModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingDriver(null);
                }}
                onSave={handleSaveDriver}
                driverToEdit={editingDriver}
            />
        </div>
    );
};
