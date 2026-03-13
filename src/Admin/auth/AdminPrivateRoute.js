import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminPrivateRoute = ({ children }) => {
    const { isAdminAuthenticated, isVerifying } = useAdminAuth();

    // While verifying the stored token, show a spinner — never flash the panel
    if (isVerifying) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #ddd',
                    borderTop: '4px solid #af2031',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Token verified — allow through or redirect to login
    return isAdminAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;
