const db = require('../config/db');

const obtenerProductos = (req, res) => {
    db.query('SELECT * FROM productos ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error BD' });
        res.status(200).json(results);
    });
};

const obtenerProductoPorId = (req, res) => {
    db.query('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error BD' });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.status(200).json(results[0]);
    });
};

const crearProducto = (req, res) => {
    // 👈 Agregamos opciones_disponibles
    const { nombre, categoria, descripcion, precio_base, tiempo_produccion_minutos, opciones_disponibles } = req.body;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `INSERT INTO productos (nombre, categoria, descripcion, precio_base, opciones_disponibles, tiempo_produccion_minutos, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [nombre, categoria, descripcion, precio_base, opciones_disponibles, tiempo_produccion_minutos, imagen_url], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensaje: 'Error guardando' });
        }
        res.status(201).json({ mensaje: 'Creado', id: results.insertId });
    });
};

const actualizarProducto = (req, res) => {
    const { id } = req.params;
    // 👈 Agregamos opciones_disponibles
    const { nombre, categoria, descripcion, precio_base, tiempo_produccion_minutos, opciones_disponibles } = req.body;
    
    if (req.file) {
        const imagen_url = `/uploads/${req.file.filename}`;
        const query = `UPDATE productos SET nombre=?, categoria=?, descripcion=?, precio_base=?, opciones_disponibles=?, tiempo_produccion_minutos=?, imagen_url=? WHERE id=?`;
        db.query(query, [nombre, categoria, descripcion, precio_base, opciones_disponibles, tiempo_produccion_minutos, imagen_url, id], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error actualizando' });
            res.status(200).json({ mensaje: 'Actualizado' });
        });
    } else {
        const query = `UPDATE productos SET nombre=?, categoria=?, descripcion=?, precio_base=?, opciones_disponibles=?, tiempo_produccion_minutos=? WHERE id=?`;
        db.query(query, [nombre, categoria, descripcion, precio_base, opciones_disponibles, tiempo_produccion_minutos, id], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error actualizando' });
            res.status(200).json({ mensaje: 'Actualizado' });
        });
    }
};

const eliminarProducto = (req, res) => {
    db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensaje: 'Error' });
        res.status(200).json({ mensaje: 'Eliminado' });
    });
};

module.exports = { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto };