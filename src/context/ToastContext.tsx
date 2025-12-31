import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
        setIsVisible(true);
    };

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000); // Auto hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Handle CSS transition cleanup
    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 300); // Wait for fade out animation
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className={`fixed top-6 right-6 z-[60] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                {toast && (
                    <div className={`
            flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/20 min-w-[300px]
            ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}
          `}>
                        {toast.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{toast.type === 'success' ? 'Success' : 'Error'}</h4>
                            <p className="text-sm opacity-90">{toast.message}</p>
                        </div>
                        <button onClick={() => setIsVisible(false)} className="opacity-70 hover:opacity-100 transition-opacity">
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
