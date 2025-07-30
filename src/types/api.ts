export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'basic' | 'premium';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
    refreshToken?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

export interface CompanyResearchRequest {
    companyName: string;
    companyWebsite?: string;
    industry?: string;
}

export interface CompanyDetails {
    industry?: string;
    sector?: string;
    companySize?: string;
    employees?: string;
    headquarters: string;
    location?: string;
    founded?: string;
    revenue?: string;
    businessModel?: string;
    offerings?: string;
    recentNews?: string;
    marketPosition?: string;
}

export interface ContactInfo {
    website?: string;
    emails?: string[];
    phones?: string[];
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
    address?: string;
    generalEmail?: string;
    salesEmail?: string;
    supportEmail?: string;
    mediaEmail?: string;
}

export interface CompanyResearch {
    _id: string;
    
    companyName: string;
    results: {
        overview: string;
        companyDetails?: CompanyDetails;
        contactInfo?: ContactInfo;
        painPoints: string[];
    
        pitch: string;
        decisionMakers?: string[];
        additionalInsights?: string;
        technologies?: string[];
    };
    createdAt: string;
    isSaved: boolean;
    rating?: number;
    notes?: string;
    tags?: string[];
}

export interface ResearchResponse {
    message: string;
    research: CompanyResearch;
    tokensUsed?: number;
}

export interface ResearchHistoryResponse {
    research: CompanyResearch[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface ApiError {
    error: string;
    message: string;
    details?: string[];
}
