import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Salas from './pages/Salas'; 
import Panel from './pages/Panel'; 
import Detalles from './pages/Detalles';
import Sesiones from './pages/Sesiones';
import Incidencias from './pages/Incidencias';


function App() {
 
  const [usuario, setUsuario] = useState(null);

 
  const [listaPcs, setListaPcs] = useState([
    { id: 'PC-01', estado: 'Disponible' },
    { id: 'PC-02', estado: 'En_uso' },
    { id: 'PC-03', estado: 'Reservado' },
    { id: 'PC-04', estado: 'Disponible' },
    { id: 'PC-05', estado: 'En_uso' },
    { id: 'PC-06', estado: 'Fuera_de_servicio' }
  ]);


  const cambiarEstadoPc = (idPc, nuevoEstado) => {
    const nuevaLista = listaPcs.map((pc) => {
      if (pc.id === idPc) {
        return { ...pc, estado: nuevoEstado };
      }
      return pc;
    });
    setListaPcs(nuevaLista);
  };

  return (
    <BrowserRouter>
     
      <Navbar usuario={usuario} setUsuario={setUsuario} />

      
      <Routes>
        <Route path="/" element={<Home />} />
        
        
        <Route 
          path="/salas" 
          element={<Salas listaPcs={listaPcs} cambiarEstadoPc={cambiarEstadoPc} />} 
        />
        
        <Route path="/panel" element={<Panel />} /> 
        <Route path="/detalles" element={<Detalles />} />
        <Route path="/sesiones" element={<Sesiones />} />
        <Route path="/incidencias" element={<Incidencias />} />
      </Routes>

      
      <Footer />
    </BrowserRouter>
  );
}

