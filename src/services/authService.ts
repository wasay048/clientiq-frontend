import { apiClient } from './apiClient';
import { AuthResponse, LoginData, RegisterData, User } from '../types/api';

export const authService = {
    /**
     * Login user
     */
    async login(data: LoginData): Promise<AuthResponse> {
        return await apiClient.post<AuthResponse>('/api/auth/login', data);
    },

    /**
     * Register new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        const { confirmPassword, ...registerData } = data;

        // Validate passwords match
        if (data.password !== confirmPassword) {
            throw {
                error: 'Validation Error',
                message: 'Passwords do not match'
            };
        }

        return await apiClient.post<AuthResponse>('/api/auth/register', registerData);
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<{ user: User }> {
        return await apiClient.get<{ user: User }>('/api/auth/profile');
    },

    /**
     * Update user profile
     */
    async updateProfile(data: { firstName: string; lastName: string }): Promise<{ message: string; user: User }> {
        return await apiClient.put<{ message: string; user: User }>('/api/auth/profile', data);
    },

    /**
     * Change password
     */
    async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
        return await apiClient.put<{ message: string }>('/api/auth/password', data);
    },

    /**
     * Refresh token
     */
    async refreshToken(): Promise<{ message: string; token: string }> {
        return await apiClient.post<{ message: string; token: string }>('/api/auth/refresh');
    },

    /**
     * Logout user
     */
    async logout(): Promise<{ message: string }> {
        return await apiClient.post<{ message: string }>('/api/auth/logout');
    },
};
