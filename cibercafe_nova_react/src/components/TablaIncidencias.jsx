import React from 'react';

function TablaIncidencias({ incidencias, onResolver }) {
  return (
    <div className="tarjeta-sesion">
      <div className="tarjeta-sesion-header">
        Registro de Incidencias Técnicas ({incidencias.length})
      </div>
      <div className="table-responsive">
        <table className="tabla-base">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Puesto</th>
              <th style={{ width: '18%' }}>Tipo de Falla</th>
              <th style={{ width: '30%' }}>Descripción</th>
              <th style={{ width: '12%' }}>Prioridad</th>
              <th style={{ width: '10%' }}>Estado</th>
              <th style={{ width: '12%', textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No hay incidencias reportadas. Todos los puestos operativos.
                </td>
              </tr>
            ) : (
              incidencias.map((inc) => (
                <tr key={inc.id}>
                  <td className="fw-bold">{inc.puesto}</td>
                  <td>{inc.tipo}</td>
                  <td>{inc.descripcion}</td>
                  <td>
                    <span
                      className={`badge ${
                        inc.prioridad === 'Alta'
                          ? 'bg-danger'
                          : inc.prioridad === 'Media'
                          ? 'bg-warning text-dark'
                          : 'bg-info text-dark'
                      }`}
                    >
                      {inc.prioridad}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        inc.estado === 'Abierta'
                          ? 'badge bg-danger'
                          : 'badge bg-success'
                      }
                    >
                      {inc.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {inc.estado === 'Abierta' ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success fw-bold"
                        onClick={() => onResolver(inc.id)}
                      >
                        Reparado
                      </button>
                    ) : (
                      <span className="small text-muted">Cerrada</span>
                    )}
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

export default TablaIncidencias;