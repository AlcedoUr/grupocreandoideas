import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas del Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          {/* Index: Carga por defecto las gráficas al entrar a /dashboard */}
          <Route index element={<Inicio />} />
          
          {/* Sub-ruta: Carga la tabla al entrar a /dashboard/productos */}
          <Route path="productos" element={<Productos />} />
        </Route>
        
        {/* Redirecciones de seguridad */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/productos" element={<Navigate to="/dashboard/productos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;