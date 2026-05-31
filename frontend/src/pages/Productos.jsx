import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Importamos los nuevos iconos

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState('');
    
    // --- ESTADOS PARA EL FORMULARIO ---
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false); // ¿Estamos creando o editando?
    const [idEdicion, setIdEdicion] = useState(null); // Guardamos el ID si estamos editando
    
    const [productoActual, setProductoActual] = useState({
        nombre: '',
        categoria: 'Polos',
        descripcion: '',
        precio_base: '',
        tiempo_produccion_minutos: ''
    });

    // --- (READ) CARGAR PRODUCTOS ---
    const cargarProductos = async () => {
        try {
            const respuesta = await axios.get('http://localhost:3000/api/productos');
            setProductos(respuesta.data);
        } catch (err) {
            setError('Hubo un problema al cargar el catálogo.');
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    // --- (CREATE / UPDATE) GUARDAR PRODUCTO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modoEdicion) {
                // Si estamos en modo edición, enviamos un PUT a la ruta con el ID
                await axios.put(`http://localhost:3000/api/productos/${idEdicion}`, productoActual);
            } else {
                // Si es nuevo, enviamos un POST
                await axios.post('http://localhost:3000/api/productos', productoActual);
            }
            
            cerrarModal();
            cargarProductos(); 
        } catch (err) {
            alert('Error al guardar el producto');
            console.error(err);
        }
    };

    // --- (DELETE) ELIMINAR PRODUCTO ---
    const eliminarProducto = async (id) => {
        // Alerta de confirmación para evitar accidentes
        if (window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
            try {
                await axios.delete(`http://localhost:3000/api/productos/${id}`);
                cargarProductos(); // Recargamos la tabla
            } catch (err) {
                alert('Error al eliminar el producto');
                console.error(err);
            }
        }
    };

    // --- FUNCIONES DE VENTANA EMERGENTE ---
    const abrirModalCrear = () => {
        setModoEdicion(false);
        setIdEdicion(null);
        setProductoActual({ nombre: '', categoria: 'Polos', descripcion: '', precio_base: '', tiempo_produccion_minutos: '' });
        setMostrarModal(true);
    };

    const abrirModalEditar = (producto) => {
        setModoEdicion(true);
        setIdEdicion(producto.id);
        setProductoActual(producto); // Llenamos el formulario con los datos a editar
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#333' }}>Catálogo de Productos</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>Lista de artículos disponibles para personalización.</p>
                </div>
                <button 
                    onClick={abrirModalCrear}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#00b33c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    <FaPlus /> Nuevo Producto
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', color: '#333', textAlign: 'left', borderBottom: '2px solid #eaeaea' }}>
                        <th style={{ padding: '15px' }}>ID</th>
                        <th style={{ padding: '15px' }}>Nombre</th>
                        <th style={{ padding: '15px' }}>Categoría</th>
                        <th style={{ padding: '15px' }}>Precio Base</th>
                        <th style={{ padding: '15px' }}>Tiempo</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                            <td style={{ padding: '15px', color: '#666' }}>#{producto.id}</td>
                            <td style={{ padding: '15px', fontWeight: 'bold', color: '#000' }}>{producto.nombre}</td>
                            <td style={{ padding: '15px' }}>
                                <span style={{ padding: '5px 10px', backgroundColor: '#e6f7eb', color: '#00b33c', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {producto.categoria}
                                </span>
                            </td>
                            <td style={{ padding: '15px' }}>S/ {producto.precio_base}</td>
                            <td style={{ padding: '15px' }}>{producto.tiempo_produccion_minutos} min</td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                {/* BOTÓN EDITAR */}
                                <button 
                                    onClick={() => abrirModalEditar(producto)}
                                    style={{ backgroundColor: 'transparent', border: 'none', color: '#3498db', cursor: 'pointer', fontSize: '16px', marginRight: '15px' }}
                                    title="Editar"
                                >
                                    <FaEdit />
                                </button>
                                {/* BOTÓN ELIMINAR */}
                                <button 
                                    onClick={() => eliminarProducto(producto.id)}
                                    style={{ backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '16px' }}
                                    title="Eliminar"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- MODAL DE CREAR / EDITAR --- */}
            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
                            {modoEdicion ? 'Editar Producto' : 'Registrar Nuevo Producto'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input 
                                type="text" placeholder="Nombre del producto" required
                                value={productoActual.nombre} 
                                onChange={(e) => setProductoActual({...productoActual, nombre: e.target.value})}
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            />
                            
                            <select 
                                value={productoActual.categoria} 
                                onChange={(e) => setProductoActual({...productoActual, categoria: e.target.value})}
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            >
                                <option value="Polos">Polos</option>
                                <option value="Tazas">Tazas</option>
                                <option value="Gorras">Gorras</option>
                                <option value="Tomatodos">Tomatodos</option>
                                <option value="Otros">Otros</option>
                            </select>

                            <textarea 
                                placeholder="Descripción corta" required rows="3"
                                value={productoActual.descripcion} 
                                onChange={(e) => setProductoActual({...productoActual, descripcion: e.target.value})}
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box', resize: 'none' }}
                            />

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="number" step="0.01" placeholder="Precio Base (S/)" required
                                    value={productoActual.precio_base} 
                                    onChange={(e) => setProductoActual({...productoActual, precio_base: e.target.value})}
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '50%', boxSizing: 'border-box' }}
                                />
                                <input 
                                    type="number" placeholder="Tiempo (Minutos)" required
                                    value={productoActual.tiempo_produccion_minutos} 
                                    onChange={(e) => setProductoActual({...productoActual, tiempo_produccion_minutos: e.target.value})}
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '50%', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" onClick={cerrarModal} style={{ padding: '10px 15px', backgroundColor: '#f5f5f5', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#00b33c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {modoEdicion ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default Productos;