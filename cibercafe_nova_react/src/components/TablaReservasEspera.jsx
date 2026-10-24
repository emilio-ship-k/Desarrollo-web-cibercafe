import React from 'react';
import { Link } from 'react-router-dom';

function TablaReservasEspera({ reservas }) {
  return (
    <div className="tarjeta-sesion">
      <div className="tarjeta-reserva-header">
        <span>Próximas Reservas en Espera ({reservas.length})</span>
        <Link to="/reservas" className="btn btn-sm btn-outline-dark py-0 fw-bold">
          Gestionar Reservas -&gt;
        </Link>
      </div>
      <div className="table-responsive">
        <table className="tabla-base">
          <thead>
            <tr>
              <th style={{ width: '28%' }}>Puesto</th>
              <th style={{ width: '32%' }}>Cliente</th>
              <th style={{ width: '25%' }}>Bloque Horario</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td className="fw-bold">{r.puesto}</td>
                <td>{r.cliente}</td>
                <td>{r.horario}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="badge-reserva">{r.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaReservasEspera;