import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TablaIncidencias from '../components/TablaIncidencias';
import '../css/Sesiones.css';

function Incidencias() {
  const [incidencias, setIncidencias] = useState([
    {
      id: 1,
      puesto: 'Pc 16 (Gamer)',
      tipo: 'Periféricos',
      descripcion: 'Teclado mecánico pierde conexión intermitente en puerto USB frontal.',
      prioridad: 'Media',
      estado: 'Abierta'
    },
    {
      id: 2,
      puesto: 'Pc 02 (general)',
      tipo: 'Software',
      descripcion: 'Error al iniciar sesión de Steam tras última actualización.',
      prioridad: 'Baja',
      estado: 'Resuelta'
    }
  ]);

  const [puesto, setPuesto] = useState('Pc 16 (Gamer)');
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

    const nueva = {
      id: Date.now(),
      puesto,
      tipo,
      prioridad,
      descripcion: descripcion.trim(),
      estado: 'Abierta'
    };

    setIncidencias([nueva, ...incidencias]);
    setDescripcion('');
    setErrorValidacion('');
    setMensajeExito(`Incidencia reportada para ${nueva.puesto}. Puesto marcado para revisión.`);
  };

  const marcarResuelta = (id) => {
    setIncidencias(
      incidencias.map((inc) =>
        inc.id === id ? { ...inc, estado: 'Resuelta' } : inc
      )
    );
    setMensajeExito('Incidencia marcada como resuelta. El equipo puede volver a habilitarse.');
  };

  return (
    <main className="sesiones-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Registro de Incidencias y Fallas</h2>
          <p className="text-secondary mb-0">Control de mantenimiento técnico y problemas de equipos</p>
        </div>
        <Link to="/panel" className="btn btn-outline-secondary btn-sm">
          &lt;- Volver al Panel
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
                  value={puesto}
                  onChange={(e) => setPuesto(e.target.value)}
                >
                  <option value="Pc 02 (general)">Pc 02 (general)</option>
                  <option value="Pc 05 (general)">Pc 05 (general)</option>
                  <option value="Pc 16 (Gamer)">Pc 16 (Gamer)</option>
                  <option value="Pc 23 (Grupal)">Pc 23 (Grupal)</option>
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