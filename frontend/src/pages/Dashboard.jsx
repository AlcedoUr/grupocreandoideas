import React from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaChartBar, FaCog, FaSearch, FaBell, FaBoxOpen } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Nos permite saber en qué URL estamos

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <span className="logo-black">CREANDO</span> <span className="logo-green">IDEAS</span>
                </div>
                
                <nav className="sidebar-menu">
                    {/* Botón de Inicio */}
                    <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                        <FaHome /> <span>Inicio</span>
                    </Link>
                    
                    {/* Botón de Productos */}
                    <Link to="/dashboard/productos" className={`menu-item ${location.pathname === '/dashboard/productos' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                        <FaBoxOpen /> <span>Productos</span>
                    </Link>

                    <div className="menu-item"><FaShoppingCart /> <span>Pedidos</span></div>
                    <div className="menu-item"><FaChartBar /> <span>Reportes</span></div>
                    <div className="menu-item"><FaCog /> <span>Configuración</span></div>
                </nav>

                <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
            </aside>

            <main className="main-content">
                <header className="navbar">
                    <div className="search-bar">
                        <FaSearch /> <input type="text" placeholder="Buscar..." />
                    </div>
                    <div className="user-profile">
                        <FaBell className="bell-icon" />
                        <div className="avatar-circle">A</div>
                        <div className="user-info">
                            <span className="user-name">Admin</span>
                            <span className="user-role">Administrador</span>
                        </div>
                    </div>
                </header>

                {/* 👇 LA MAGIA ESTÁ AQUÍ: El Outlet pinta "Inicio" o "Productos" */}
                <div style={{ padding: '0px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;