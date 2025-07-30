import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginData, RegisterData } from '../types/api';
import { authService } from '../services/authService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on app start
    useEffect(() => {
        const loadStoredAuth = () => {
            try {
                const storedToken = localStorage.getItem('clientiq_token');
                const storedUser = localStorage.getItem('clientiq_user');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    // Optionally validate token with backend here
                }
            } catch (error) {
                console.error('Failed to load stored auth:', error);
                // Clear invalid stored data
                localStorage.removeItem('clientiq_token');
                localStorage.removeItem('clientiq_user');
            } finally {
                setLoading(false);
            }
        };

        loadStoredAuth();
    }, []);

    const login = async (data: LoginData) => {
        try {
            setLoading(true);
            const response: AuthResponse = await authService.login(data);

            setUser(response.user);
            setToken(response.token);

            // Store in localStorage
            localStorage.setItem('clientiq_token', response.token);
            localStorage.setItem('clientiq_user', JSON.stringify(response.user));

        } catch (error) {
            // Error handling is done in the component
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setLoading(true);
            const response: AuthResponse = await authService.register(data);

            setUser(response.user);
            setToken(response.token);

            // Store in localStorage
            localStorage.setItem('clientiq_token', response.token);
            localStorage.setItem('clientiq_user', JSON.stringify(response.user));

        } catch (error) {
            // Error handling is done in the component
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Clear research data for current user before logout
        if (user?._id) {
            localStorage.removeItem(`clientiq_last_research_${user._id}`);
        }

        setUser(null);
        setToken(null);

        // Clear localStorage
        localStorage.removeItem('clientiq_token');
        localStorage.removeItem('clientiq_user');
        localStorage.removeItem('clientiq_last_research'); // Clean up old format

        // Optionally call backend logout endpoint
        if (token) {
            authService.logout().catch(error => {
                console.error('Logout error:', error);
            });
        }
    };

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
