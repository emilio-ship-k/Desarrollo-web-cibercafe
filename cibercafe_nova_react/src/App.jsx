import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Salas from './pages/Salas'; 
import Panel from './pages/Panel'; // Importa el componente Panel

function App() {
  // Guarda el usuario cuando inicia sesión en el Login
  const [usuario, setUsuario] = useState(null);

  return (
    <BrowserRouter>
      {/* Barra superior presente en toda la web */}
      <Navbar usuario={usuario} setUsuario={setUsuario} />

      {/* Contenido de la página actual */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/panel" element={<Panel />} /> 
      </Routes>

      {/* Pie de página presente en toda la web */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;