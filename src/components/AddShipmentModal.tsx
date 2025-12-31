import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Shipment } from '../types';

const ADD_SHIPMENT = gql`
  mutation CreateShipment($input: NewShipmentInput!) {
    createShipment(input: $input) {
      id
      name
      age
      class
      subjects
      attendance
      origin
      destination
      priority
    }
  }
`;

const UPDATE_SHIPMENT = gql`
  mutation UpdateShipment($id: ID!, $input: UpdateShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      id
      name
      age
      class
      subjects
      attendance
      origin
      destination
      priority
    }
  }
`;

interface AddShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    shipmentToEdit?: Shipment | null;
}

export const AddShipmentModal: React.FC<AddShipmentModalProps> = ({ isOpen, onClose, shipmentToEdit }) => {
    const { showToast } = useToast();
    const { role } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        age: '' as string | number,
        class: 'Standard',
        subjects: '',
        attendance: '' as string | number,
    });

    useEffect(() => {
        if (shipmentToEdit) {
            setFormData({
                name: shipmentToEdit.name,
                age: shipmentToEdit.age,
                class: shipmentToEdit.class,
                subjects: shipmentToEdit.subjects.join(', '),
                attendance: shipmentToEdit.attendance,
            });
        } else {
            setFormData({
                name: '',
                age: '',
                class: 'Standard',
                subjects: '',
                attendance: '',
            });
        }
    }, [shipmentToEdit, isOpen]);

    const [createShipment, { loading: creating }] = useMutation(ADD_SHIPMENT, {
        refetchQueries: ['GetShipments'],
        onCompleted: () => {
            showToast("Shipment Created Successfully!", "success");
            onClose();
        },
        onError: (err) => showToast(err.message, "error")
    });

    const [updateShipment, { loading: updating }] = useMutation(UPDATE_SHIPMENT, {
        refetchQueries: ['GetShipments'],
        onCompleted: () => {
            showToast("Shipment Updated Successfully!", "success");
            onClose();
        },
        onError: (err) => showToast(err.message, "error")
    });

    const loading = creating || updating;
    const isEditMode = !!shipmentToEdit;

    if (!isOpen) return null;

    if (role !== 'ADMIN') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <X size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h3>
                    <p className="text-slate-600 mb-6">You need <strong>Admin</strong> privileges to {isEditMode ? 'edit' : 'create'} shipments. Please switch roles.</p>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert comma separated subjects to array
        const subjectList = formData.subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);

        const inputPayload = {
            name: formData.name,
            age: formData.age === '' ? 0 : Number(formData.age),
            class: formData.class,
            subjects: subjectList.length > 0 ? subjectList : ['General Cargo'],
            attendance: formData.attendance === '' ? 0 : Number(formData.attendance),
        };

        if (isEditMode && shipmentToEdit) {
            updateShipment({
                variables: {
                    id: shipmentToEdit.id,
                    input: inputPayload
                }
            });
        } else {
            createShipment({
                variables: {
                    input: inputPayload
                }
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-xl text-slate-900">{isEditMode ? 'Edit Shipment' : 'Create New Shipment'}</h3>
                        <p className="text-sm text-slate-500 mt-1">{isEditMode ? `Updating details for ${shipmentToEdit.id}` : 'Fill in strict details.'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-8 space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Days in Transit (Age)</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Delivery Progress %</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                                    value={formData.attendance}
                                    onChange={e => setFormData({ ...formData, attendance: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Freight Class</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                                value={formData.class}
                                onChange={e => setFormData({ ...formData, class: e.target.value })}
                            >
                                <option value="Standard">Standard Cargo</option>
                                <option value="Hazmat">Hazardous Materials</option>
                                <option value="Perishable">Perishable Goods</option>
                                <option value="Fragile">Fragile / High Value</option>
                                <option value="Class 50">Class 50</option>
                                <option value="Express">Express</option>
                                <option value="Electronics">Electronics</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cargo Items (Comma Separated)</label>
                            <textarea
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none"
                                rows={3}
                                value={formData.subjects}
                                onChange={e => setFormData({ ...formData, subjects: e.target.value })}
                                placeholder="e.g. Electronics, Laptops, Keyboards"
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-white hover:border-slate-400 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px] flex justify-center"
                        >
                            {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Shipment" : "Create Shipment")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
