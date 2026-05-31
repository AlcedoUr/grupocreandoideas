const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Importamos tu conexión a MySQL

const login = (req, res) => {
    const { email, password } = req.body;

    // 1. Buscar al usuario en la base de datos por su email
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
        
        // 2. Si no hay resultados, el correo no existe
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = results[0];

        // 3. Comparar la contraseña enviada con la contraseña encriptada en la BD
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // 4. Si todo es correcto, crear un Token de seguridad (Pase de acceso)
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, 
            process.env.JWT_SECRET || 'secreto_super_seguro_123', 
            { expiresIn: '2h' } // El token dura 2 horas
        );

        // 5. Enviar respuesta de éxito al Frontend
        res.status(200).json({
            mensaje: 'Login exitoso',
            token: token,
            usuario: {
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });
    });
};

module.exports = { login };