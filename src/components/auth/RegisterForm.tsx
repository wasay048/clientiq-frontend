import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Link,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    BusinessCenter as BusinessIcon,
} from '@mui/icons-material';
import { authService } from '../../services/authService';
import { isValidEmail } from '../../utils/helpers';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
    const [apiError, setApiError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (field: keyof RegisterFormData) => (
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
        const newErrors: Partial<RegisterFormData> = {};

        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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

        setLoading(true);
        try {
            await authService.register(formData);

            // Show success and redirect to login
            setApiError('');
            // You might want to show a success message here
            setTimeout(() => {
                onSwitchToLogin();
            }, 1000);
        } catch (error: any) {
            const errorMessage = error.message || 'Registration failed. Please try again.';
            setApiError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 4, md: 6 },
                    width: '100%',
                    maxWidth: 480,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                }}
                className="slide-in-up"
            >
                {/* Header */}
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
                        className="pulse-animation"
                    >
                        <BusinessIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                        }}
                    >
                        ClientIQ
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#718096',
                            fontWeight: 500,
                        }}
                    >
                        AI-Powered B2B Company Research Tool
                    </Typography>
                </Box>

                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    textAlign="center"
                    sx={{
                        fontWeight: 700,
                        color: '#2d3748',
                        mb: 3,
                    }}
                >
                    Create Account ✨
                </Typography>

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

                {/* Register Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {/* Name Fields */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.firstName}
                            onChange={handleChange('firstName')}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            autoComplete="given-name"
                            autoFocus
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
                                        <PersonIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.lastName}
                            onChange={handleChange('lastName')}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            autoComplete="family-name"
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
                                        <PersonIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>                    {/* Email Field */}
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            error={!!errors.email}
                            helperText={errors.email}
                            autoComplete="email"
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
                                        <EmailIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Password Field */}
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange('password')}
                            error={!!errors.password}
                            helperText={errors.password}
                            autoComplete="new-password"
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
                                        <LockIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: '#667eea' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Confirm Password Field */}
                    <Box sx={{ mb: 4 }}>
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            autoComplete="new-password"
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
                                        <LockIcon sx={{ color: '#667eea', fontSize: 24 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            sx={{ color: '#667eea' }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
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
                            mb: 3,
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
                                    Creating Account...
                                </Typography>
                            </Box>
                        ) : (
                            'Register 🚀'
                        )}
                    </Button>

                    {/* Login Link */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: '#718096', fontWeight: 500 }}>
                            Already have an account?{' '}
                            <Link
                                component="button"
                                type="button"
                                variant="body1"
                                onClick={onSwitchToLogin}
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegisterForm;
