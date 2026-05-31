import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Buscamos si existe un token guardado en el navegador
    const token = localStorage.getItem('token');

    // Si no hay token, lo mandamos de vuelta al login reemplazando el historial
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, lo dejamos pasar al componente (children) que intentaba ver
    return children;
};

export default ProtectedRoute;