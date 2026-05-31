import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token'); // Destruimos el pase de seguridad
        navigate('/login'); // Lo enviamos de vuelta a la puerta
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#000000' }}>Panel de Control Principal</h1>
            <p style={{ color: '#00b33c', fontWeight: 'bold' }}>¡Bienvenido al sistema protegido de Creando Ideas!</p>
            
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <h3>Módulo de Gestión</h3>
                <p>Aquí construiremos las tablas para gestionar inventario, ventas y usuarios.</p>
            </div>

            <button 
                onClick={handleLogout}
                style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Dashboard;