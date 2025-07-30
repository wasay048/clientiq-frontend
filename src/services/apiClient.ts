import { ApiError } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class ApiClient {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async makeRequest<T>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = localStorage.getItem('clientiq_token');

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(`${this.baseURL}${url}`, config);

            // Handle authentication errors
            if (response.status === 401) {
                localStorage.removeItem('clientiq_token');
                localStorage.removeItem('clientiq_user');
            }

            const data = await response.json();

            if (!response.ok) {
                const apiError: ApiError = {
                    error: data.error || 'Request failed',
                    message: data.message || 'An error occurred',
                    details: data.details,
                };
                throw apiError;
            }

            return data;
        } catch (error: any) {
            if (error.name === 'TypeError' || !error.error) {
                // Network error or other fetch error
                const networkError: ApiError = {
                    error: 'Network Error',
                    message: 'Unable to connect to server. Please check your connection.',
                };
                throw networkError;
            }
            throw error;
        }
    }

    // GET request
    async get<T>(url: string): Promise<T> {
        return this.makeRequest<T>(url, { method: 'GET' });
    }

    // POST request
    async post<T>(url: string, data?: any): Promise<T> {
        return this.makeRequest<T>(url, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PUT request
    async put<T>(url: string, data?: any): Promise<T> {
        return this.makeRequest<T>(url, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // DELETE request
    async delete<T>(url: string): Promise<T> {
        return this.makeRequest<T>(url, { method: 'DELETE' });
    }

    // Update base URL if needed
    setBaseURL(baseURL: string) {
        this.baseURL = baseURL;
    }

    // Get current base URL
    getBaseURL(): string {
        return this.baseURL;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing purposes
export { ApiClient };
