import React, { useState } from 'react';

function FormPagoSimulado({ equipo, horaFinActualTexto, onConfirmarPago, onCancelar }) {
  const [metodoPago, setMetodoPago] = useState('Efectivo en caja');
  const montoTotal = equipo.horasUsadas * equipo.tarifaHora;

  const manejarSubmit = (e) => {
    e.preventDefault();
    onConfirmarPago(metodoPago, montoTotal);
  };

  return (
    <form onSubmit={manejarSubmit} className="mt-3 p-3 bg-white rounded border border-primary text-dark">
      <h6 className="fw-bold text-primary mb-2">
        Resumen de Cobro y Cierre de Sesión (Simulación)
      </h6>
      <p className="mb-1 small">
        <strong>Cliente:</strong> {equipo.clienteActual} |{' '}
        <strong>Fecha:</strong> {equipo.fechaSesion} |{' '}
        <strong>Horario:</strong> {equipo.horaInicio} a {horaFinActualTexto} hrs
      </p>
      <p className="mb-2 fs-6">
        <strong>Total a pagar: </strong>
        <span className="text-success fw-bold">
          ${montoTotal.toLocaleString('es-CL')}
        </span>
      </p>

      <div className="mb-3">
        <label className="form-label small fw-bold mb-1">Medio de pago (simulado):</label>
        <select
          className="form-select form-select-sm"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          <option value="Efectivo en caja">Efectivo en caja</option>
          <option value="Tarjeta Débito / Crédito">Tarjeta Débito / Crédito</option>
          <option value="Transferencia">Transferencia electrónica</option>
        </select>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm fw-bold">
          Registrar Pago y Liberar PC
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormPagoSimulado;