import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaBox, FaShoppingCart, FaStar } from 'react-icons/fa';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
    const { id } = useParams(); // Saca el ID de la barra de direcciones
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    
    // Selectores visuales (se preparan para el JSON posterior)
    const [colorSeleccionado, setColorSeleccionado] = useState('Negro');
    const [tallaSeleccionada, setTallaSeleccionada] = useState('S');

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const respuesta = await axios.get(`http://localhost:3000/api/productos/${id}`);
                setProducto(respuesta.data);
            } catch (err) {
                console.error("Error cargando el producto", err);
            }
        };
        cargarProducto();
    }, [id]);

    if (!producto) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando...</div>;

    const total = (parseFloat(producto.precio_base) * cantidad).toFixed(2);

    return (
        <div className="detalle-page">
            <div className="detalle-container">
                <button className="btn-volver" onClick={() => navigate('/')}>
                    <FaArrowLeft /> Volver al Catálogo
                </button>

                <div className="detalle-layout">
                    {/* Imagen Izquierda */}
                    <div className="detalle-imagen-box">
                        {producto.imagen_url ? (
                            <img src={`http://localhost:3000${producto.imagen_url}`} alt={producto.nombre} className="img-full" />
                        ) : (
                            <div className="img-placeholder">Sin imagen</div>
                        )}
                        <div className="badge-destacado"><FaStar style={{marginRight: '5px'}}/> Producto Destacado</div>
                    </div>

                    {/* Información Derecha */}
                    <div className="detalle-info-box">
                        <div className="detalle-header">
                            <span className="detalle-categoria">{producto.categoria}</span>
                            <FaHeart className="icon-heart" />
                        </div>
                        <h1 className="detalle-titulo">{producto.nombre}</h1>
                        <p className="detalle-desc">{producto.descripcion}</p>
                        
                        <div className="detalle-precio-box">
                            <span className="precio-grande">S/.{producto.precio_base}</span>
                            <span className="precio-sub">por unidad</span>
                        </div>

                        <div className="alerta-stock">
                            <FaBox /> En Stock - Material disponible para personalización
                        </div>

                        {/* Opciones (Si es Polo, mostramos Tallas) */}
                        {producto.categoria === 'Polos' && (
                            <>
                                <div className="opcion-grupo">
                                    <p>🎨 Color: <strong>{colorSeleccionado}</strong></p>
                                    <div className="botones-opcion">
                                        {['Negro', 'Blanco', 'Verde', 'Azul'].map(c => (
                                            <button key={c} className={`btn-opt ${colorSeleccionado === c ? 'active' : ''}`} onClick={() => setColorSeleccionado(c)}>{c}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="opcion-grupo">
                                    <p>📏 Talla: <strong>{tallaSeleccionada}</strong></p>
                                    <div className="botones-opcion">
                                        {['S', 'M', 'L', 'XL', 'XXL'].map(t => (
                                            <button key={t} className={`btn-opt ${tallaSeleccionada === t ? 'active' : ''}`} onClick={() => setTallaSeleccionada(t)}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Cantidad y Total */}
                        <div className="cantidad-total-box">
                            <div>
                                <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Cantidad</p>
                                <div className="selector-cantidad">
                                    <button onClick={() => setCantidad(c => Math.max(1, c - 1))}>-</button>
                                    <span>{cantidad}</span>
                                    <button onClick={() => setCantidad(c => c + 1)}>+</button>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>Total</p>
                                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#00b33c' }}>S/.{total}</p>
                            </div>
                        </div>

                        <button className="btn-carrito">
                            <FaShoppingCart /> Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;