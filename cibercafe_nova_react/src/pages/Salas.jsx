import React, { useState } from 'react';
import '../css/Salas.css';
import Modal_Reserva from '../components/Modal_reserva';

const SALAS = ['Sala general', 'Sala gaming', 'Sala grupos'];

function Salas({ listaPcs, cambiarEstadoPc }) {

  const [pcSeleccionado, setPcSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroSala, setFiltroSala] = useState('todas');

  const estadosDisponibles = [...new Set(listaPcs.map((pc) => pc.estado))];

  const pcsFiltrados = listaPcs.filter((pc) => {
    const coincideTexto = pc.id.toLowerCase().includes(busqueda.trim().toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || pc.estado === filtroEstado;
    const coincideSala = filtroSala === 'todas' || pc.sala === filtroSala;
    return coincideTexto && coincideEstado && coincideSala;
  });

  const guardarReserva = (pc) => {
    cambiarEstadoPc(pc, 'Reservado');
    alert(`¡Reserva exitosa para el ${pc.id} (${pc.sala})!`);
    setPcSeleccionado(null);
  };

  return (
    <main className="salas-container">
      <h2>Salas y computadores</h2>

      <div className="caja-filtros">
        <div className="barra-filtros">
          <input
            type="text"
            placeholder="Buscar PC (ej: PC-03)"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select value={filtroSala} onChange={(e) => setFiltroSala(e.target.value)}>
            <option value="todas">Todas las salas</option>
            {SALAS.map((sala) => (
              <option key={sala} value={sala}>{sala}</option>
            ))}
          </select>

          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            {estadosDisponibles.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>

      {pcsFiltrados.length === 0 ? (
        <p>No se encontraron PCs con esos criterios.</p>
      ) : (
        SALAS.map((sala) => {
          const pcsDeSala = pcsFiltrados.filter((pc) => pc.sala === sala);
          if (pcsDeSala.length === 0) return null;

          return (
            <section key={sala} className="sala-bloque">
              <h3>{sala}</h3>
              <div className="grilla-pcs">
                {pcsDeSala.map((pc) => (
                  <div
                    key={`${pc.sala}-${pc.id}`}
                    className={`puesto pc-${pc.estado}`}
                    onClick={() => {
                      if (pc.estado === 'Disponible') setPcSeleccionado(pc);
                    }}
                  >
                    {pc.id}
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}

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