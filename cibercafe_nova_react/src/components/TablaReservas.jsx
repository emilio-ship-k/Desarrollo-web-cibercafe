import React from 'react';

function TablaReservas({ reservas, onConfirmar, onCancelar }) {
  return (
    <div className="tarjeta-sesion">
      <div className="tarjeta-sesion-header">
        Listado de Reservas Programadas ({reservas.length})
      </div>
      <div className="table-responsive">
        <table className="tabla-base">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Puesto</th>
              <th style={{ width: '22%' }}>Cliente</th>
              <th style={{ width: '15%' }}>Fecha</th>
              <th style={{ width: '18%' }}>Horario</th>
              <th style={{ width: '10%' }}>Estado</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No hay reservas agendadas actualmente.
                </td>
              </tr>
            ) : (
              reservas.map((r) => (
                <tr key={r.id}>
                  <td className="fw-bold">{r.puesto}</td>
                  <td>{r.cliente}</td>
                  <td>{r.fecha}</td>
                  <td>{r.horaInicio} - {r.horaFin} hrs</td>
                  <td>
                    <span className={r.estado === 'Confirmada' ? 'badge bg-success' : 'badge bg-warning text-dark'}>
                      {r.estado}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-grupo">
                      {r.estado === 'Pendiente' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-success fw-bold"
                          onClick={() => onConfirmar(r.id)}
                        >
                          Confirmar
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger fw-bold"
                        onClick={() => onCancelar(r.id)}
                      >
                        Cancelar
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

export default TablaReservas;