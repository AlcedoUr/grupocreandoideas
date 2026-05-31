import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta específica para el inicio de sesión */}
        <Route path="/login" element={<Login />} />
        
        {/* Si alguien entra a la raíz "/", lo enviamos directo al login por seguridad */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;