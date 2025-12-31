import React, { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    Truck,
    ChevronDown,
    ChevronRight,
    Settings,
    LogOut,
    Menu,
    BarChart3
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    currentView: string;
    onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, currentView, onNavigate }) => {
    const [fleetOpen, setFleetOpen] = useState(true);
    const { logout } = useAuth();

    const NavItem = ({ icon: Icon, label, active = false, hasSubmenu = false, isOpen = false, onClick }: any) => (
        <div
            className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group",
                active ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                isCollapsed && "justify-center px-2"
            )}
            onClick={onClick}
        >
            <Icon size={20} strokeWidth={2} className={active ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-700"} />
            {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                    <span className="font-medium text-sm">{label}</span>
                    {hasSubmenu && (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                </div>
            )}
        </div>
    );

    return (
        <aside
            className={clsx(
                "bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col transition-all duration-300 z-20",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between h-16">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Truck className="text-white" size={18} />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">UltraShip TMS</span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className={clsx(
                        "p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors",
                        isCollapsed && "mx-auto"
                    )}
                >
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={currentView === 'dashboard'}
                    onClick={() => onNavigate('dashboard')}
                />
                <NavItem
                    icon={Package}
                    label="Shipments"
                    active={currentView === 'shipments'}
                    onClick={() => onNavigate('shipments')}
                />

                <NavItem
                    icon={Truck}
                    label="Fleet Management"
                    hasSubmenu
                    isOpen={fleetOpen}
                    onClick={() => setFleetOpen(!fleetOpen)}
                />

                {!isCollapsed && fleetOpen && (
                    <div className="ml-9 space-y-1 mb-2">
                        <div
                            className={clsx(
                                "px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
                                currentView === 'drivers'
                                    ? "text-indigo-600 bg-indigo-50 font-semibold"
                                    : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                            )}
                            onClick={() => onNavigate('drivers')}
                        >
                            Drivers
                        </div>
                        <div
                            className={clsx(
                                "px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
                                currentView === 'vehicles'
                                    ? "text-indigo-600 bg-indigo-50 font-semibold"
                                    : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                            )}
                            onClick={() => onNavigate('vehicles')}
                        >
                            Vehicles
                        </div>
                    </div>
                )}

                <NavItem
                    icon={BarChart3}
                    label="Analytics & Reports"
                    active={currentView === 'analytics'}
                    onClick={() => onNavigate('analytics')}
                />
            </div>

            <div className="p-4 border-t border-slate-100 space-y-1">
                <NavItem
                    icon={Settings}
                    label="Settings"
                    active={currentView === 'settings'}
                    onClick={() => onNavigate('settings')}
                />
                <NavItem icon={LogOut} label="Logout" onClick={logout} />
            </div>
        </aside>
    );
};

