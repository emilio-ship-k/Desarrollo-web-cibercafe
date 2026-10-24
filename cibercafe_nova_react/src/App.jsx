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
  const [pcActual, setPcActual] = useState({ id: 'PC-01', sala: 'Sala general' });

const [listaPcs, setListaPcs] = useState([
  // SALA GENERAL (PC-01 al PC-10)
  { id: 'PC-01', sala: 'Sala general', nombre: 'Pc 01 (General)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },
  { id: 'PC-02', sala: 'Sala general', nombre: 'Pc 02 (General)', estado: 'En_uso', motivo: 'Sesión activa de Sebastián Quezada', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Iniciada a las 16:15', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },
  { id: 'PC-03', sala: 'Sala general', nombre: 'Pc 03 (General)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },
  { id: 'PC-04', sala: 'Sala general', nombre: 'Pc 04 (General)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },
  { id: 'PC-05', sala: 'Sala general', nombre: 'Pc 05 (General)', estado: 'Fuera_de_servicio', motivo: 'Falla en tarjeta gráfica. Equipo bloqueado temporalmente.', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Bloqueado por mantenimiento', reservaProxima: 'No disponible', tarifa: '$2.500 / hora' },
  { id: 'PC-06', sala: 'Sala general', nombre: 'Pc 06 (General)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },
  { id: 'PC-07', sala: 'Sala general', nombre: 'Pc 07 (General)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },
  { id: 'PC-08', sala: 'Sala general', nombre: 'Pc 08 (General)', estado: 'Reservado', motivo: 'Reserva de Sebastián Quezada (Individual)', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'En espera del cliente', reservaProxima: '18:00 - 20:00', tarifa: '$2.500 / hora' },
  { id: 'PC-09', sala: 'Sala general', nombre: 'Pc 09 (General)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },
  { id: 'PC-10', sala: 'Sala general', nombre: 'Pc 10 (General)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$2.500 / hora' },

  // SALA GAMING (PC-11 al PC-20)
  { id: 'PC-11', sala: 'Sala gaming', nombre: 'Pc 11 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-12', sala: 'Sala gaming', nombre: 'Pc 12 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-13', sala: 'Sala gaming', nombre: 'Pc 13 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-14', sala: 'Sala gaming', nombre: 'Pc 14 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-15', sala: 'Sala gaming', nombre: 'Pc 15 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-16', sala: 'Sala gaming', nombre: 'Pc 16 (Gaming)', estado: 'En_uso', motivo: 'Sesión activa de Diego Ibarra', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Iniciada a las 15:30', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-17', sala: 'Sala gaming', nombre: 'Pc 17 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-18', sala: 'Sala gaming', nombre: 'Pc 18 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-19', sala: 'Sala gaming', nombre: 'Pc 19 (Gaming)', estado: 'Reservado', motivo: 'Reserva de Jonathan Nuñez (Grupo)', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'En espera del cliente', reservaProxima: '19:00 - 21:00', tarifa: '$3.500 / hora' },
  { id: 'PC-20', sala: 'Sala gaming', nombre: 'Pc 20 (Gaming)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },

  // SALA GRUPOS (PC-21 al PC-30)
  { id: 'PC-21', sala: 'Sala grupos', nombre: 'Pc 21 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-22', sala: 'Sala grupos', nombre: 'Pc 22 (Grupos)', estado: 'Fuera_de_servicio', motivo: 'Teclado mecánico con tecla espaciadora bloqueada. Requiere cambio de repuesto.', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Bloqueado por falla técnica', reservaProxima: 'No disponible', tarifa: '$3.500 / hora' },
  { id: 'PC-23', sala: 'Sala grupos', nombre: 'Pc 23 (Grupos)', estado: 'En_uso', motivo: 'Sesión activa de Jonathan Nuñez', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Iniciada a las 15:30', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-24', sala: 'Sala grupos', nombre: 'Pc 24 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-25', sala: 'Sala grupos', nombre: 'Pc 25 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-26', sala: 'Sala grupos', nombre: 'Pc 26 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-27', sala: 'Sala grupos', nombre: 'Pc 27 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-28', sala: 'Sala grupos', nombre: 'Pc 28 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-29', sala: 'Sala grupos', nombre: 'Pc 29 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' },
  { id: 'PC-30', sala: 'Sala grupos', nombre: 'Pc 30 (Grupos)', estado: 'Disponible', motivo: 'Equipo libre y operativo', hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', sesionActual: 'Sin sesión activa', reservaProxima: 'Sin reservas programadas', tarifa: '$3.500 / hora' }
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
        <Route 
          path="/reservas" 
          element={<Reservas listaPcs={listaPcs} cambiarEstadoPc={cambiarEstadoPc} />} 
        />
        <Route 
          path="/incidencias" 
          element={<Incidencias listaPcs={listaPcs} cambiarEstadoPc={cambiarEstadoPc} />} 
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;