import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Key, Bell, Globe, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

export const SettingsPage: React.FC = () => {
    const { role } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">User Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your account and preferences</p>
                </div>
            </div>

            {/* Settings Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-slate-200 p-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                                activeTab === 'profile'
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <User size={18} />
                            <span className="font-semibold text-sm">Profile</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left mt-1",
                                activeTab === 'security'
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <Lock size={18} />
                            <span className="font-semibold text-sm">Security</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left mt-1",
                                activeTab === 'notifications'
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <Bell size={18} />
                            <span className="font-semibold text-sm">Notifications</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left mt-1",
                                activeTab === 'preferences'
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <Globe size={18} />
                            <span className="font-semibold text-sm">Preferences</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 mb-1">Profile Information</h2>
                                    <p className="text-sm text-slate-500">Update your personal details and role information</p>
                                </div>

                                {/* Profile Picture */}
                                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                    <div className="relative group">
                                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                            <User className="text-white" size={40} />
                                        </div>
                                        <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                                            Change
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Jagadesh S</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {role === 'ADMIN' ? (
                                                <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full border border-purple-200 uppercase tracking-wide flex items-center gap-1 font-bold">
                                                    <Shield size={12} /> Admin
                                                </span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full border border-slate-200 uppercase tracking-wide font-bold">
                                                    Staff
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 mt-2">Member since December 2025</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Jagadesh S"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Employee ID</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value="EMP-2025-001"
                                                disabled
                                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-mono"
                                            />
                                            <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-semibold transition-colors">
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={14} />
                                                Email Address
                                            </div>
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue="jagadesh@ultraship.com"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <Phone size={14} />
                                                Phone Number
                                            </div>
                                        </label>
                                        <input
                                            type="tel"
                                            defaultValue="+91 98765 43210"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all">
                                            <option>Logistics & Operations</option>
                                            <option>Fleet Management</option>
                                            <option>Customer Service</option>
                                            <option>Administration</option>
                                        </select>
                                    </div>
                                </div>

                                {/* API Credentials */}
                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">API Credentials</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <Key size={14} />
                                                    API Key
                                                </div>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value="uk_live_8x9Y2k3LmN4pQ5rS6tU7vW8xY9zA0bC1d"
                                                    disabled
                                                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono text-sm"
                                                />
                                                <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-semibold transition-colors">
                                                    Copy
                                                </button>
                                                <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
                                                    Regenerate
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">Use this key to authenticate API requests</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 mb-1">Security Settings</h2>
                                    <p className="text-sm text-slate-500">Manage your password and security preferences</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 mb-1">Notification Preferences</h2>
                                    <p className="text-sm text-slate-500">Choose how you want to be notified</p>
                                </div>

                                <div className="space-y-4">
                                    {['Shipment Updates', 'System Alerts', 'Performance Reports', 'Team Messages'].map(item => (
                                        <label key={item} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                            <span className="font-semibold text-slate-700">{item}</span>
                                            <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-100" />
                                        </label>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <Save size={18} />
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 mb-1">Application Preferences</h2>
                                    <p className="text-sm text-slate-500">Customize your application experience</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all">
                                            <option>English (US)</option>
                                            <option>English (UK)</option>
                                            <option>Hindi</option>
                                            <option>Tamil</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Timezone</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all">
                                            <option>India Standard Time (IST)</option>
                                            <option>Coordinated Universal Time (UTC)</option>
                                            <option>Eastern Standard Time (EST)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Date Format</label>
                                        <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all">
                                            <option>DD/MM/YYYY</option>
                                            <option>MM/DD/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <Save size={18} />
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
