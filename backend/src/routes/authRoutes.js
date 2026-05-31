const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Crear la ruta POST para el login -> http://localhost:3000/api/auth/login
router.post('/login', login);

module.exports = router;