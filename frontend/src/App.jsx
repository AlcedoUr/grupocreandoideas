import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Configuracion from './pages/Configuracion';
import CatalogoPublico from './pages/CatalogoPublico'; // Importamos la vitrina
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* === RUTAS PÚBLICAS === */}
        {/* Ahora la página principal (/) es tu tienda */}
        <Route path="/" element={<CatalogoPublico />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/login" element={<Login />} />
        
        {/* === RUTAS PROTEGIDAS (ADMINISTRADOR) === */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<Inicio />} />
          <Route path="productos" element={<Productos />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
        
        {/* Rutas no encontradas redirigen al catálogo */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;