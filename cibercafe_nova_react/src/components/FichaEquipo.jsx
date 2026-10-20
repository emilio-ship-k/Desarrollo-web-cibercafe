import React from 'react';

function FichaEquipo({ equipo, horaFinActualTexto, horaActualSistema, fechaActualSistema, reservaEsHoy }) {
  const obtenerClaseEstado = () => {
    if (equipo.estado === 'EN USO') return 'estado-badge uso';
    if (equipo.estado === 'DISPONIBLE') return 'estado-badge disponible-det';
    return 'estado-badge fuera-servicio-det';
  };

  return (
    <>
      <header className="detalle-header">
        <h1>{equipo.nombre}</h1>
        <p className={obtenerClaseEstado()}>{equipo.estado}</p>
      </header>

      <dl className="lista-especificaciones">
        <dt>Hardware</dt>
        <dd>{equipo.hardware}</dd>

        <dt>Sesión Actual</dt>
        <dd>
          {equipo.estado === 'EN USO' && (
            <>
              Fecha: <strong>{equipo.fechaSesion}</strong> | Iniciada a las{' '}
              <strong>{equipo.horaInicio} hrs</strong> por{' '}
              <strong>Cliente: {equipo.clienteActual}</strong>
              <br />
              <span className="text-secondary small">
                Tiempo contratado: {equipo.horasUsadas} hrs (Termina a las{' '}
                <strong>{horaFinActualTexto} hrs</strong>)
              </span>
            </>
          )}
          {equipo.estado === 'DISPONIBLE' && (
            <span className="text-success fw-semibold">
              Equipo libre a las {horaActualSistema} hrs ({fechaActualSistema}). Listo para asignar cliente.
            </span>
          )}
          {equipo.estado === 'FUERA DE SERVICIO' && (
            <span className="text-danger fw-bold">
              Equipo bloqueado por mantenimiento técnico. No permite sesiones.
            </span>
          )}
        </dd>

        <dt>Reserva Próxima</dt>
        <dd>
          {equipo.reserva.activa ? (
            <span>
              Día <strong>{equipo.reserva.fecha}</strong> de{' '}
              <strong>{equipo.reserva.inicio} hrs a {equipo.reserva.fin} hrs</strong>{' '}
              (Cliente: {equipo.reserva.cliente})
              {!reservaEsHoy && (
                <span className="badge bg-secondary ms-2">Otro día (No bloquea hoy)</span>
              )}
            </span>
          ) : (
            <span className="text-muted">
              Reserva de {equipo.reserva.cliente} ya iniciada / Sin más reservas.
            </span>
          )}
        </dd>

        <dt>Tarifa Aplicada</dt>
        <dd>
          ${equipo.tarifaHora.toLocaleString('es-CL')} / hora (Tarifa Gamer)
          {equipo.estado === 'EN USO' && (
            <strong className="ms-2 text-primary">
              — Monto acumulado: ${(equipo.horasUsadas * equipo.tarifaHora).toLocaleString('es-CL')}
            </strong>
          )}
        </dd>
      </dl>
    </>
  );
}

export default FichaEquipo;