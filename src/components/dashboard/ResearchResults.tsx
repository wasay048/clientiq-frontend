import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Chip,
    Alert,
    Snackbar,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';

import {
    ContentCopy as CopyIcon,
    Save as SaveIcon,
    Business as BusinessIcon,
    Warning as WarningIcon,
    Campaign as CampaignIcon,
    Insights as InsightsIcon,
    CheckCircle as CheckIcon,
    ContactMail as ContactIcon,
    People as PeopleIcon,
    Computer as TechIcon,
    Info as InfoIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as WebsiteIcon,
    LinkedIn as LinkedInIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { CompanyResearch } from '../../types/api';
import { copyToClipboard, formatDate } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/masonry.css';

interface ResearchResultsProps {
    research: CompanyResearch;
    onSave?: (id: string) => Promise<void>;
    saving?: boolean;
}

// Add this validation error dialog component
const ValidationErrorDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    message: string;
}> = ({ open, onClose, message }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    borderBottom: '1px solid #fecaca',
                }}
            >
                <ErrorIcon sx={{ fontSize: 28 }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    Invalid Company
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        '& .MuiAlert-icon': {
                            fontSize: 24
                        }
                    }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Company Validation Failed
                    </Typography>
                </Alert>
                <DialogContentText sx={{ fontSize: 16, lineHeight: 1.6, color: '#374151' }}>
                    {message}
                </DialogContentText>
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        Please ensure you enter:
                    </Typography>
                    <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 0 }}>
                        <li>A real, existing company name</li>
                        <li>A valid company website (if provided)</li>
                        <li>Avoid test names like "test company", "fake business", etc.</li>
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, backgroundColor: '#f9fafb' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: '#dc2626',
                        '&:hover': {
                            backgroundColor: '#b91c1c',
                        },
                        fontWeight: 600,
                        px: 3,
                    }}
                >
                    Got It
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ResearchResults: React.FC<ResearchResultsProps> = ({
    research,
    onSave,
    saving = false,
}) => {
    const { user } = useAuth();
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // Add state for validation error dialog
    const [validationError, setValidationError] = useState<{
        open: boolean;
        message: string;
    }>({
        open: false,
        message: '',
    });

    const handleCopy = async (text: string, label: string) => {
        const success = await copyToClipboard(text);
        setSnackbar({
            open: true,
            message: success ? `${label} copied to clipboard!` : 'Failed to copy to clipboard',
            severity: success ? 'success' : 'error',
        });
    };

    // Helper function to replace placeholder with the researched company name
    const personalizedPitch = (pitch: string) => {
        // Replace placeholder with the actual company name being researched
        return pitch.replace(/\[Your Company Name\]/g, research.companyName);
    };

    const handleSave = async () => {
        if (onSave) {
            try {
                console.log('ResearchResults: Attempting to save research');
                console.log('Research ID:', research._id);
                console.log('Full research object:', research);

                if (!research._id) {
                    throw new Error('Research ID is missing');
                }

                await onSave(research._id);
                setSnackbar({
                    open: true,
                    message: research.isSaved ? 'Research unsaved!' : 'Research saved!',
                    severity: 'success',
                });
            } catch (error) {
                console.error('ResearchResults save error:', error);
                setSnackbar({
                    open: true,
                    message: `Failed to save research: ${typeof error === 'object' && error !== null && 'message' in error
                        ? (error as { message: string }).message
                        : String(error)
                        }`,
                    severity: 'error',
                });
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Add handler for validation error dialog
    const handleCloseValidationError = () => {
        setValidationError({ open: false, message: '' });
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '100%',
                overflowX: 'hidden',
            }}
        >
            <Box sx={{ mb: 4 }}>
                {/* Header */}
                <Paper
                    elevation={0}
                    className="masonry-header-card"
                    sx={{
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box>
                            <Typography
                                variant="h3"
                                component="h2"
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
                                {research.companyName}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#718096', fontWeight: 500 }}>
                                Research generated on {formatDate(research.createdAt)}
                            </Typography>
                        </Box>

                        {onSave && (
                            <Tooltip title={research.isSaved ? 'Remove from saved' : 'Save research'}>
                                <IconButton
                                    onClick={handleSave}
                                    disabled={saving}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        background: research.isSaved
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : 'rgba(102, 126, 234, 0.1)',
                                        border: research.isSaved ? 'none' : '2px solid #667eea',
                                        color: research.isSaved ? 'white' : '#667eea',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {research.isSaved ? <CheckIcon /> : <SaveIcon />}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    {research.isSaved && (
                        <Chip
                            label="✓ Saved"
                            sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: 20,
                                px: 1,
                            }}
                        />
                    )}
                </Paper>

                {/* Results Cards with Masonry Layout */}
                <Box className="masonry-container">
                    {/* Company Overview Card */}
                    <Card elevation={0} className="masonry-card masonry-overview-card">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box className="card-icon" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    <BusinessIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h5" className="card-title">
                                    📊 Company Overview
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                {research.results.overview}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<CopyIcon />}
                                size="small"
                                onClick={() => handleCopy(research.results.overview, 'Company overview')}
                            >
                                Copy
                            </Button>
                        </CardActions>
                    </Card>

                    {/* Pain Points Card */}
                    <Card elevation={0} className="masonry-card masonry-pain-points-card">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box className="card-icon" sx={{ background: 'linear-gradient(135deg, #f56565 0%, #ed8936 100%)' }}>
                                    <WarningIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h5" className="card-title">
                                    ⚠️ Pain Points
                                </Typography>
                            </Box>

                            {research.results.painPoints?.length > 0 ? (
                                <List dense>
                                    {research.results.painPoints.map((painPoint, index) => (
                                        <ListItem key={index} sx={{ px: 0 }}>
                                            <ListItemText
                                                primary={`• ${painPoint}`}
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    sx: { lineHeight: 1.5 },
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No pain points identified
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<CopyIcon />}
                                size="small"
                                onClick={() =>
                                    handleCopy(
                                        research.results.painPoints?.join('\n• ') || '',
                                        'Pain points'
                                    )
                                }
                            >
                                Copy All
                            </Button>
                        </CardActions>
                    </Card>

                    {/* Sales Pitch Card */}
                    <Card elevation={0} className="masonry-card masonry-sales-pitch-card">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box className="card-icon" sx={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                                    <CampaignIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h5" className="card-title">
                                    💬 Custom Sales Pitch
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                {personalizedPitch(research.results.pitch)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<CopyIcon />}
                                size="small"
                                onClick={() => handleCopy(personalizedPitch(research.results.pitch), 'Sales pitch')}
                                variant="contained"
                                sx={{ mr: 1 }}
                            >
                                Copy Pitch
                            </Button>
                            {user?.role === 'premium' && (
                                <Button size="small" variant="outlined">
                                    Generate Alternative
                                </Button>
                            )}
                        </CardActions>
                    </Card>

                    {/* Company Details Card */}
                    {research.results.companyDetails && (
                        <Card elevation={0} className="masonry-card masonry-company-details-card">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box className="card-icon" sx={{ background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' }}>
                                        <InfoIcon sx={{ color: 'white', fontSize: 24 }} />
                                    </Box>
                                    <Typography variant="h5" className="card-title">
                                        🏢 Company Details
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'grid', gap: 1.5 }}>
                                    {research.results.companyDetails.industry && (
                                        <Typography variant="body2">
                                            <strong>Industry:</strong> {research.results.companyDetails.industry}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.companySize && (
                                        <Typography variant="body2">
                                            <strong>Company Size:</strong> {research.results.companyDetails.companySize}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.employees && (
                                        <Typography variant="body2">
                                            <strong>Employees:</strong> {research.results.companyDetails.employees}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.headquarters && (
                                        <Typography variant="body2">
                                            <strong>Headquarters:</strong> {research.results.companyDetails.headquarters}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.location && (
                                        <Typography variant="body2">
                                            <strong>Location:</strong> {research.results.companyDetails.location}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.founded && (
                                        <Typography variant="body2">
                                            <strong>Founded:</strong> {research.results.companyDetails.founded}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.revenue && (
                                        <Typography variant="body2">
                                            <strong>Revenue:</strong> {research.results.companyDetails.revenue}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.businessModel && (
                                        <Typography variant="body2">
                                            <strong>Business Model:</strong> {research.results.companyDetails.businessModel}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.sector && (
                                        <Typography variant="body2">
                                            <strong>Sector:</strong> {research.results.companyDetails.sector}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.offerings && (
                                        <Typography variant="body2">
                                            <strong>Offerings:</strong> {research.results.companyDetails.offerings}
                                        </Typography>
                                    )}
                                    {research.results.companyDetails.marketPosition && (
                                        <Typography variant="body2">
                                            <strong>Market Position:</strong> {research.results.companyDetails.marketPosition}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<CopyIcon />}
                                    size="small"
                                    onClick={() =>
                                        handleCopy(
                                            Object.entries(research.results.companyDetails || {})
                                                .map(([key, value]) => `${key}: ${value}`)
                                                .join('\n'),
                                            'Company details'
                                        )
                                    }
                                >
                                    Copy Details
                                </Button>
                            </CardActions>
                        </Card>
                    )}

                    {/* Contact Information Card */}
                    {research.results.contactInfo && (
                        <Card elevation={0} className="masonry-card masonry-contact-card">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box className="card-icon" sx={{ background: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)' }}>
                                        <ContactIcon sx={{ color: 'white', fontSize: 24 }} />
                                    </Box>
                                    <Typography variant="h5" className="card-title">
                                        📞 Contact Information
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'grid', gap: 2 }}>
                                    {research.results.contactInfo.website && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <WebsiteIcon sx={{ color: '#4299e1', fontSize: 20 }} />
                                            <Typography variant="body2">
                                                <strong>Website:</strong> {research.results.contactInfo.website}
                                            </Typography>
                                        </Box>
                                    )}

                                    {research.results.contactInfo.emails && research.results.contactInfo.emails.length > 0 && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon sx={{ color: '#48bb78', fontSize: 20 }} />
                                            <Typography variant="body2">
                                                <strong>Email:</strong> {research.results.contactInfo.emails.join(', ')}
                                            </Typography>
                                        </Box>
                                    )}

                                    {research.results.contactInfo.phones && research.results.contactInfo.phones.length > 0 && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon sx={{ color: '#ed8936', fontSize: 20 }} />
                                            <Typography variant="body2">
                                                <strong>Phone:</strong> {research.results.contactInfo.phones.join(', ')}
                                            </Typography>
                                        </Box>
                                    )}

                                    {research.results.contactInfo.linkedin && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinkedInIcon sx={{ color: '#0077b5', fontSize: 20 }} />
                                            <Typography variant="body2">
                                                <strong>LinkedIn:</strong> {research.results.contactInfo.linkedin}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<CopyIcon />}
                                    size="small"
                                    onClick={() => {
                                        const contactText = Object.entries(research.results.contactInfo || {})
                                            .filter(([_, value]) => value && value !== 'Not available')
                                            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                                            .join('\n');
                                        handleCopy(contactText, 'Contact information');
                                    }}
                                >
                                    Copy All
                                </Button>
                            </CardActions>
                        </Card>
                    )}

                    {/* Decision Makers Card */}
                    {research.results.decisionMakers?.length && research.results.decisionMakers[0] !== 'Not available' && (
                        <Card elevation={0} className="masonry-card masonry-decision-makers-card">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box className="card-icon" sx={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)' }}>
                                        <PeopleIcon sx={{ color: 'white', fontSize: 24 }} />
                                    </Box>
                                    <Typography variant="h5" className="card-title">
                                        👥 Decision Makers
                                    </Typography>
                                </Box>

                                <List dense>
                                    {research.results.decisionMakers.map((maker, index) => (
                                        <ListItem key={index} sx={{ px: 0 }}>
                                            <ListItemText
                                                primary={`• ${maker}`}
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    sx: { lineHeight: 1.5, fontWeight: 500 },
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<CopyIcon />}
                                    size="small"
                                    onClick={() =>
                                        handleCopy(
                                            research.results.decisionMakers?.join('\n• ') || '',
                                            'Decision makers'
                                        )
                                    }
                                >
                                    Copy All
                                </Button>
                            </CardActions>
                        </Card>
                    )}

                    {/* Technologies Card */}
                    <Card elevation={0} className="masonry-card masonry-technologies-card">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box className="card-icon" sx={{ background: 'linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%)' }}>
                                    <TechIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h5" className="card-title">
                                    💻 Technologies Used
                                </Typography>
                            </Box>

                            {research.results.technologies?.length ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {research.results.technologies.map((tech, index) => (
                                        <Chip
                                            key={index}
                                            label={tech}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#1565c0',
                                                color: 'white',
                                                fontWeight: 600,
                                                border: '1px solid #1976d2',
                                                '&:hover': {
                                                    backgroundColor: '#1976d2',
                                                    transform: 'scale(1.05)',
                                                    boxShadow: '0 2px 8px rgba(21, 101, 192, 0.3)',
                                                },
                                                transition: 'all 0.2s ease-in-out',
                                            }}
                                        />
                                    ))}
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 1,
                                        backgroundColor: '#f3f4f6',
                                        border: '1px dashed #d1d5db',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No technologies identified
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<CopyIcon />}
                                size="small"
                                disabled={!research.results.technologies?.length}
                                onClick={() =>
                                    handleCopy(
                                        research.results.technologies?.join(', ') || '',
                                        'Technologies'
                                    )
                                }
                            >
                                Copy All
                            </Button>
                        </CardActions>
                    </Card>

                    {/* Additional Insights Card */}
                    {research.results.additionalInsights && (
                        <Card elevation={0} className="masonry-card masonry-premium-card">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box className="card-icon" sx={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffc107 100%)' }}>
                                        <InsightsIcon sx={{ color: 'white', fontSize: 24 }} />
                                    </Box>
                                    <Typography variant="h5" className="card-title">
                                        ✨ Additional Insights
                                    </Typography>
                                    <Chip
                                        label="Premium"
                                        size="small"
                                        sx={{
                                            ml: 2,
                                            backgroundColor: '#ffd700',
                                            color: '#000',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>
                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                    {research.results.additionalInsights}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<CopyIcon />}
                                    size="small"
                                    onClick={() =>
                                        handleCopy(research.results.additionalInsights || '', 'Additional insights')
                                    }
                                >
                                    Copy Insights
                                </Button>
                            </CardActions>
                        </Card>
                    )}
                </Box>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Add Validation Error Dialog */}
            <ValidationErrorDialog
                open={validationError.open}
                onClose={handleCloseValidationError}
                message={validationError.message}
            />
        </Box>
    );
};

export default ResearchResults;
