import React from 'react';

function TablaSesiones({ sesiones, tarifaPorHora, onExtender, onCobrar }) {
  return (
    <div className="tarjeta-sesion">
      <div className="tarjeta-sesion-header">
        Sesiones en Curso ({sesiones.length})
      </div>
      <div className="table-responsive">
        <table className="tabla-base">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Puesto</th>
              <th style={{ width: '22%' }}>Cliente</th>
              <th style={{ width: '12%' }}>Inicio</th>
              <th style={{ width: '14%' }}>Tiempo Usado</th>
              <th style={{ width: '12%' }}>Subtotal</th>
              <th style={{ width: '20%', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sesiones.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No hay sesiones activas en este momento.
                </td>
              </tr>
            ) : (
              sesiones.map((s) => (
                <tr key={s.id}>
                  <td className="fw-bold">{s.equipo}</td>
                  <td>{s.cliente}</td>
                  <td>{s.horaInicio}</td>
                  <td>{s.tiempoTexto}</td>
                  <td className="text-primary fw-bold">
                    ${Math.round(s.horas * tarifaPorHora).toLocaleString('es-CL')}
                  </td>
                  <td>
                    <div className="acciones-grupo">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary fw-bold"
                        onClick={() => onExtender(s.id)}
                      >
                        +30 min
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger fw-bold"
                        onClick={() => onCobrar(s)}
                      >
                        Finalizar y Cobrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaSesiones;