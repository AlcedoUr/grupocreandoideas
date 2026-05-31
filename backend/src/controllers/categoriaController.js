const db = require('../config/db');

// (Read) Obtener todas las categorías y sus atributos
const obtenerCategorias = (req, res) => {
    db.query('SELECT * FROM categorias_config ORDER BY nombre ASC', (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al consultar categorías' });
        res.status(200).json(results);
    });
};

// (Create) Crear una nueva configuración de categoría
const crearCategoria = (req, res) => {
    const { nombre, atributos } = req.body;
    
    // Convertimos el objeto de atributos a texto JSON para guardarlo en MySQL
    const atributosJSON = JSON.stringify(atributos);

    db.query('INSERT INTO categorias_config (nombre, atributos) VALUES (?, ?)', [nombre, atributosJSON], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al crear la categoría' });
        res.status(201).json({ mensaje: 'Categoría configurada con éxito', id: results.insertId });
    });
};

// (Delete) Eliminar una categoría
const eliminarCategoria = (req, res) => {
    db.query('DELETE FROM categorias_config WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensaje: 'Error al eliminar' });
        res.status(200).json({ mensaje: 'Categoría eliminada' });
    });
};

module.exports = { obtenerCategorias, crearCategoria, eliminarCategoria };