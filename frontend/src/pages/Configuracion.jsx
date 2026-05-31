import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaTags, FaCogs } from 'react-icons/fa';

const Configuracion = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState('');
    
    // Estado dinámico: Un arreglo de opciones que el usuario puede hacer crecer
    // Empezamos con una fila vacía por defecto
    const [atributos, setAtributos] = useState([{ clave: '', valores: '' }]);

    const cargarCategorias = async () => {
        try {
            const respuesta = await axios.get('http://localhost:3000/api/categorias');
            setCategorias(respuesta.data);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    // --- FUNCIONES PARA MANEJAR LAS FILAS DINÁMICAS ---
    const agregarFilaAtributo = () => {
        setAtributos([...atributos, { clave: '', valores: '' }]);
    };

    const actualizarFila = (index, campo, valor) => {
        const nuevosAtributos = [...atributos];
        nuevosAtributos[index][campo] = valor;
        setAtributos(nuevosAtributos);
    };

    const eliminarFila = (index) => {
        const nuevosAtributos = atributos.filter((_, i) => i !== index);
        setAtributos(nuevosAtributos);
    };

    // --- GUARDAR EN LA BASE DE DATOS ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Transformamos las filas de la pantalla al formato JSON perfecto de Shopify
        const atributosJSON = {};
        atributos.forEach(attr => {
            if (attr.clave.trim() !== '' && attr.valores.trim() !== '') {
                // Convertimos "S, M, L" en un arreglo ["S", "M", "L"]
                const arregloValores = attr.valores.split(',').map(item => item.trim()).filter(Boolean);
                // Lo guardamos usando la clave en minúsculas (ej. "tallas")
                atributosJSON[attr.clave.toLowerCase()] = arregloValores;
            }
        });

        // 2. Validamos que haya puesto al menos el nombre
        if (!nombreCategoria.trim()) return alert("El nombre de la categoría es obligatorio");

        try {
            await axios.post('http://localhost:3000/api/categorias', {
                nombre: nombreCategoria,
                atributos: atributosJSON
            });
            
            // Limpiamos el formulario y recargamos
            setNombreCategoria('');
            setAtributos([{ clave: '', valores: '' }]);
            cargarCategorias();
        } catch (err) {
            alert('Hubo un error al guardar la categoría. Revisa que el nombre no esté repetido.');
        }
    };

    const eliminarCategoria = async (id) => {
        if (window.confirm('¿Eliminar esta configuración? Afectará a los productos futuros.')) {
            await axios.delete(`http://localhost:3000/api/categorias/${id}`);
            cargarCategorias();
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaCogs /> Configuración del Sistema
                </h2>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>Gestiona las categorías globales y sus variables (tallas, colores, etc.)</p>
            </div>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* --- PANEL IZQUIERDO: CREADOR --- */}
                <div style={{ flex: '1 1 400px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Nueva Categoría</h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Nombre (Ej. Polos, Tomatodos)</label>
                            <input 
                                type="text" required
                                value={nombreCategoria}
                                onChange={(e) => setNombreCategoria(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Atributos Dinámicos</label>
                                <button type="button" onClick={agregarFilaAtributo} style={{ backgroundColor: '#e6f7eb', color: '#00b33c', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                    + Añadir Fila
                                </button>
                            </div>

                            {/* DIBUJAMOS LAS FILAS DINÁMICAS */}
                            {atributos.map((attr, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input 
                                        type="text" placeholder="Ej. tallas"
                                        value={attr.clave}
                                        onChange={(e) => actualizarFila(index, 'clave', e.target.value)}
                                        style={{ flex: '1', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                                    />
                                    <input 
                                        type="text" placeholder="Ej. S, M, L"
                                        value={attr.valores}
                                        onChange={(e) => actualizarFila(index, 'valores', e.target.value)}
                                        style={{ flex: '2', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => eliminarFila(index)}
                                        style={{ backgroundColor: '#fff0f0', color: '#e74c3c', border: 'none', padding: '0 15px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <p style={{ fontSize: '12px', color: '#888', margin: '5px 0 0 0' }}>* Separa los valores con comas (,)</p>
                        </div>

                        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#00b33c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                            Guardar Configuración
                        </button>
                    </form>
                </div>

                {/* --- PANEL DERECHO: LISTA ACTUAL --- */}
                <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {categorias.map(cat => {
                        // Intentamos leer el JSON de MySQL de forma segura
                        let atributosParseados = {};
                        try {
                            // Dependiendo de cómo lo devuelva tu MySQL, puede venir ya como objeto o como texto
                            atributosParseados = typeof cat.atributos === 'string' ? JSON.parse(cat.atributos) : cat.atributos;
                        } catch(e) {}

                        return (
                            <div key={cat.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaTags style={{ color: '#00b33c', fontSize: '14px' }}/> {cat.nombre}
                                    </h4>
                                    
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                        {Object.entries(atributosParseados).map(([clave, valores]) => (
                                            <div key={clave} style={{ backgroundColor: '#f8f9fa', padding: '8px 12px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
                                                <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                                                    {clave}
                                                </span>
                                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                    {Array.isArray(valores) && valores.map(val => (
                                                        <span key={val} style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: '3px 8px', borderRadius: '4px', fontSize: '13px', color: '#333' }}>
                                                            {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => eliminarCategoria(cat.id)}
                                    style={{ backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '16px', padding: '5px' }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
};

export default Configuracion;