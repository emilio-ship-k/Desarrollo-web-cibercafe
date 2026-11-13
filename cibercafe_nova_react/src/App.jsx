import { useState, useEffect } from 'react';
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
  const [listaPcs, setListaPcs] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsuario({
          id: payload.sub,
          rol: payload.rol,
          user: 'Usuario' 
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    const fetchComputadores = async () => {
      try {
        const respuesta = await fetch('http://localhost:4000/api/computadores');
        if (!respuesta.ok) throw new Error('Error al obtener datos del servidor');
        
        const datos = await respuesta.json();

        const pcsFormateados = datos.map(pc => ({
          _id: pc._id,                
          id: pc.codigo,              
          sala: pc.sala ? pc.sala.nombre : 'Sala general', 
          nombre: pc.nombre,
          estado: pc.estado,
          motivo: pc.motivo,
          hardware: pc.hardware || 'Sin información detallada',
          sesionActual: 'Sin sesión activa',
          reservaProxima: 'Sin reservas programadas',
          tarifa: pc.tipoPuesto === 'general' ? '$2.500 / hora' : '$3.500 / hora'
        }));

        setListaPcs(pcsFormateados);
      } catch (error) {
        console.error('Error de conexión a la API:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchComputadores();
  }, []);

  const cambiarEstadoPc = async (pcObjetivo, nuevoEstado, nuevoMotivo) => {
    const equipo = listaPcs.find(pc => pc.id === pcObjetivo.id && pc.sala === pcObjetivo.sala);

    if (equipo && equipo._id) {
      try {
        await fetch(`http://localhost:4000/api/computadores/${equipo._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado, motivo: nuevoMotivo || equipo.motivo })
        });
      } catch (error) {
        console.error("Error al actualizar en la base de datos:", error);
      }
    }

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

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h2>Conectando con MongoDB Atlas...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar usuario={usuario} setUsuario={setUsuario} />

      <Routes>
        {/* Ruta publicas*/}
        <Route path="/" element={<Home />} />
        
        <Route path="/salas" element={
          <Salas listaPcs={listaPcs} cambiarEstadoPc={cambiarEstadoPc} setPcActual={setPcActual} />
        } />

        {/*CLIENTE Y OPERADO*/}
        <Route path="/reservas" element={
          <ProtecionRutas usuario={usuario} rolesPermitidos={['cliente', 'operador']}>
            <Reservas listaPcs={listaPcs} cambiarEstadoPc={cambiarEstadoPc} />
          </ProtecionRutas>
        } />

        {/* operador Y administrador */}
        <Route path="/panel" element={
          <ProtecionRutas usuario={usuario} rolesPermitidos={['operador', 'administrador']}>
             <Panel setPcActual={setPcActual} />
          </ProtecionRutas>
        } />
        
        <Route path="/detalles" element={
          <ProtecionRutas usuario={usuario} rolesPermitidos={['operador', 'administrador']}>
            <Detalles equipo={equipoSeleccionado} cambiarEstadoPc={cambiarEstadoPc} />
          </ProtecionRutas>
        } />

        {/*ruta de OPERADOR */}
        <Route path="/sesiones" element={
          <ProtecionRutas usuario={usuario} rolesPermitidos={['operador']}>
            <Sesiones />
          </ProtecionRutas>
        } />

        <Route path="/incidencias" element={
          <ProtecionRutas usuario={usuario} rolesPermitidos={['operador']}>
            <Incidencias listaPcs={listaPcs} cambiarEstadoPc={cambiarEstadoPc} />
          </ProtecionRutas>
        } />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;