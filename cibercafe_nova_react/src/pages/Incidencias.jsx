import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TablaIncidencias from '../components/TablaIncidencias';
import '../css/Sesiones.css';

function Incidencias({ listaPcs, cambiarEstadoPc }) {
  const [incidencias, setIncidencias] = useState([]);

  // Usamos un formato "sala|id" para identificar de forma única al equipo en el select
  const pcInicial = listaPcs.length > 0 ? `${listaPcs[0].sala}|${listaPcs[0].id}` : '';
  const [puestoVal, setPuestoVal] = useState(pcInicial);
  const [tipo, setTipo] = useState('Hardware');
  const [prioridad, setPrioridad] = useState('Media');
  const [descripcion, setDescripcion] = useState('');
  const [errorValidacion, setErrorValidacion] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const registrarIncidencia = (e) => {
    e.preventDefault();

    if (!descripcion.trim() || descripcion.trim().length < 8) {
      setErrorValidacion('La descripción del problema debe tener al menos 8 caracteres.');
      return;
    }

    const [sala, id] = puestoVal.split('|');
    const pcSeleccionado = listaPcs.find((pc) => pc.id === id && pc.sala === sala);

    if (!pcSeleccionado) {
      setErrorValidacion('Error: No se encontró el PC seleccionado.');
      return;
    }

    const nueva = {
      id: Date.now(),
      puesto: pcSeleccionado.nombre,
      pcId: pcSeleccionado.id,
      pcSala: pcSeleccionado.sala,
      tipo,
      prioridad,
      descripcion: descripcion.trim(),
      estado: 'Abierta'
    };

    setIncidencias([nueva, ...incidencias]);
    setDescripcion('');
    setErrorValidacion('');
    
    // Cambia el estado del PC a Fuera de servicio en toda la plataforma
    cambiarEstadoPc({ id: pcSeleccionado.id, sala: pcSeleccionado.sala }, 'Fuera_de_servicio', descripcion.trim());
    
    setMensajeExito(`Incidencia reportada en ${nueva.puesto}. El equipo se marcó como Fuera de servicio.`);
  };

  const marcarResuelta = (idIncidencia) => {
    const incidencia = incidencias.find((inc) => inc.id === idIncidencia);
    
    setIncidencias(
      incidencias.map((inc) =>
        inc.id === idIncidencia ? { ...inc, estado: 'Resuelta' } : inc
      )
    );

    if (incidencia) {
      // Regresa el equipo a estado Disponible
      cambiarEstadoPc(
        { id: incidencia.pcId, sala: incidencia.pcSala }, 
        'Disponible', 
        'Equipo libre y operativo'
      );
      setMensajeExito(`Incidencia de ${incidencia.puesto} resuelta. El equipo vuelve a estar Disponible.`);
    }
  };

  return (
    <main className="sesiones-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Registro de Incidencias y Fallas</h2>
          <p className="text-secondary mb-0">Control de mantenimiento técnico y problemas de equipos</p>
        </div>
        <Link to="/panel" className="btn btn-outline-secondary btn-sm">
          &lt; Volver al Panel
        </Link>
      </div>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show mb-4">
          {mensajeExito}
          <button type="button" className="btn-close" onClick={() => setMensajeExito('')}></button>
        </div>
      )}

      <div className="tarjeta-sesion">
        <div className="tarjeta-sesion-header">
          Reportar Nueva Falla
        </div>
        <div className="p-3">
          {errorValidacion && (
            <div className="alert alert-danger py-2 px-3 small fw-semibold mb-3">
              {errorValidacion}
            </div>
          )}
          <form onSubmit={registrarIncidencia}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold mb-1">Puesto afectado:</label>
                <select
                  className="form-select form-select-sm"
                  value={puestoVal}
                  onChange={(e) => setPuestoVal(e.target.value)}
                >
                  {listaPcs.map((pc) => (
                    <option key={`${pc.sala}|${pc.id}`} value={`${pc.sala}|${pc.id}`}>
                      {pc.nombre} - {pc.estado}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold mb-1">Tipo de problema:</label>
                <select
                  className="form-select form-select-sm"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="Hardware">Hardware / Monitor</option>
                  <option value="Periféricos">Periféricos / Audio</option>
                  <option value="Software">Software / Sistema</option>
                  <option value="Red">Conectividad / Red</option>
                </select>
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small fw-bold mb-1">Prioridad:</label>
                <select
                  className="form-select form-select-sm"
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value)}
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label small fw-bold mb-1">Detalle del fallo:</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ej: Tecla W no responde..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="col-12 d-flex justify-content-end">
                <button type="submit" className="btn btn-danger btn-sm fw-bold px-4">
                  Reportar Incidencia
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <TablaIncidencias incidencias={incidencias} onResolver={marcarResuelta} />
    </main>
  );
}

export default Incidencias;