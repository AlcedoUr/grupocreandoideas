const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/config/db');

const app = express();

app.use(cors()); 
app.use(express.json()); 

// 👇 AQUÍ AGREGAMOS TUS RUTAS DE AUTENTICACIÓN 👇
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);
const productoRoutes = require('./src/routes/productoRoutes');
app.use('/api/productos', productoRoutes);

app.get('/', (req, res) => {
    res.send('¡El servidor de Grupo Creando Ideas está funcionando perfectamente! 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});