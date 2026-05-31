const bcrypt = require('bcrypt');
const db = require('./src/config/db'); // Llamamos a tu conexión

// Vamos a encriptar la palabra "123456" de verdad
bcrypt.hash('123456', 10, (err, hashReal) => {
    if (err) throw err;
    
    console.log('Generando hash real para 123456:', hashReal);

    // Actualizamos el usuario en tu base de datos con el hash correcto
    const query = "UPDATE usuarios SET password = ? WHERE email = 'admin@creandoideas.com'";
    
    db.query(query, [hashReal], (error, resultados) => {
        if (error) {
            console.log('❌ Error actualizando:', error);
        } else {
            console.log('✅ ¡Contraseña actualizada con éxito en MySQL!');
        }
        process.exit(); // Apagamos el script
    });
});