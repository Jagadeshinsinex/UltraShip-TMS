
import { Shield, Users, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = () => {
    const { login } = useAuth();

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500">

                {/* Visual Side */}
                <div className="w-full md:w-1/2 bg-indigo-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Briefcase className="text-white" size={24} />
                            </div>
                            <span className="font-bold text-2xl tracking-tight">UltraShip TMS</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 leading-tight">Enterprise Logistics Management</h1>
                        <p className="text-indigo-100 text-lg">Secure, efficient, and role-based control for your entire fleet operations.</p>
                    </div>
                    <div className="relative z-10 text-sm text-indigo-200">
                        © 2025 UltraShip Logistics Inc.
                    </div>
                </div>

                {/* Selection Side */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-slate-50">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-900">Select Your Role</h2>
                        <p className="text-slate-500 mt-2">Choose an access level to enter the dashboard.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => login('ADMIN')}
                            className="w-full bg-white border-2 border-slate-200 p-6 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group text-left relative overflow-hidden"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">Login as Admin</h3>
                                    <p className="text-slate-500 text-sm mt-1">Full access to create, edit, and delete shipments.</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => login('EMPLOYEE')}
                            className="w-full bg-white border-2 border-slate-200 p-6 rounded-xl hover:border-slate-400 hover:shadow-md transition-all group text-left"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Login as Employee</h3>
                                    <p className="text-slate-500 text-sm mt-1">Limited read-only access to view shipments.</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
