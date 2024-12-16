import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
    const token = localStorage.getItem('token');
    return isAuthenticated && token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
