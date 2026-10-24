import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Detalles.css';

function Detalles({ equipo, cambiarEstadoPc }) {
  const [nuevoEstado, setNuevoEstado] = useState(equipo ? equipo.estado : 'Disponible');
  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [errorTexto, setErrorTexto] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  if (!equipo) {
    return (
      <main className="detalles-main container">
        <p>No se encontró información del equipo seleccionado.</p>
        <Link to="/salas" className="volver">&lt;- Volver a Salas y Puestos</Link>
      </main>
    );
  }

  // Estilo de la píldora según el estado
  const obtenerColorBadge = () => {
    if (equipo.estado === 'Disponible') return 'estado-badge disponible-det';
    if (equipo.estado === 'En_uso') return 'estado-badge uso';
    if (equipo.estado === 'Reservado') return 'estado-badge reservado-det';
    return 'estado-badge fuera-servicio-det';
  };

  // Guardar el nuevo estado y motivo obligatorio
  const manejarGuardar = (e) => {
    e.preventDefault();

    if (!nuevoMotivo.trim() || nuevoMotivo.trim().length < 5) {
      setErrorTexto('Por favor ingresa un motivo claro (mínimo 5 caracteres).');
      return;
    }

    cambiarEstadoPc(equipo, nuevoEstado, nuevoMotivo.trim());
    setErrorTexto('');
    setMensajeExito(`Estado de ${equipo.id} (${equipo.sala}) actualizado a "${nuevoEstado.replace('_', ' ')}".`);
    setNuevoMotivo('');
  };

  return (
    <main className="detalles-main container">
      <Link to="/salas" className="volver">
        &lt;- Volver a Salas y Puestos
      </Link>

      <article className="panel-detalle shadow-sm">
        <header className="detalle-header">
          <div>
            <h1>{equipo.nombre}</h1>
            <span className="badge bg-light text-dark border mt-1">{equipo.sala}</span>
          </div>
          <p className={obtenerColorBadge()}>{equipo.estado.replace('_', ' ').toUpperCase()}</p>
        </header>

        <dl className="lista-especificaciones mb-4">
          <dt>Hardware</dt>
          <dd>{equipo.hardware}</dd>

          <dt>Sesión Actual</dt>
          <dd className="text-muted">{equipo.sesionActual}</dd>

          <dt>Reserva Próxima</dt>
          <dd>{equipo.reservaProxima}</dd>

          <dt>Tarifa Aplicada</dt>
          <dd className="fw-semibold text-primary">{equipo.tarifa}</dd>

          <dt>Motivo / Registro</dt>
          <dd className="fw-semibold text-dark">{equipo.motivo}</dd>
        </dl>

        {mensajeExito && (
          <div className="alert alert-success py-2 px-3 small fw-bold mb-3">
            {mensajeExito}
          </div>
        )}

        {errorTexto && (
          <div className="alert alert-danger py-2 px-3 small fw-bold mb-3">
            {errorTexto}
          </div>
        )}

        {/* Formulario de cambio de estado de la rúbrica */}
        <section className="alerta-detalle">
          <h5 className="fw-bold mb-2">Cambiar Estado Operativo</h5>
          <form onSubmit={manejarGuardar}>
            <div className="row g-2 align-items-center mb-2">
              <div className="col-12 col-md-4">
                <label className="small fw-bold mb-1 d-block">Nuevo Estado:</label>
                <select
                  className="form-select form-select-sm"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En_uso">En uso</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Fuera_de_servicio">Fuera de servicio</option>
                </select>
              </div>

              <div className="col-12 col-md-8">
                <label className="small fw-bold mb-1 d-block">Motivo obligatorio:</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ej: Revisión técnica de periféricos..."
                  value={nuevoMotivo}
                  onChange={(e) => setNuevoMotivo(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button type="submit" className="btn-op peligro">
                Confirmar Cambio de Estado
              </button>
            </div>
          </form>
        </section>
      </article>
    </main>
  );
}

export default Detalles;