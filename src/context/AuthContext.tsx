import React, { createContext, useContext, useState, useEffect } from 'react';
// Define the shape of our Auth Context
interface AuthContextType {
    role: 'ADMIN' | 'EMPLOYEE' | null;
    loading: boolean;
    login: (role: 'ADMIN' | 'EMPLOYEE') => Promise<void>;
    logout: () => void;
    switchRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE' | null>('ADMIN');
    const [loading, setLoading] = useState(false);


    // Check local storage on initial load
    useEffect(() => {
        const savedRole = localStorage.getItem('userRole');
        if (savedRole === 'ADMIN' || savedRole === 'EMPLOYEE') {
            setRole(savedRole);
        }
        setLoading(false); // Done checking
    }, []);

    const login = async (selectedRole: 'ADMIN' | 'EMPLOYEE') => {
        // Mock Login - Client Only Mode
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('userRole', selectedRole);
        setRole(selectedRole);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setRole(null);
    };

    const switchRole = async () => {
        const newRole = role === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN';
        await login(newRole);
    };

    return (
        <AuthContext.Provider value={{ role, loading, login, logout, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
