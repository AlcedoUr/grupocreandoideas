const db = require('../config/db');

// 1. (Read) Obtener todos los productos
const obtenerProductos = (req, res) => {
    const query = 'SELECT * FROM productos ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al consultar la BD' });
        res.status(200).json(results);
    });
};

// 2. (Create) Crear un nuevo producto
const crearProducto = (req, res) => {
    // Extraemos los datos que nos enviará el Frontend
    const { nombre, categoria, descripcion, precio_base, tiempo_produccion_minutos } = req.body;

    // Instrucción SQL para insertar
    const query = `
        INSERT INTO productos (nombre, categoria, descripcion, precio_base, tiempo_produccion_minutos) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre, categoria, descripcion, precio_base, tiempo_produccion_minutos], (err, results) => {
        if (err) {
            console.error('Error creando producto:', err);
            return res.status(500).json({ mensaje: 'Error al guardar el producto' });
        }
        // Respondemos con el ID del nuevo producto creado
        res.status(201).json({ 
            mensaje: 'Producto creado con éxito', 
            id: results.insertId 
        });
    });
};
// 3. (Update) Editar un producto existente
const actualizarProducto = (req, res) => {
    const { id } = req.params; // Sacamos el ID de la URL
    const { nombre, categoria, descripcion, precio_base, tiempo_produccion_minutos } = req.body;

    const query = `
        UPDATE productos 
        SET nombre = ?, categoria = ?, descripcion = ?, precio_base = ?, tiempo_produccion_minutos = ? 
        WHERE id = ?
    `;

    db.query(query, [nombre, categoria, descripcion, precio_base, tiempo_produccion_minutos, id], (err, results) => {
        if (err) {
            console.error('Error actualizando producto:', err);
            return res.status(500).json({ mensaje: 'Error al actualizar el producto' });
        }
        res.status(200).json({ mensaje: 'Producto actualizado con éxito' });
    });
};

// 4. (Delete) Eliminar un producto
const eliminarProducto = (req, res) => {
    const { id } = req.params; // Sacamos el ID de la URL

    const query = 'DELETE FROM productos WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error eliminando producto:', err);
            return res.status(500).json({ mensaje: 'Error al eliminar el producto' });
        }
        res.status(200).json({ mensaje: 'Producto eliminado con éxito' });
    });
};

// Asegúrate de exportar TODAS las funciones ahora:
module.exports = { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto };
