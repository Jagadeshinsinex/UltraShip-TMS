import React, { useState } from 'react';
import { X, Truck, Hash } from 'lucide-react';

import type { Vehicle } from '../types';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vehicle: any) => void;
    vehicleToEdit?: Vehicle | null;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onSave, vehicleToEdit }) => {
    const [formData, setFormData] = useState({
        model: '',
        licensePlate: '',
        type: 'Freight 100',
        status: 'Active'
    });

    React.useEffect(() => {
        if (vehicleToEdit) {
            setFormData({
                model: vehicleToEdit.model,
                licensePlate: vehicleToEdit.licensePlate,
                type: vehicleToEdit.type,
                status: vehicleToEdit.status
            });
        } else {
            setFormData({ model: '', licensePlate: '', type: 'Freight 100', status: 'Active' });
        }
    }, [vehicleToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: vehicleToEdit ? vehicleToEdit.id : `VEH-${Math.floor(Math.random() * 10000)}`,
            currentShipments: vehicleToEdit ? vehicleToEdit.currentShipments : 0,
            totalMileage: vehicleToEdit ? vehicleToEdit.totalMileage : 0,
            lastService: vehicleToEdit ? vehicleToEdit.lastService : 'Just now'
        });
        onClose();
        setFormData({ model: '', licensePlate: '', type: 'Freight 100', status: 'Active' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {vehicleToEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Model</label>
                        <div className="relative">
                            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                                placeholder="e.g. Scania R500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Plate</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.licensePlate}
                                onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                                placeholder="TN 01 AB 1234"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Type</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                        >
                            <option value="Freight 100">Freight 100</option>
                            <option value="Freight 200">Freight 200</option>
                            <option value="Standard Van">Standard Van</option>
                            <option value="Heavy Duty">Heavy Duty</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                        >
                            <option value="Active">Active</option>
                            <option value="Idle">Idle</option>
                            <option value="In Maintenance">In Maintenance</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                        >
                            {vehicleToEdit ? 'Save Changes' : 'Add Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
