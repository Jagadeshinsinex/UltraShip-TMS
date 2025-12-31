import React, { useMemo, useState } from 'react';
import { Truck, Gauge, MapPin, Calendar, Plus, Edit2, MoreVertical, Trash2, AlertCircle } from 'lucide-react';
import type { Shipment, Vehicle } from '../types';
import { gql, useQuery } from '@apollo/client';
import { clsx } from 'clsx';
import { AddVehicleModal } from './AddVehicleModal';
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



export const VehiclesPage: React.FC = () => {
    const { loading, error, data } = useQuery(GET_SHIPMENTS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [editedVehicles, setEditedVehicles] = useState<Record<string, Vehicle>>({});
    const [localVehicles, setLocalVehicles] = useState<Vehicle[]>([]);
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
    const { showToast } = useToast();
    const { role } = useAuth();
    const { globalSearchQuery } = useSearch();

    // Extract unique vehicles from shipment data
    const vehicles: Vehicle[] = useMemo(() => {
        let baseVehicles: Vehicle[] = [];
        if (data?.getShipments?.shipments) {
            const shipments: Shipment[] = data.getShipments.shipments;
            const vehicleMap = new Map<string, Vehicle>();

            shipments.forEach((shipment, index) => {
                const vehicleType = shipment.class;

                if (!vehicleMap.has(vehicleType)) {
                    const vehicleId = `VEH-${(index + 1).toString().padStart(3, '0')}`;
                    const randomStatus = Math.random() > 0.2 ? 'Active' : Math.random() > 0.5 ? 'Idle' : 'In Maintenance';

                    vehicleMap.set(vehicleType, {
                        id: vehicleId,
                        model: `${vehicleType} Transport`,
                        licensePlate: `TN ${Math.floor(Math.random() * 90 + 10)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 9000 + 1000)}`,
                        type: vehicleType,
                        status: randomStatus as any,
                        currentShipments: 0,
                        totalMileage: Math.floor(Math.random() * 50000 + 10000),
                        lastService: `${Math.floor(Math.random() * 30 + 1)} days ago`
                    });
                }

                const vehicle = vehicleMap.get(vehicleType)!;
                if (shipment.attendance > 0 && shipment.attendance < 100) {
                    vehicle.currentShipments++;
                }
            });
            baseVehicles = Array.from(vehicleMap.values());
        }

        const mergedBaseVehicles = baseVehicles.map(v => editedVehicles[v.id] || v);
        const allVehicles = [...mergedBaseVehicles, ...localVehicles].filter(v => !deletedIds.has(v.id));

        if (!globalSearchQuery) return allVehicles;

        const lowerQuery = globalSearchQuery.toLowerCase();
        return allVehicles.filter(v =>
            v.model.toLowerCase().includes(lowerQuery) ||
            v.id.toLowerCase().includes(lowerQuery) ||
            v.licensePlate.toLowerCase().includes(lowerQuery)
        );
    }, [data, localVehicles, deletedIds, editedVehicles, globalSearchQuery]);


    const handleSaveVehicle = (vehicle: Vehicle) => {
        if (vehicle.id && editedVehicles[vehicle.id]) {
            setEditedVehicles(prev => ({ ...prev, [vehicle.id]: vehicle }));
            showToast('Vehicle updated successfully', 'success');
        } else if (localVehicles.some(v => v.id === vehicle.id)) {
            setLocalVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
            showToast('Vehicle updated successfully', 'success');
        } else if (vehicles.some(v => v.id === vehicle.id)) {
            setEditedVehicles(prev => ({ ...prev, [vehicle.id]: vehicle }));
            showToast('Vehicle updated successfully', 'success');
        } else {
            setLocalVehicles(prev => [...prev, vehicle]);
            showToast('Vehicle added successfully', 'success');
        }
        setEditingVehicle(null);
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsAddModalOpen(true);
    };

    const handleDeleteVehicle = (id: string) => {
        if (confirm('Are you sure you want to remove this vehicle?')) {
            setDeletedIds(prev => new Set(prev).add(id));
            showToast('Vehicle removed', 'success');
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
                Error loading vehicles: {error.message}
            </div>
        );
    }

    const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
    const totalMileage = vehicles.reduce((acc, v) => acc + v.totalMileage, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Vehicle Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor fleet and vehicle performance</p>
                </div>
                {role === 'ADMIN' && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        Add Vehicle
                    </button>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Fleet</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{vehicles.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Truck className="text-indigo-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Vehicles</p>
                            <p className="text-2xl font-black text-emerald-600 mt-1">{activeVehicles}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <MapPin className="text-emerald-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Mileage</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {(totalMileage / 1000).toFixed(0)}K
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Gauge className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Maintenance Due</p>
                            <p className="text-2xl font-black text-orange-600 mt-1">
                                {vehicles.filter(v => v.status === 'In Maintenance').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {vehicles.map(vehicle => (
                    <div
                        key={vehicle.id}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 group"
                    >
                        <div className="p-5 space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={clsx(
                                        "w-12 h-12 rounded-lg flex items-center justify-center",
                                        vehicle.status === 'Active' ? "bg-emerald-100" :
                                            vehicle.status === 'Idle' ? "bg-slate-100" : "bg-orange-100"
                                    )}>
                                        <Truck className={clsx(
                                            vehicle.status === 'Active' ? "text-emerald-600" :
                                                vehicle.status === 'Idle' ? "text-slate-400" : "text-orange-600"
                                        )} size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{vehicle.model}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{vehicle.id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    {role === 'ADMIN' && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id)}
                                                className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openMenuId === vehicle.id && (
                                                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        onClick={() => {
                                                            handleEditVehicle(vehicle);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                                                    >
                                                        <Edit2 size={16} />
                                                        Edit Details
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteVehicle(vehicle.id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left border-t border-slate-50 dark:border-slate-700/50"
                                                    >
                                                        <Trash2 size={16} />
                                                        Remove Vehicle
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">License Plate</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded">
                                    {vehicle.licensePlate}
                                </span>
                            </div>

                            {/* Vehicle Details */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Status</span>
                                    <span className={clsx(
                                        "px-2 py-1 rounded-full font-bold",
                                        vehicle.status === 'Active' ? "bg-emerald-100 text-emerald-700" :
                                            vehicle.status === 'Idle' ? "bg-slate-100 text-slate-600" :
                                                "bg-orange-100 text-orange-700"
                                    )}>
                                        {vehicle.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">Type</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{vehicle.type}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">Current Shipments</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{vehicle.currentShipments}</span>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Gauge size={12} className="text-slate-400" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Mileage</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{vehicle.totalMileage.toLocaleString()} km</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Calendar size={12} className="text-slate-400" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Last Service</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{vehicle.lastService}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddVehicleModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingVehicle(null);
                }}
                onSave={handleSaveVehicle}
                vehicleToEdit={editingVehicle}
            />
        </div>
    );
};
