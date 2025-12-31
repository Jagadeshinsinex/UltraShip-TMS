import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

// Define the shape of our Auth Context
interface AuthContextType {
    role: 'ADMIN' | 'EMPLOYEE' | null;
    loading: boolean;
    login: (role: 'ADMIN' | 'EMPLOYEE') => Promise<void>;
    logout: () => void;
    switchRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGIN_MUTATION = gql`
  mutation Login($role: String!) {
    login(role: $role) {
      token
      role
    }
  }
`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE' | null>(null);
    const [loading, setLoading] = useState(true); // Default to true to prevent flash
    const [loginMutation] = useMutation(LOGIN_MUTATION);

    // Check local storage on initial load
    useEffect(() => {
        const savedRole = localStorage.getItem('userRole');
        if (savedRole === 'ADMIN' || savedRole === 'EMPLOYEE') {
            setRole(savedRole);
        }
        setLoading(false); // Done checking
    }, []);

    const login = async (selectedRole: 'ADMIN' | 'EMPLOYEE') => {
        try {
            const { data } = await loginMutation({ variables: { role: selectedRole } });
            if (data?.login?.token) {
                localStorage.setItem('token', data.login.token);
                localStorage.setItem('userRole', selectedRole);
                setRole(selectedRole);
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please try again.");
        }
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
