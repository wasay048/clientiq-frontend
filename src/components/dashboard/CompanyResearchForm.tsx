import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import {
    Search as SearchIcon,
    Business as BusinessIcon,
    Language as LanguageIcon,
    Category as CategoryIcon,
} from '@mui/icons-material';
import { CompanyResearchRequest, ApiError } from '../../types/api';

interface CompanyResearchFormProps {
    onSubmit: (data: CompanyResearchRequest) => Promise<void>;
    loading: boolean;
}

const CompanyResearchForm: React.FC<CompanyResearchFormProps> = ({
    onSubmit,
    loading,
}) => {
    const [formData, setFormData] = useState<CompanyResearchRequest>({
        companyName: '',
        companyWebsite: '',
        industry: '',
    });
    const [errors, setErrors] = useState<Partial<CompanyResearchRequest>>({});
    const [apiError, setApiError] = useState<string>('');

    const handleChange = (field: keyof CompanyResearchRequest) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: '',
            }));
        }

        // Clear API error
        if (apiError) {
            setApiError('');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<CompanyResearchRequest> = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        } else if (formData.companyName.trim().length < 2) {
            newErrors.companyName = 'Company name must be at least 2 characters';
        }

        // Website validation (optional)
        if (formData.companyWebsite && formData.companyWebsite.trim()) {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(formData.companyWebsite)) {
                newErrors.companyWebsite = 'Please enter a valid website URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        try {
            // Clean data - remove empty optional fields
            const cleanData: CompanyResearchRequest = {
                companyName: formData.companyName.trim(),
                ...(formData.companyWebsite?.trim() && { companyWebsite: formData.companyWebsite.trim() }),
                ...(formData.industry?.trim() && { industry: formData.industry.trim() }),
            };

            await onSubmit(cleanData);
        } catch (error) {
            const apiError = error as ApiError;
            setApiError(apiError.message);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, md: 5 },
                mb: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mb: 2,
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    }}
                >
                    <SearchIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: '#2d3748',
                        mb: 1,
                    }}
                >
                    Generate Company Research
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#718096',
                        maxWidth: 500,
                        mx: 'auto',
                        lineHeight: 1.6,
                    }}
                >
                    Enter a company name to get AI-powered insights, pain points, and custom sales pitches
                </Typography>
            </Box>

            {/* Error Alert */}
            {apiError && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        background: 'rgba(244, 67, 54, 0.1)',
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                    }}
                >
                    {apiError}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Company Name Field - Required */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Company Name"
                        value={formData.companyName}
                        onChange={handleChange('companyName')}
                        error={!!errors.companyName}
                        helperText={errors.companyName || 'Required field'}
                        autoFocus
                        placeholder="e.g., Microsoft, Apple, Tesla"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontSize: '1.1rem',
                                height: 60,
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '1.1rem',
                                fontWeight: 500,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BusinessIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Company Website Field - Optional */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Company Website"
                        value={formData.companyWebsite}
                        onChange={handleChange('companyWebsite')}
                        error={!!errors.companyWebsite}
                        helperText={errors.companyWebsite || 'Optional - helps improve research accuracy'}
                        placeholder="e.g., https://www.company.com"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontSize: '1.1rem',
                                height: 60,
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '1.1rem',
                                fontWeight: 500,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LanguageIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Industry Field - Optional */}
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Industry"
                        value={formData.industry}
                        onChange={handleChange('industry')}
                        placeholder="e.g., Technology, Healthcare, Finance"
                        helperText="Optional - helps tailor the research"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontSize: '1.1rem',
                                height: 60,
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '1.1rem',
                                fontWeight: 500,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CategoryIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                        height: 60,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        },
                        '&:disabled': {
                            background: 'rgba(102, 126, 234, 0.5)',
                            transform: 'none',
                        },
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                            <Typography sx={{ fontWeight: 600 }}>
                                Generating Research...
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SearchIcon sx={{ fontSize: 24 }} />
                            Generate Research
                        </Box>
                    )}
                </Button>

                {loading && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 3,
                            textAlign: 'center',
                            borderRadius: 2,
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#667eea',
                                fontWeight: 500,
                            }}
                        >
                            🤖 Our AI is analyzing the company and generating insights...
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#718096',
                                mt: 1,
                            }}
                        >
                            This usually takes 10-30 seconds
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default CompanyResearchForm;
