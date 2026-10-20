import React, { useState } from 'react';

function FormNuevaSesion({ fechaActualSistema, horaActualSistema, reserva, reservaEsHoy, onIniciarSesion }) {
  const [nuevoCliente, setNuevoCliente] = useState('');
  const [horasIniciales, setHorasIniciales] = useState(1);

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!nuevoCliente.trim()) return;
    onIniciarSesion(nuevoCliente, Number(horasIniciales));
    setNuevoCliente('');
  };

  return (
    <form onSubmit={manejarSubmit} className="mt-3 p-3 bg-white rounded border border-success text-dark">
      <h6 className="fw-bold text-success mb-2">
        Asignar Puesto a Nuevo Usuario ({fechaActualSistema} a las {horaActualSistema} hrs)
      </h6>
      {reservaEsHoy && (
        <p className="small text-muted mb-2">
          Nota: Hoy este equipo tiene reserva de{' '}
          <strong>{reserva.inicio} a {reserva.fin} hrs</strong> ({reserva.cliente}).
        </p>
      )}
      <div className="row g-2 align-items-end">
        <div className="col-12 col-sm-6">
          <label className="form-label small fw-bold mb-1">Nombre del Cliente:</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Ej: Diego Ibarra"
            value={nuevoCliente}
            onChange={(e) => setNuevoCliente(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-sm-3">
          <label className="form-label small fw-bold mb-1">Duración:</label>
          <select
            className="form-select form-select-sm"
            value={horasIniciales}
            onChange={(e) => setHorasIniciales(e.target.value)}
          >
            <option value={0.5}>0.5 hrs (30m)</option>
            <option value={1}>1 hora</option>
            <option value={1.5}>1.5 hrs</option>
            <option value={2}>2 horas</option>
            <option value={3}>3 horas</option>
          </select>
        </div>
        <div className="col-6 col-sm-3 d-grid">
          <button type="submit" className="btn btn-success btn-sm fw-bold">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormNuevaSesion;