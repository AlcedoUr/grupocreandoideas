const mysql = require('mysql2');
require('dotenv').config();

// Crear la conexión usando los datos de tu archivo .env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Comprobar si la conexión fue exitosa
connection.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL (db_creando_ideas)');
});

module.exports = connection;