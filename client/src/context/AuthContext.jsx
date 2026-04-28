import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('nimmathi_user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('nimmathi_user', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('nimmathi_user');
        delete api.defaults.headers.common['Authorization'];
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};