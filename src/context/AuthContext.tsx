import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

interface User {
    _id: string;
    username: string;
    avatar: string;
    stats: {
        xp: number;
        difficulty: number;
        seeds: number;
        streak: number;
        maxStreak: number;
    };
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string, avatar: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: { username?: string, avatar?: string }) => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/user/profile');
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
    };

    const signup = async (username: string, password: string, avatar: string) => {
        const response = await api.post('/auth/signup', { username, password, avatar });
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (data: { username?: string, avatar?: string }) => {
        const response = await api.put('/user/profile', data);
        setUser(response.data);
    };

    const updateUser = (userData: User) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
