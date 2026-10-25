import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TablaIncidencias from '../components/TablaIncidencias';
import '../css/Sesiones.css';

function Incidencias({ listaPcs = [], cambiarEstadoPc }) {
  // Incidencias iniciales que coinciden con Operativos (PC-05 y PC-22)
  const [incidencias, setIncidencias] = useState([
    {
      id: 1,
      puesto: 'Pc 05 (General)',
      pcId: 'PC-05',
      pcSala: 'Sala general',
      tipo: 'Hardware',
      prioridad: 'Alta',
      descripcion: 'Falla en tarjeta gráfica. Equipo bloqueado temporalmente.',
      estado: 'Abierta'
    },
    {
      id: 2,
      puesto: 'Pc 22 (Grupos)',
      pcId: 'PC-22',
      pcSala: 'Sala grupos',
      tipo: 'Periféricos',
      prioridad: 'Media',
      descripcion: 'Teclado mecánico con tecla espaciadora bloqueada. Requiere cambio de repuesto.',
      estado: 'Abierta'
    }
  ]);

  // Selección inicial con formato "sala|id"
  const pcInicial = listaPcs.length > 0 ? `${listaPcs[0].sala}|${listaPcs[0].id}` : 'Sala general|PC-01';
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

    const nombrePuesto = pcSeleccionado ? pcSeleccionado.nombre : id;

    const nueva = {
      id: Date.now(),
      puesto: nombrePuesto,
      pcId: id,
      pcSala: sala,
      tipo,
      prioridad,
      descripcion: descripcion.trim(),
      estado: 'Abierta'
    };

    setIncidencias([nueva, ...incidencias]);
    setDescripcion('');
    setErrorValidacion('');

    if (cambiarEstadoPc) {
      cambiarEstadoPc({ id, sala }, 'Fuera_de_servicio', descripcion.trim());
    }

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
      if (cambiarEstadoPc) {
        cambiarEstadoPc(
          { id: incidencia.pcId, pcSala: incidencia.pcSala },
          'Disponible',
          'Equipo libre y operativo'
        );
      }
      setMensajeExito(`Incidencia de ${incidencia.puesto} resuelta. El equipo vuelve a estar Disponible.`);
    }
  };

  return (
    <main className="sesiones-container container-fluid px-2 px-md-3">
      {/* Ajuste responsive para el encabezado: en móvil se apila, en PC se pone en fila */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 mt-3">
        <div>
          <h2 className="fw-bold mb-1 fs-3">Registro de Incidencias y Fallas</h2>
          <p className="text-secondary mb-0 small">Control de mantenimiento técnico y problemas de equipos</p>
        </div>
        <Link to="/panel" className="btn btn-outline-secondary btn-sm w-100 text-md-center" style={{ maxWidth: '200px' }}>
          &lt; Volver al Panel
        </Link>
      </div>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show mb-4">
          {mensajeExito}
          <button type="button" className="btn-close" onClick={() => setMensajeExito('')}></button>
        </div>
      )}

      <div className="tarjeta-sesion shadow-sm border-0 rounded-3 mb-4">
        <div className="tarjeta-sesion-header bg-light border-bottom p-3 fw-bold rounded-top">
          Reportar Nueva Falla
        </div>
        <div className="p-3 p-md-4">
          {errorValidacion && (
            <div className="alert alert-danger py-2 px-3 small fw-semibold mb-3">
              {errorValidacion}
            </div>
          )}
          <form onSubmit={registrarIncidencia}>
            {/* Ajuste g-3 para espaciado en móviles */}
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold mb-1">Puesto afectado:</label>
                <select
                  className="form-select form-select-sm"
                  value={puestoVal}
                  onChange={(e) => setPuestoVal(e.target.value)}
                >
                  {listaPcs.length > 0 ? (
                    listaPcs.map((pc) => (
                      <option key={`${pc.sala}|${pc.id}`} value={`${pc.sala}|${pc.id}`}>
                        {pc.nombre} - {pc.estado.replace('_', ' ')}
                      </option>
                    ))
                  ) : (
                    <option value="Sala general|PC-01">Pc 01 (General) - Disponible</option>
                  )}
                </select>
              </div>

              <div className="col-12 col-sm-6 col-md-3">
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

              <div className="col-12 col-sm-6 col-md-2">
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

              {/* Botón adaptado a móvil (ancho completo) y escritorio (alineado a la derecha) */}
              <div className="col-12 d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-danger btn-sm fw-bold px-4 w-100 w-md-auto">
                  Reportar Incidencia
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <TablaIncidencias incidencias={incidencias} onResolver={marcarResuelta} />
      </div>
    </main>
  );
}

export default Incidencias;