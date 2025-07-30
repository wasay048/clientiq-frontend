import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Logout as LogoutIcon,
    Person as PersonIcon,
    BusinessCenter as BusinessIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials, getAvatarColor } from '../../utils/helpers';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    if (!user) {
        return <>{children}</>;
    }

    const userInitials = getInitials(user.firstName, user.lastName);
    const avatarColor = getAvatarColor(user.firstName + user.lastName);

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <Toolbar sx={{ py: 1 }}>
                    {/* Logo/Brand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                mr: 2,
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            }}
                        >
                            <BusinessIcon sx={{ fontSize: 24, color: 'white' }} />
                        </Box>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: isMobile ? '1.3rem' : '1.6rem',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            ClientIQ
                        </Typography>
                    </Box>

                    {/* User Info */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#2d3748',
                                    fontWeight: 500,
                                    mr: 2,
                                }}
                            >
                                Welcome, {user.firstName}
                            </Typography>

                            {/* User Role Badge */}
                            <Box
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 20,
                                    background: user?.role === 'premium'
                                        ? 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)'
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: user?.role === 'premium' ? '#000' : 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: user?.role === 'premium'
                                        ? '0 4px 15px rgba(255, 215, 0, 0.4)'
                                        : '0 4px 15px rgba(102, 126, 234, 0.4)',
                                }}
                            >
                                {user?.role === 'premium' ? '✨ Premium' : '📊 Basic'}
                            </Box>
                        </Box>
                    )}

                    {/* User Avatar */}
                    <IconButton
                        onClick={handleMenuOpen}
                        sx={{
                            p: 0,
                            ml: 1,
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: avatarColor,
                                width: 40,
                                height: 40,
                                fontWeight: 600,
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                border: '2px solid white',
                            }}
                        >
                            {userInitials}
                        </Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>
            {/* User Menu */}
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: 2,
                        minWidth: 200,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(20px)',
                        background: 'rgba(255, 255, 255, 0.95)',
                    },
                }}
            >
                <MenuItem disabled sx={{ py: 2 }}>
                    <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
                    <Box>
                        <Typography variant="body1" fontWeight="600" sx={{ color: '#2d3748' }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                            {user.email}
                        </Typography>
                    </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#e53e3e' }}>
                    <LogoutIcon sx={{ mr: 2 }} />
                    <Typography variant="body2" fontWeight="500">
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: 10, // Account for AppBar height
                    minHeight: '100vh',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
