import React, { useState } from 'react';
import { X, User, Phone, Mail, Truck } from 'lucide-react';

import type { Driver } from '../types';

interface AddDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (driver: any) => void;
    driverToEdit?: Driver | null;
}

export const AddDriverModal: React.FC<AddDriverModalProps> = ({ isOpen, onClose, onSave, driverToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        vehicle: '',
    });

    React.useEffect(() => {
        if (driverToEdit) {
            setFormData({
                name: driverToEdit.name,
                phone: driverToEdit.phone,
                email: driverToEdit.email,
                vehicle: driverToEdit.vehicleType,
            });
        } else {
            setFormData({ name: '', phone: '', email: '', vehicle: '' });
        }
    }, [driverToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: driverToEdit ? driverToEdit.id : `DRV-${Math.floor(Math.random() * 10000)}`,
            totalShipments: driverToEdit ? driverToEdit.totalShipments : 0,
            completedShipments: driverToEdit ? driverToEdit.completedShipments : 0,
            performanceScore: driverToEdit ? driverToEdit.performance : 100
        });
        onClose();
        setFormData({ name: '', phone: '', email: '', vehicle: '' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {driverToEdit ? 'Edit Driver' : 'Add New Driver'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Type</label>
                        <div className="relative">
                            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select
                                value={formData.vehicle}
                                onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100 appearance-none"
                            >
                                <option value="">Select a vehicle select...</option>
                                <option value="Freight 100">Freight 100</option>
                                <option value="Freight 200">Freight 200</option>
                                <option value="Standard Van">Standard Van</option>
                                <option value="Heavy Duty">Heavy Duty</option>
                            </select>
                        </div>
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
                            {driverToEdit ? 'Save Changes' : 'Create Driver'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
