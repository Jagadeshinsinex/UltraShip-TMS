import React from 'react';
import { Search, Bell, User, Hexagon, Shield, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
    const { role, switchRole, logout } = useAuth();


    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 w-full shadow-sm">
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
                            className="px-4 py-2 text-[13px] font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-50/80 rounded-lg transition-all"
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
                        className="pl-10 pr-4 py-2 w-72 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    <button
                        onClick={switchRole}
                        className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-all"
                        title="Click to Switch Role"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-800">
                                Jagadesh S
                                {role === 'ADMIN' ? (
                                    <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded border border-purple-200 uppercase tracking-wide flex items-center gap-1">
                                        <Shield size={10} /> Admin
                                    </span>
                                ) : (
                                    <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide flex items-center gap-1">
                                        <Users size={10} /> Staff
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">Click to Switch Role</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-200 rounded-full overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center">
                            <User size={20} className="text-slate-500" />
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
