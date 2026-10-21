import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormCambioEstado from '../components/FormCambioEstado';
import '../css/Detalles.css';

function Detalles() {
  const [equipo, setEquipo] = useState({
    id: 'PC-16',
    nombre: 'Pc 16 - Zona Gamer',
    estado: 'En uso',
    hardware: 'Procesador Intel i7 13700F, 32GB RAM, DDR5, RTX 4070, Monitor 165hz',
    sesionActual: {
      cliente: 'Sebastián Quezada',
      horaInicio: '16:30',
      horaFin: '18:00',
      texto: 'Activa de 16:30 a 18:00 hrs — Cliente: Sebastián Quezada'
    },
    reservaProxima: '19:00 hrs - 21:00 hrs (Cliente: Jonathan Nuñez)',
    horaInicioReserva: '19:00',
    tarifaValor: 3500,
    tarifaTexto: '$3.500 / hora (Tarifa Gamer).',
    motivo: 'Sesión activa asignada a Sebastián Quezada en turno de tarde.'
  });

  const [mensajeExito, setMensajeExito] = useState('');

  const actualizarEstadoEquipo = ({
    nuevoEstado,
    motivo,
    cliente,
    horaFinSesion,
    horaInicioReserva,
    horaFinReserva,
    montoCobrado
  }) => {
    let nuevaSesionObj = equipo.sesionActual;
    let nuevaReserva = equipo.reservaProxima;
    let nuevoInicioReserva = equipo.horaInicioReserva;
    let textoCobro = '';

    if (nuevoEstado === 'En uso') {
      const ahora = new Date();
      const horaInicioStr = ahora.toTimeString().slice(0, 5);
      nuevaSesionObj = {
        cliente,
        horaInicio: horaInicioStr,
        horaFin: horaFinSesion,
        texto: `Activa de ${horaInicioStr} a ${horaFinSesion} hrs — Cliente: ${cliente}`
      };
    } else if (nuevoEstado === 'Disponible' || nuevoEstado === 'Fuera de servicio') {
      nuevaSesionObj = {
        cliente: null,
        horaInicio: null,
        horaFin: null,
        texto: 'Sin sesión activa en este momento.'
      };

      if (montoCobrado) {
        textoCobro = ` — Total cobrado: $${montoCobrado.toLocaleString('es-CL')}`;
      }
    }

    if (nuevoEstado === 'Reservado') {
      nuevaReserva = `${horaInicioReserva} hrs - ${horaFinReserva} hrs (Cliente: ${cliente})`;
      nuevoInicioReserva = horaInicioReserva;
      nuevaSesionObj = {
        cliente: null,
        horaInicio: null,
        horaFin: null,
        texto: 'Sin sesión activa (puesto reservado).'
      };
    }

    setEquipo({
      ...equipo,
      estado: nuevoEstado,
      motivo,
      sesionActual: nuevaSesionObj,
      reservaProxima: nuevaReserva,
      horaInicioReserva: nuevoInicioReserva
    });

    setMensajeExito(
      `Cambio confirmado: El equipo pasó a "${nuevoEstado.toUpperCase()}" con el motivo: "${motivo}"${textoCobro}.`
    );
  };

  const obtenerClaseBadge = () => {
    switch (equipo.estado) {
      case 'Disponible':
        return 'estado-badge disponible-det';
      case 'En uso':
        return 'estado-badge uso';
      case 'Reservado':
        return 'estado-badge reservado-det';
      case 'Fuera de servicio':
        return 'estado-badge fuera-servicio-det';
      default:
        return 'estado-badge uso';
    }
  };

  return (
    <main className="detalles-main container">
      <Link to="/salas" className="volver">
        &lt;- Volver a Salas y Puestos
      </Link>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
          {mensajeExito}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensajeExito('')}
            aria-label="Cerrar alerta"
          ></button>
        </div>
      )}

      <article className="panel-detalle shadow-sm">
        <header className="detalle-header">
          <h1>{equipo.nombre}</h1>
          <p className={obtenerClaseBadge()}>{equipo.estado.toUpperCase()}</p>
        </header>

        <dl className="lista-especificaciones">
          <dt>Hardware</dt>
          <dd>{equipo.hardware}</dd>

          <dt>Sesión Actual</dt>
          <dd className={equipo.estado === 'En uso' ? 'fw-bold text-dark' : 'text-muted'}>
            {equipo.sesionActual.texto}
          </dd>

          <dt>Reserva Próxima</dt>
          <dd className={equipo.estado === 'Reservado' ? 'fw-bold text-dark' : ''}>
            {equipo.reservaProxima}
          </dd>

          <dt>Tarifa Aplicada</dt>
          <dd className="fw-semibold text-primary">{equipo.tarifaTexto}</dd>

          <dt>Motivo / Registro</dt>
          <dd className="fw-semibold">{equipo.motivo}</dd>
        </dl>

        {/* Sección inferior con el formulario modular */}
        <div className="alerta-detalle">
          <div>
            <strong>Registro actual del equipo:</strong> {equipo.motivo}
          </div>

          <FormCambioEstado
            estadoActual={equipo.estado}
            tarifaHora={equipo.tarifaValor}
            sesionActualInfo={equipo.sesionActual}
            horaInicioReserva={equipo.horaInicioReserva}
            onConfirmarCambio={actualizarEstadoEquipo}
          />
        </div>
      </article>
    </main>
  );
}

export default Detalles;