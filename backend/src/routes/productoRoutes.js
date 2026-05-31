const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 👈 Importamos la herramienta de archivos del sistema
const { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productoController');

// --- CÓDIGO A PRUEBA DE BALAS PARA LA CARPETA UPLOADS ---
// Calculamos la ruta exacta: subimos dos niveles desde src/routes hasta llegar a la raíz del backend
const uploadFolder = path.join(__dirname, '../../uploads');

// Si la carpeta "uploads" no existe, le ordenamos a Node.js que la cree automáticamente
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
    console.log('✅ Carpeta uploads creada automáticamente');
}
// ---------------------------------------------------------

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder); // Usamos nuestra ruta calculada y segura
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Rutas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/', upload.single('imagen'), crearProducto);
router.put('/:id', upload.single('imagen'), actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;