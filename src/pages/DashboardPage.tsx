import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import CompanyResearchForm from '../components/dashboard/CompanyResearchForm';
import ResearchResults from '../components/dashboard/ResearchResults';
import { CompanyResearchRequest, CompanyResearch, ApiError } from '../types/api';
import { companyService } from '../services/companyService';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [research, setResearch] = useState<CompanyResearch | null>(null);
    const [error, setError] = useState<string>('');

    // Load research from localStorage on component mount
    useEffect(() => {
        const loadStoredResearch = () => {
            try {
                // Clear any old format localStorage data
                const oldKey = 'clientiq_last_research';
                if (localStorage.getItem(oldKey)) {
                    console.log('Removing old format research data');
                    localStorage.removeItem(oldKey);
                }

                const storageKey = `clientiq_last_research_${user?._id || 'guest'}`;
                const storedResearch = localStorage.getItem(storageKey);
                if (storedResearch) {
                    const parsedResearch = JSON.parse(storedResearch);

                    // Validate that the research has required fields
                    if (!parsedResearch._id) {
                        console.warn('Stored research missing _id, removing from storage');
                        localStorage.removeItem(storageKey);
                        return;
                    }

                    // Check if the research is not too old (e.g., less than 24 hours)
                    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
                    const researchTime = new Date(parsedResearch.createdAt).getTime();

                    if (researchTime > twentyFourHoursAgo) {
                        console.log('Loading stored research with ID:', parsedResearch._id);
                        setResearch(parsedResearch);
                    } else {
                        // Remove old research
                        localStorage.removeItem(storageKey);
                    }
                }
            } catch (error) {
                console.error('Failed to load stored research:', error);
                const storageKey = `clientiq_last_research_${user?._id || 'guest'}`;
                localStorage.removeItem(storageKey);
            }
        };

        if (user) {
            loadStoredResearch();
        }
    }, [user]);

    const handleResearchSubmit = async (data: CompanyResearchRequest) => {
        setLoading(true);
        setError('');
        setResearch(null);

        // Clear previous research from localStorage
        const storageKey = `clientiq_last_research_${user?._id || 'guest'}`;
        localStorage.removeItem(storageKey);

        try {
            const response = await companyService.generateResearch(data);

            // Validate the response has the required _id field
            if (!response.research._id) {
                console.error('Backend response missing _id:', response.research);
                throw new Error('Invalid response from server - missing research ID');
            }

            console.log('Successfully generated research with ID:', response.research._id);
            setResearch(response.research);

            // Store research in localStorage for persistence across refreshes
            localStorage.setItem(storageKey, JSON.stringify(response.research));
        } catch (error) {
            const apiError = error as ApiError;
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveResearch = async (id: string) => {
        if (!research) return;

        // Debug: Check if ID is valid
        console.log('Attempting to save research with ID:', id);
        console.log('Current research object:', research);

        if (!id || id === 'undefined') {
            console.error('Invalid research ID:', id);
            throw new Error('Invalid research ID. Cannot save research.');
        }

        try {
            const response = await companyService.toggleSaveResearch(id);
            // Update the local research state
            const updatedResearch = {
                ...research,
                isSaved: response.research.isSaved,
            };

            setResearch(updatedResearch);

            // Update localStorage with the new saved status
            const storageKey = `clientiq_last_research_${user?._id || 'guest'}`;
            localStorage.setItem(storageKey, JSON.stringify(updatedResearch));
        } catch (error) {
            console.error('Save research error:', error);
            throw error; // Re-throw to be handled by the component
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'transparent',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                        color: 'white',
                    }}
                >
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(45deg, #ffffff 30%, #f0f4ff 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                        }}
                    >
                        🚀 AI-Powered Company Research
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            opacity: 0.9,
                            mb: 1,
                        }}
                    >
                        Welcome back, {user?.firstName}! Generate insights for any company in seconds.
                    </Typography>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: 20,
                            px: 3,
                            py: 1,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                    >

                    </Box>
                </Box>

                {/* Error Display */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            backdropFilter: 'blur(20px)',
                            background: 'rgba(244, 67, 54, 0.1)',
                            border: '1px solid rgba(244, 67, 54, 0.2)',
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Research Form */}
                <CompanyResearchForm
                    onSubmit={handleResearchSubmit}
                    loading={loading}
                />

                {/* Research Results */}
                {research && (
                    <Box sx={{ mt: 4 }}>
                        <ResearchResults
                            research={research}
                            onSave={handleSaveResearch}
                        />
                    </Box>
                )}

                {/* Getting Started Help */}
                {!research && !loading && !error && (
                    <Box
                        sx={{
                            mt: 6,
                            p: 4,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            textAlign: 'center',
                            color: 'white',
                        }}
                    >
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                            🎯 Ready to research any company?
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                            Enter a company name above to get started with AI-powered insights.
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: 3,
                                mt: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                    📊 Company Overview
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Comprehensive analysis of company structure and operations
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                    ⚠️ Pain Points
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Key business challenges and opportunities
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                    🎯 Custom Sales Pitch
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Tailored B2B pitch based on company insights
                                </Typography>
                            </Box>

                            {user?.role === 'premium' && (
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 193, 7, 0.2) 100%)',
                                        border: '1px solid rgba(255, 215, 0, 0.3)',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        ✨ Premium Features
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Market trends, alternative pitches, and detailed insights
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default DashboardPage;
