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
import Reservas from './pages/Reservas';

function App() {

  const [usuario, setUsuario] = useState(null);

  const [listaPcs, setListaPcs] = useState([
    { id: 'PC-01', sala: 'Sala general', estado: 'Disponible' },
    { id: 'PC-02', sala: 'Sala general', estado: 'En_uso' },
    { id: 'PC-03', sala: 'Sala general', estado: 'Fuera_de_servicio' },
    { id: 'PC-04', sala: 'Sala general', estado: 'Reservado' },

    { id: 'PC-01', sala: 'Sala gaming', estado: 'Disponible' },
    { id: 'PC-02', sala: 'Sala gaming', estado: 'En_uso' },
    { id: 'PC-03', sala: 'Sala gaming', estado: 'Fuera_de_servicio' },
    { id: 'PC-04', sala: 'Sala gaming', estado: 'Reservado' },

    { id: 'PC-01', sala: 'Sala grupos', estado: 'Disponible' },
    { id: 'PC-02', sala: 'Sala grupos', estado: 'En_uso' },
    { id: 'PC-03', sala: 'Sala grupos', estado: 'Fuera_de_servicio' },
    { id: 'PC-04', sala: 'Sala grupos', estado: 'Reservado' },
  ]);

  // Los ids se repiten entre salas, así que se identifica por sala + id
  const cambiarEstadoPc = (pcObjetivo, nuevoEstado) => {
    setListaPcs((prev) =>
      prev.map((pc) =>
        pc.id === pcObjetivo.id && pc.sala === pcObjetivo.sala
          ? { ...pc, estado: nuevoEstado }
          : pc
      )
    );
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
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/incidencias" element={<Incidencias />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;