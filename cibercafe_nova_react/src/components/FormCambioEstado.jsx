import React, { useState } from 'react';
import BotoneraEstados from './BotoneraEstados';
import ReciboCobro from './ReciboCobro';

const MOTIVOS_SUGERIDOS = {
  Disponible: [
    'Sesión finalizada y cobro total',
    'Cliente canceló su turno por cambio de opinión o tiempo',
    'Mantenimiento completado y equipo verificado'
  ],
  'En uso': [
    'Inicio de sesión presencial por cliente en turno',
    'Ingreso de cliente que tenía reserva previa',
    'Turno extendido por solicitud en caja'
  ],
  Reservado: [
    'Reserva telefónica confirmada para próximo bloque',
    'Puesto reservado para torneo o grupo de estudio',
    'Reserva solicitada por cliente presencial'
  ],
  'Fuera de servicio': [
    'Falla en periféricos (teclado, mouse o audífonos)',
    'Problema de video o pantalla sin señal',
    'Bloqueado para limpieza y actualización de juegos'
  ]
};

const calcularHorasUso = (inicioStr, finStr) => {
  if (!inicioStr || !finStr) return 1.5;
  const [hIni, mIni] = inicioStr.split(':').map(Number);
  const [hFin, mFin] = finStr.split(':').map(Number);
  const diff = (hFin + mFin / 60) - (hIni + mIni / 60);
  return diff > 0 ? diff : 1;
};

function FormCambioEstado({
  estadoActual,
  tarifaHora = 3500,
  sesionActualInfo,
  horaInicioReserva = '19:00',
  onConfirmarCambio
}) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [nombreCliente, setNombreCliente] = useState('');
  const [horaFinSesion, setHoraFinSesion] = useState('18:00');
  const [horaInicioReservaInput, setHoraInicioReservaInput] = useState('19:00');
  const [horaFinReservaInput, setHoraFinReservaInput] = useState('21:00');
  const [motivo, setMotivo] = useState('');
  const [errorValidacion, setErrorValidacion] = useState('');

  const esSesionFinalizadaCobrada =
    estadoActual === 'En uso' &&
    estadoSeleccionado === 'Disponible' &&
    motivo === 'Sesión finalizada y cobro total';

  const horasUtilizadas = sesionActualInfo
    ? calcularHorasUso(sesionActualInfo.horaInicio, sesionActualInfo.horaFin)
    : 1.5;
  const montoTotalCobro = Math.round(horasUtilizadas * tarifaHora);

  const seleccionarAccion = (nuevoEstado) => {
    if (nuevoEstado === estadoActual) {
      setErrorValidacion(`El equipo ya se encuentra en estado "${estadoActual}".`);
      setEstadoSeleccionado(null);
      return;
    }
    setErrorValidacion('');
    setEstadoSeleccionado(nuevoEstado);
    setMotivo('');
    setNombreCliente('');
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!estadoSeleccionado) {
      setErrorValidacion('Debes seleccionar primero una acción.');
      return;
    }

    if (estadoSeleccionado === 'En uso') {
      if (!nombreCliente.trim() || nombreCliente.trim().length < 3) {
        setErrorValidacion('Campo "Nombre del cliente": Ingresa un nombre válido (mínimo 3 caracteres).');
        return;
      }
      if (!horaFinSesion) {
        setErrorValidacion('Campo "Hasta qué hora": Debes indicar la hora de término.');
        return;
      }
      if (horaFinSesion > horaInicioReserva) {
        setErrorValidacion(`Campo "Hasta qué hora": Conflicto con la reserva de las ${horaInicioReserva} hrs.`);
        return;
      }
    }

    if (estadoSeleccionado === 'Reservado') {
      if (!nombreCliente.trim() || nombreCliente.trim().length < 3) {
        setErrorValidacion('Campo "Nombre del cliente": Obligatorio para registrar la reserva.');
        return;
      }
      if (!horaInicioReservaInput || !horaFinReservaInput || horaInicioReservaInput >= horaFinReservaInput) {
        setErrorValidacion('Horario de Reserva: La hora de término debe ser posterior a la de inicio.');
        return;
      }
    }

    if (!motivo.trim() || motivo.trim().length < 5) {
      setErrorValidacion('Campo "Motivo del cambio": Obligatorio (mínimo 5 caracteres).');
      return;
    }

    setErrorValidacion('');
    onConfirmarCambio({
      nuevoEstado: estadoSeleccionado,
      motivo: motivo.trim(),
      cliente: nombreCliente.trim(),
      horaFinSesion,
      horaInicioReserva: horaInicioReservaInput,
      horaFinReserva: horaFinReservaInput,
      montoCobrado: esSesionFinalizadaCobrada ? montoTotalCobro : null
    });

    setEstadoSeleccionado(null);
    setMotivo('');
    setNombreCliente('');
  };

  return (
    <div className="form-estado mt-3 pt-3 border-top border-secondary">
      <h5 className="fw-bold mb-2">Acciones y Cambio de Estado</h5>
      <p className="small text-secondary mb-3">
        Selecciona una acción para actualizar el estado del puesto:
      </p>

      {errorValidacion && (
        <div className="alert alert-danger py-2 px-3 small fw-semibold mb-3" role="alert">
          {errorValidacion}
        </div>
      )}

      {/* Componente Modular 1: Botones */}
      <BotoneraEstados
        estadoSeleccionado={estadoSeleccionado}
        onSeleccionar={seleccionarAccion}
      />

      {estadoSeleccionado && (
        <form onSubmit={manejarEnvio} className="p-3 bg-white rounded border border-dark-subtle shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="small fw-bold text-uppercase">
              Acción: <span className="badge bg-primary fs-6">{estadoSeleccionado}</span>
            </span>
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none p-0"
              onClick={() => { setEstadoSeleccionado(null); setErrorValidacion(''); }}
            >
              Cancelar
            </button>
          </div>

          {/* Campos para "En uso" */}
          {estadoSeleccionado === 'En uso' && (
            <div className="row g-2 mb-3">
              <div className="col-12 col-sm-7">
                <label className="form-label small fw-bold mb-1">Nombre del Cliente:</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ej: Diego Ibarra"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                />
              </div>
              <div className="col-12 col-sm-5">
                <label className="form-label small fw-bold mb-1">Hasta qué hora (Máx {horaInicioReserva}):</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  value={horaFinSesion}
                  onChange={(e) => setHoraFinSesion(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Campos para "Reservado" */}
          {estadoSeleccionado === 'Reservado' && (
            <div className="row g-2 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-bold mb-1">Cliente que Reserva:</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ej: Jonathan Nuñez"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                />
              </div>
              <div className="col-6 col-sm-3">
                <label className="form-label small fw-bold mb-1">Hora Inicio:</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  value={horaInicioReservaInput}
                  onChange={(e) => setHoraInicioReservaInput(e.target.value)}
                />
              </div>
              <div className="col-6 col-sm-3">
                <label className="form-label small fw-bold mb-1">Hora Fin:</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  value={horaFinReservaInput}
                  onChange={(e) => setHoraFinReservaInput(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Sugerencias de motivo */}
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1">Seleccionar motivo frecuente:</label>
            <div className="d-flex flex-column gap-1">
              {MOTIVOS_SUGERIDOS[estadoSeleccionado]?.map((sugerencia, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`btn btn-sm text-start py-1 px-2 border ${
                    motivo === sugerencia ? 'btn-light border-primary text-primary fw-bold' : 'btn-light text-secondary'
                  }`}
                  onClick={() => setMotivo(sugerencia)}
                >
                  • {sugerencia}
                </button>
              ))}
            </div>
          </div>

          {/* Componente Modular 2: Cuadro de Cobro si es "Sesión finalizada y cobro total" */}
          {esSesionFinalizadaCobrada && (
            <ReciboCobro
              cliente={sesionActualInfo?.cliente}
              horasUtilizadas={horasUtilizadas}
              montoTotalCobro={montoTotalCobro}
              tarifaHora={tarifaHora}
            />
          )}

          {/* Campo de texto libre para el motivo */}
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1">Motivo obligatorio del cambio:</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Escribe o edita el motivo del cambio..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setEstadoSeleccionado(null)}
            >
              Cerrar
            </button>
            <button type="submit" className="btn btn-sm btn-primary fw-bold px-3">
              Confirmar Cambio
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FormCambioEstado;