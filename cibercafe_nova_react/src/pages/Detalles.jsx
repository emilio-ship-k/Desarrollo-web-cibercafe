import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Detalles.css';

function Detalles() {
  const [equipo] = useState({
    id: 'PC-16',
    nombre: 'Pc 16 (Gamer)',
    estado: 'En uso',
    hardware: 'Procesador Intel i7 13700F, 32GB RAM, DDR5, RTX 4070, Monitor 165hz',
    sesionActual: 'Iniciada a las 15:30 hrs por Cliente: Diego Ibarra (Tiempo usado: 1 h 30 min)',
    reservaProxima: '19:00 hrs - 21:00 hrs (Cliente: Jonathan Nuñez)',
    tarifa: '$3.500 / hora (Tarifa Gamer)',
    motivo: 'Sesión activa asignada a Diego Ibarra en turno de tarde'
  });

  const obtenerColorBadge = () => {
    if (equipo.estado === 'Disponible') return 'estado-badge disponible-det';
    if (equipo.estado === 'En uso') return 'estado-badge uso';
    if (equipo.estado === 'Reservado') return 'estado-badge reservado-det';
    return 'estado-badge fuera-servicio-det';
  };

  return (
    <main className="detalles-main container">
      <Link to="/salas" className="volver">
        &lt;- Volver a Salas y Puestos
      </Link>

      <article className="panel-detalle shadow-sm">
        <header className="detalle-header">
          <h1>{equipo.nombre}</h1>
          <p className={obtenerColorBadge()}>{equipo.estado.toUpperCase()}</p>
        </header>

        <dl className="lista-especificaciones mb-0">
          <dt>Hardware</dt>
          <dd>{equipo.hardware}</dd>

          <dt>Sesión Actual</dt>
          <dd className={equipo.estado === 'En uso' ? 'fw-bold text-dark' : 'text-muted'}>
            {equipo.sesionActual}
          </dd>

          <dt>Reserva Próxima</dt>
          <dd>{equipo.reservaProxima}</dd>

          <dt>Tarifa Aplicada</dt>
          <dd className="fw-semibold text-primary">{equipo.tarifa}</dd>

          <dt>Motivo / Registro</dt>
          <dd className="fw-semibold">{equipo.motivo}</dd>
        </dl>
      </article>
    </main>
  );
}

export default Detalles;