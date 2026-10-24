import React from 'react';
import '../Css_componentes/BotoneraEstado.css';
function BotoneraEstados({ estadoSeleccionado, onSeleccionar }) {
  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      <button
        type="button"
        className={`btn btn-sm fw-bold ${
          estadoSeleccionado === 'Disponible' ? 'btn-success' : 'btn-outline-success'
        }`}
        onClick={() => onSeleccionar('Disponible')}
      >
        ✓ Liberar / Disponible
      </button>

      <button
        type="button"
        className={`btn btn-sm fw-bold ${
          estadoSeleccionado === 'En_uso' ? 'btn-danger' : 'btn-outline-danger'
        }`}
        onClick={() => onSeleccionar('En_uso')}
      >
        ▶ Iniciar Sesión (En_uso)
      </button>

      <button
        type="button"
        className={`btn btn-sm fw-bold ${
          estadoSeleccionado === 'Reservado' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'
        }`}
        onClick={() => onSeleccionar('Reservado')}
      >
        Asignar Reserva
      </button>

      <button
        type="button"
        className={`btn btn-sm fw-bold ${
          estadoSeleccionado === 'Fuera_de_servicio' ? 'btn-secondary' : 'btn-outline-secondary'
        }`}
        onClick={() => onSeleccionar('Fuera_de_servicio')}
      >
        Reportar Falla (Bloquear)
      </button>
    </div>
  );
}

export default BotoneraEstados;