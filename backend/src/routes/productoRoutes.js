const express = require('express');
const router = express.Router();
// Importamos las 4 funciones
const { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productoController');

// Rutas base
router.get('/', obtenerProductos);
router.post('/', crearProducto);

// Rutas que necesitan un ID específico al final (ej. /api/productos/5)
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;