import { apiClient } from './apiClient';
import {
    CompanyResearchRequest,
    ResearchResponse,
    ResearchHistoryResponse,
    CompanyResearch
} from '../types/api';

export const companyService = {
    /**
     * Generate company research using AI
     */
    async generateResearch(data: CompanyResearchRequest): Promise<ResearchResponse> {
        return await apiClient.post<ResearchResponse>('/api/company/research', data);
    },

    /**
     * Get user's research history
     */
    async getHistory(params?: {
        limit?: number;
        page?: number;
    }): Promise<ResearchHistoryResponse> {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.page) queryParams.append('page', params.page.toString());

        const url = `/api/company/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await apiClient.get<ResearchHistoryResponse>(url);
    },

    /**
     * Get specific research by ID
     */
    async getResearchById(id: string): Promise<{ research: CompanyResearch }> {
        return await apiClient.get<{ research: CompanyResearch }>(`/api/company/research/${id}`);
    },

    /**
     * Search user's research
     */
    async searchResearch(params: {
        q: string;
        limit?: number;
        page?: number;
    }): Promise<ResearchHistoryResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('q', params.q);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.page) queryParams.append('page', params.page.toString());

        const url = `/api/company/search?${queryParams.toString()}`;
        return await apiClient.get<ResearchHistoryResponse>(url);
    },

    /**
     * Get saved research
     */
    async getSavedResearch(params?: {
        limit?: number;
        page?: number;
    }): Promise<ResearchHistoryResponse> {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.page) queryParams.append('page', params.page.toString());

        const url = `/api/company/saved${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await apiClient.get<ResearchHistoryResponse>(url);
    },

    /**
     * Save or unsave research
     */
    async toggleSaveResearch(
        id: string,
        data?: {
            notes?: string;
            rating?: number;
            tags?: string[];
        }
    ): Promise<{
        message: string;
        research: {
            id: string;
            isSaved: boolean;
            notes?: string;
            rating?: number;
            tags?: string[];
        };
    }> {
        return await apiClient.put(`/api/company/research/${id}/save`, data || {});
    },

    /**
     * Delete research
     */
    async deleteResearch(id: string): Promise<{ message: string }> {
        return await apiClient.delete<{ message: string }>(`/api/company/research/${id}`);
    },

    /**
     * Generate alternative pitch (Premium feature)
     */
    async generateAlternativePitch(
        id: string,
        angle: 'cost-saving' | 'growth' | 'efficiency' | 'innovation' | 'competitive-advantage'
    ): Promise<{
        message: string;
        originalPitch: string;
        alternativePitch: string;
        angle: string;
    }> {
        return await apiClient.post(`/api/company/research/${id}/alternative-pitch`, { angle });
    },
};
