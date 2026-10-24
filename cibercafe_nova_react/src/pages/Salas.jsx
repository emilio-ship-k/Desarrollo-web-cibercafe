import React, { useState } from 'react';
import '../css/Salas.css';
import Modal_Reserva from '../components/Modal_reserva';

function Salas({ listaPcs, cambiarEstadoPc }) {

  const [pcSeleccionado, setPcSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const estadosDisponibles = [...new Set(listaPcs.map((pc) => pc.estado))];

  const pcsFiltrados = listaPcs.filter((pc) => {
    const coincideTexto = pc.id.toLowerCase().includes(busqueda.trim().toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || pc.estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  const guardarReserva = (pc) => {
    cambiarEstadoPc(pc.id, 'Reservado');
    alert(`¡Reserva exitosa para el ${pc.id}!`);
    setPcSeleccionado(null);
  };

  return (
    <main className="salas-container">
      <h2>Salas y Puestos</h2>

      <div className="caja-filtros">
        <div className="barra-filtros">
          <input
            type="text"
            placeholder="Buscar PC (ej: PC-03)"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos</option>
            {estadosDisponibles.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grilla-pcs">
        {pcsFiltrados.length === 0 ? (
          <p>No se encontraron PCs con esos criterios.</p>
        ) : (
          pcsFiltrados.map((pc) => (
            <div
              key={pc.id}
              className={`puesto pc-${pc.estado}`}
              onClick={() => {
                if (pc.estado === 'Disponible') {
                  setPcSeleccionado(pc);
                }
              }}
            >
              {pc.id}
            </div>
          ))
        )}
      </div>

      {pcSeleccionado && (
        <Modal_Reserva
          pc={pcSeleccionado}
          funcionCerrar={() => setPcSeleccionado(null)}
          funcionConfirmar={guardarReserva}
        />
      )}
    </main>
  );
}

export default Salas;