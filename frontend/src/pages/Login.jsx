import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'; // Íconos importados
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        try {
            const respuesta = await axios.post('http://localhost:3000/api/auth/login', {
                email: email,
                password: password
            });

            localStorage.setItem('token', respuesta.data.token);
            setMensaje('¡Login exitoso! Redirigiendo...');

            setTimeout(() => {
                navigate('/dashboard'); 
            }, 1000);

        } catch (err) {
            if (err.response) {
                setError(err.response.data.mensaje);
            } else {
                setError('Error conectando con el servidor');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Título idéntico a tu diseño */}
                <h1 className="login-title">GRUPO CREANDO</h1>
                <span className="login-title-green">IDEAS</span>
                <p className="login-subtitle">TU ESTILO, NUESTRAS IDEAS</p>
                
                <form onSubmit={handleLogin} className="login-form">
                    <input 
                        type="email" 
                        placeholder="Correo" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input"
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                    <button type="submit" className="login-btn">
                        Ingresar
                    </button>
                </form>

                {error && <p className="error-msg">{error}</p>}
                {mensaje && <p className="success-msg">{mensaje}</p>}

                {/* Línea divisoria e íconos de redes sociales */}
                <div className="social-divider">
                    <FaFacebookF className="social-icon" />
                    <FaInstagram className="social-icon" />
                    <FaTwitter className="social-icon" />
                    <FaLinkedinIn className="social-icon" />
                </div>
            </div>
        </div>
    );
};

export default Login;