import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaThLarge, FaTshirt, FaMugHot, FaRedhat, FaStar } from 'react-icons/fa';
import './CatalogoPublico.css';

const CatalogoPublico = () => {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState('Todos');
    const navigate = useNavigate();

    useEffect(() => {
        const cargarProductos = async () => {
            const respuesta = await axios.get('http://localhost:3000/api/productos');
            setProductos(respuesta.data);
        };
        cargarProductos();
    }, []);

    const productosFiltrados = productos.filter(p => filtro === 'Todos' || p.categoria === filtro);

    return (
        <div className="catalogo-page">
            <header className="catalogo-header">
                <div>
                    <h1 className="catalogo-logo">Catálogo de Productos</h1>
                    <p className="catalogo-subtitle">Explora nuestro catálogo completo de productos personalizables</p>
                </div>
                <Link to="/login" className="admin-link">Acceso Admin</Link>
            </header>

            <div className="catalogo-container">
                {/* Buscador y Filtros */}
                <div className="search-bar-public">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Buscar productos..." />
                </div>

                <div className="filtros-container">
                    <button className={`filtro-btn ${filtro === 'Todos' ? 'active' : ''}`} onClick={() => setFiltro('Todos')}>
                        <FaThLarge /> Todos los Productos
                    </button>
                    <button className={`filtro-btn ${filtro === 'Polos' ? 'active' : ''}`} onClick={() => setFiltro('Polos')}>
                        <FaTshirt /> Polos
                    </button>
                    <button className={`filtro-btn ${filtro === 'Tazas' ? 'active' : ''}`} onClick={() => setFiltro('Tazas')}>
                        <FaMugHot /> Tazas
                    </button>
                    <button className={`filtro-btn ${filtro === 'Gorras' ? 'active' : ''}`} onClick={() => setFiltro('Gorras')}>
                        <FaRedhat /> Gorras
                    </button>
                </div>

                <p className="mostrando-text">Mostrando {productosFiltrados.length} productos</p>

                {/* Grid de Productos */}
                <div className="productos-grid">
                    {productosFiltrados.map((producto) => (
                        <div className="producto-card" key={producto.id} onClick={() => navigate(`/producto/${producto.id}`)}>
                            <div className="producto-imagen-container">
                                {producto.imagen_url ? (
                                    <img src={`http://localhost:3000${producto.imagen_url}`} alt={producto.nombre} className="producto-img" />
                                ) : (
                                    <div className="producto-placeholder">Sin Imagen</div>
                                )}
                                <span className="tag-categoria">{producto.categoria}</span>
                                <span className="tag-destacado">Destacado</span>
                            </div>
                            
                            <div className="producto-info">
                                <h3 className="producto-nombre">{producto.nombre}</h3>
                                <p className="producto-descripcion">{producto.descripcion.substring(0, 60)}...</p>
                                
                                <div className="producto-footer">
                                    <span className="producto-precio">S/.{producto.precio_base}</span>
                                    <span className="producto-stock">Personalizable</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CatalogoPublico;