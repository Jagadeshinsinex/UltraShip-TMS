import React, { useState } from 'react';
import { Search, Bell, User, Hexagon, Shield, Users, LogOut, CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { useToast } from '../context/ToastContext';

interface HeaderProps {
    onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const { role, switchRole, logout } = useAuth();
    const { globalSearchQuery, setGlobalSearchQuery } = useSearch();
    const { showToast } = useToast();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const handleNavClick = (item: string) => {
        switch (item) {
            case 'Tracking':
                onNavigate('shipments');
                break;
            case 'Reports':
            case 'Analytics':
                onNavigate('analytics');
                break;
            default:
                showToast(`${item} module coming soon!`, 'info');
        }
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 w-full shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
                <Hexagon className="text-indigo-600 fill-indigo-100" size={24} strokeWidth={2} />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
                    UltraShip TMS
                </h1>

                {/* Horizontal Navigation Menu */}
                <nav className="hidden lg:flex items-center gap-2 ml-10">
                    {['Tracking', 'Reports', 'Analytics', 'Inventory'].map((item) => (
                        <button
                            key={item}
                            onClick={() => handleNavClick(item)}
                            className="px-4 py-2 text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 rounded-lg transition-all"
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search shipments, drivers..."
                        value={globalSearchQuery}
                        onChange={(e) => setGlobalSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const lowerQuery = globalSearchQuery.toLowerCase();
                                if (lowerQuery.includes('driver')) {
                                    onNavigate('drivers');
                                } else if (lowerQuery.includes('vehicle') || lowerQuery.includes('truck')) {
                                    onNavigate('vehicles');
                                } else {
                                    onNavigate('shipments');
                                }
                            }
                        }}
                        className="pl-10 pr-4 py-2 w-72 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 text-slate-900 dark:text-slate-200 transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-800 dark:text-white flex justify-between items-center">
                                    <span>Notifications</span>
                                    <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Mark all read</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 flex gap-3">
                                        <div className="bg-red-50 p-2 rounded-full h-fit"><AlertTriangle size={16} className="text-red-500" /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">High Risk Shipment</p>
                                            <p className="text-xs text-slate-500 mt-1">Shipment #SHP-128 is delayed at border crossing.</p>
                                            <p className="text-[10px] text-slate-400 mt-2">2 mins ago</p>
                                        </div>
                                    </div>
                                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 flex gap-3">
                                        <div className="bg-emerald-50 p-2 rounded-full h-fit"><CheckCircle size={16} className="text-emerald-500" /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Delivery Successful</p>
                                            <p className="text-xs text-slate-500 mt-1">Amazon India shipment has been delivered successfully.</p>
                                            <p className="text-[10px] text-slate-400 mt-2">1 hour ago</p>
                                        </div>
                                    </div>
                                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex gap-3">
                                        <div className="bg-blue-50 p-2 rounded-full h-fit"><Truck size={16} className="text-blue-500" /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">New Driver Assigned</p>
                                            <p className="text-xs text-slate-500 mt-1">Ramesh Kumar assigned to Route 44.</p>
                                            <p className="text-[10px] text-slate-400 mt-2">3 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={switchRole}
                        className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-all"
                        title="Click to Switch Role"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Jagadesh S
                                {role === 'ADMIN' ? (
                                    <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800 uppercase tracking-wide flex items-center gap-1">
                                        <Shield size={10} /> Admin
                                    </span>
                                ) : (
                                    <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide flex items-center gap-1">
                                        <Users size={10} /> Staff
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Click to Switch Role</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-100 dark:border-slate-600 shadow-sm flex items-center justify-center">
                            <User size={20} className="text-slate-500 dark:text-slate-400" />
                        </div>
                    </button>

                    <button
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};
