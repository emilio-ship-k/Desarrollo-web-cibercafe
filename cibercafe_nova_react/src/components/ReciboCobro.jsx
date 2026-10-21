import React from 'react';

function ReciboCobro({ cliente, horasUtilizadas, montoTotalCobro, tarifaHora }) {
  return (
    <div className="alert alert-info py-2 px-3 mb-3 border-info">
      <h6 className="fw-bold mb-1 text-primary">Cierre de Sesión y Cobro Total</h6>
      <p className="small mb-1">
        <strong>Cliente:</strong> {cliente || 'Cliente en turno'} |{' '}
        <strong>Duración:</strong> {horasUtilizadas} hrs
      </p>
      <p className="fs-6 mb-0">
        <strong>Total a Pagar: </strong>
        <span className="badge bg-success fs-6">
          ${montoTotalCobro.toLocaleString('es-CL')}
        </span>
        <span className="text-muted small ms-2">
          (${tarifaHora.toLocaleString('es-CL')} / hr)
        </span>
      </p>
    </div>
  );
}

export default ReciboCobro;