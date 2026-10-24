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
  const [pcActual, setPcActual] = useState({ id: 'PC-02', sala: 'Sala gaming' });

 
  const [listaPcs, setListaPcs] = useState([
    { id: 'PC-01', sala: 'Sala general', nombre: 'Pc 01 (General)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660, Monitor 75hz', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },
    { id: 'PC-02', sala: 'Sala general', nombre: 'Pc 02 (General)', estado: 'En_uso', motivo: 'Sesión activa de Sebastián Quezada', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660, Monitor 75hz', sesionActual: 'Iniciada a las 16:15 hrs por Sebastián Quezada', reservaProxima: '18:00 hrs - 20:00 hrs', tarifa: '$2.500 / hora' },
    { id: 'PC-03', sala: 'Sala general', nombre: 'Pc 03 (General)', estado: 'Fuera_de_servicio', motivo: 'Falla en cable de poder', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660, Monitor 75hz', sesionActual: 'Bloqueado por mantenimiento', reservaProxima: 'No disponible', tarifa: '$2.500 / hora' },
    { id: 'PC-04', sala: 'Sala general', nombre: 'Pc 04 (General)', estado: 'Reservado', motivo: 'Reserva asignada para turno tarde', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660, Monitor 75hz', sesionActual: 'En espera del cliente', reservaProxima: '18:30 hrs - 20:00 hrs', tarifa: '$2.500 / hora' },

    { id: 'PC-01', sala: 'Sala gaming', nombre: 'Pc 01 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070, Monitor 165hz', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
    { id: 'PC-02', sala: 'Sala gaming', nombre: 'Pc 02 (Gaming)', estado: 'En_uso', motivo: 'Sesión activa asignada a Diego Ibarra', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070, Monitor 165hz', sesionActual: 'Iniciada a las 15:30 hrs por Diego Ibarra', reservaProxima: '19:00 hrs - 21:00 hrs', tarifa: '$3.500 / hora' },
    { id: 'PC-03', sala: 'Sala gaming', nombre: 'Pc 03 (Gaming)', estado: 'Fuera_de_servicio', motivo: 'Falla en tarjeta gráfica RTX 4070', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070, Monitor 165hz', sesionActual: 'Bloqueado por falla gráfica', reservaProxima: 'No disponible', tarifa: '$3.500 / hora' },
    { id: 'PC-04', sala: 'Sala gaming', nombre: 'Pc 04 (Gaming)', estado: 'Reservado', motivo: 'Reserva confirmada de Camila Rojas', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070, Monitor 165hz', sesionActual: 'En espera del cliente', reservaProxima: '19:00 hrs - 21:00 hrs', tarifa: '$3.500 / hora' },

    { id: 'PC-01', sala: 'Sala grupos', nombre: 'Pc 01 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070, Monitor 144hz', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
    { id: 'PC-02', sala: 'Sala grupos', nombre: 'Pc 02 (Grupos)', estado: 'En_uso', motivo: 'Sesión grupal de Jonathan Nuñez', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070, Monitor 144hz', sesionActual: 'Iniciada a las 15:30 hrs por Jonathan Nuñez', reservaProxima: 'Sin reservas próximas', tarifa: '$3.500 / hora' },
    { id: 'PC-03', sala: 'Sala grupos', nombre: 'Pc 03 (Grupos)', estado: 'Fuera_de_servicio', motivo: 'Falla en conector de red RJ45', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070, Monitor 144hz', sesionActual: 'Equipo sin conexión de red', reservaProxima: 'No disponible', tarifa: '$3.500 / hora' },
    { id: 'PC-04', sala: 'Sala grupos', nombre: 'Pc 04 (Grupos)', estado: 'Reservado', motivo: 'Torneo programado turno noche', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070, Monitor 144hz', sesionActual: 'Reservado para partidas en equipo', reservaProxima: '20:00 hrs - 22:00 hrs', tarifa: '$3.500 / hora' },
  ]);

  
  const cambiarEstadoPc = (pcObjetivo, nuevoEstado, nuevoMotivo) => {
    setListaPcs((prev) =>
      prev.map((pc) =>
        pc.id === pcObjetivo.id && pc.sala === pcObjetivo.sala
          ? { ...pc, estado: nuevoEstado, motivo: nuevoMotivo || pc.motivo }
          : pc
      )
    );
  };

  const equipoSeleccionado = listaPcs.find(
    (pc) => pc.id === pcActual.id && pc.sala === pcActual.sala
  ) || listaPcs[0];

  return (
    <BrowserRouter>
      <Navbar usuario={usuario} setUsuario={setUsuario} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/salas"
          element={
            <Salas
              listaPcs={listaPcs}
              cambiarEstadoPc={cambiarEstadoPc}
              setPcActual={setPcActual}
            />
          }
        />
        <Route path="/panel" element={<Panel setPcActual={setPcActual} />} />
        <Route
          path="/detalles"
          element={
            <Detalles
              equipo={equipoSeleccionado}
              cambiarEstadoPc={cambiarEstadoPc}
            />
          }
        />
        <Route path="/sesiones" element={<Sesiones />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/incidencias" element={<Incidencias listaPcs={listaPcs} cambiarEstadoPc={cambiarEstadoPc} />} />
        </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;