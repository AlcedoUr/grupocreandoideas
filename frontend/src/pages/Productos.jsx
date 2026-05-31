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
    const [categoriasConfig, setCategoriasConfig] = useState([]); //////////////
    const [productoActual, setProductoActual] = useState({
    nombre: '', categoria: 'Polos', descripcion: '', precio_base: '', tiempo_produccion_minutos: '', imagen: null
    });
    const [opcionesDinamicas, setOpcionesDinamicas] = useState({ tallas: '', colores: '', capacidad: '' });

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
    // Para enviar archivos, debemos usar FormData en lugar de un objeto JSON normal
    const formData = new FormData();
    formData.append('nombre', productoActual.nombre);
    formData.append('categoria', productoActual.categoria);
    formData.append('descripcion', productoActual.descripcion);
    formData.append('precio_base', productoActual.precio_base);
    formData.append('tiempo_produccion_minutos', productoActual.tiempo_produccion_minutos);
    
    // Solo añadimos la imagen si el usuario seleccionó una
    if (productoActual.imagen) {
        formData.append('imagen', productoActual.imagen);
    }
    let opcionesJSON = {};
    if (productoActual.categoria === 'Polos') {
        opcionesJSON = {
            tallas: opcionesDinamicas.tallas.split(',').map(item => item.trim()).filter(Boolean),
            colores: opcionesDinamicas.colores.split(',').map(item => item.trim()).filter(Boolean)
        };
    } else if (productoActual.categoria === 'Tazas') {
        opcionesJSON = {
            capacidad: opcionesDinamicas.capacidad.split(',').map(item => item.trim()).filter(Boolean),
            colores: opcionesDinamicas.colores.split(',').map(item => item.trim()).filter(Boolean)
        };
    }
    // Lo guardamos en el FormData como texto JSON
    formData.append('opciones_disponibles', JSON.stringify(opcionesJSON));

    try {
        if (modoEdicion) {
            await axios.put(`http://localhost:3000/api/productos/${idEdicion}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
            await axios.post('http://localhost:3000/api/productos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        cerrarModal();
        cargarProductos(); 
    } catch (err) {
        alert('Error al guardar el producto');
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
    useEffect(() => {
    const fetchCategorias = async () => {
        const res = await axios.get('http://localhost:3000/api/categorias');
        setCategoriasConfig(res.data);
    };
    fetchCategorias();
}, []);////////////////////////////
    // --- FUNCIONES DE VENTANA EMERGENTE ---
    const abrirModalCrear = () => {
    setModoEdicion(false);
    setIdEdicion(null);
    setProductoActual({ nombre: '', categoria: 'Polos', descripcion: '', precio_base: '', tiempo_produccion_minutos: '', imagen: null });
    setOpcionesDinamicas({ tallas: '', colores: '', capacidad: '' }); // 👈 Nuevo
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
                            {/* ESTE ES TU SELECTOR DE CATEGORÍA ACTUAL */}
                            <select 
                            value={productoActual.categoria} 
                            onChange={(e) => setProductoActual({...productoActual, categoria: e.target.value})}
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            >
                            {categoriasConfig.map(cat => (
                            <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                            ))}
                            </select>

                           {/* 👇 ESTO GENERA LOS INPUTS AUTOMÁTICOS SEGÚN LA CATEGORÍA 👇 */}
                            {categoriasConfig
                            .filter(cat => cat.nombre === productoActual.categoria)
                            .map(cat => {
                                const atributos = typeof cat.atributos === 'string' ? JSON.parse(cat.atributos) : cat.atributos;
                                return (
                                    <div key={cat.id} style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
                                        <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                                            Selecciona opciones para {cat.nombre}:
                                        </p>
                                        
                                        {Object.entries(atributos).map(([key, valores]) => (
                                            <div key={key} style={{ marginBottom: '15px' }}>
                                                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', fontWeight: 'bold' }}>{key}</label>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                                                    {valores.map(valor => {
                                                        // Verificamos si este valor ya está seleccionado
                                                        const isSelected = (opcionesDinamicas[key] || []).includes(valor);
                                                        
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={valor}
                                                                onClick={() => {
                                                                    const actuales = opcionesDinamicas[key] || [];
                                                                    const nuevas = isSelected 
                                                                        ? actuales.filter(v => v !== valor) // Quitar si ya estaba
                                                                        : [...actuales, valor];             // Agregar si no estaba
                                                                    setOpcionesDinamicas({...opcionesDinamicas, [key]: nuevas});
                                                                }}
                                                                style={{
                                                                    padding: '8px 15px',
                                                                    borderRadius: '20px',
                                                                    border: isSelected ? '2px solid #00b33c' : '1px solid #ccc',
                                                                    backgroundColor: isSelected ? '#e6f7eb' : 'white',
                                                                    color: isSelected ? '#00b33c' : '#333',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '12px'
                                                                }}
                                                            >
                                                                {valor}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })
                        }
                            {/* 👆 -------------------------------------------------- 👆 */}

                            {/* ESTA ES TU DESCRIPCIÓN ACTUAL */}
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
                            <input 
                                type="file" accept="image/*"
                                onChange={(e) => setProductoActual({...productoActual, imagen: e.target.files[0]})}
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            />
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