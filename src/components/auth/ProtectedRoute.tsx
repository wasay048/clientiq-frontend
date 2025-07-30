import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import AuthPage from '../../pages/AuthPage';
import { useAuth } from '../../contexts/AuthContext';


interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#f5f5f5',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <AuthPage />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
