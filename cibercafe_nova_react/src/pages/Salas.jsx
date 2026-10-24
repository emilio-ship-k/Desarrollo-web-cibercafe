import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Salas.css';
import Modal_Reserva from '../components/Modal_reserva';

const SALAS = ['Sala general', 'Sala gaming', 'Sala grupos'];

function Salas({ listaPcs, cambiarEstadoPc, setPcActual }) {
  const [pcSeleccionado, setPcSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroSala, setFiltroSala] = useState('todas');

  const estadosDisponibles = [...new Set(listaPcs.map((pc) => pc.estado))];

  // Filtro simultaneo por buscador de texto, sala y estado
  const pcsFiltrados = listaPcs.filter((pc) => {
    const coincideTexto = pc.id.toLowerCase().includes(busqueda.trim().toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || pc.estado === filtroEstado;
    const coincideSala = filtroSala === 'todas' || pc.sala === filtroSala;
    return coincideTexto && coincideEstado && coincideSala;
  });

  // Al hacer clic en un puesto verde, amarillo o rojo abrimos el modal
  const manejarClickPuesto = (pc) => {
    if (pc.estado === 'Fuera_de_servicio') {
      alert(`El ${pc.id} (${pc.sala}) se encuentra fuera de servicio por problemas técnicos.`);
      return;
    }
    setPcSeleccionado(pc);
  };

  // Confirmar reserva desde el modal recibiendo fecha y hora
  const guardarReserva = (pc, fecha, horaInicio, horaFin) => {
    const nuevoMotivo = `Reserva programada para el ${fecha} de ${horaInicio} a ${horaFin}`;
    cambiarEstadoPc(pc, 'Reservado', nuevoMotivo);
    alert(`¡Reserva exitosa para el ${pc.id} (${pc.sala})!`);
    setPcSeleccionado(null);
  };

  // Abrir la ficha tecnica en detalles
  const abrirDetalles = (pc) => {
    if (setPcActual) {
      setPcActual({ id: pc.id, sala: pc.sala });
    }
  };

  return (
    <main className="salas-container">
      <h2>Salas y computadores</h2>

      {/* Caja de filtros */}
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
              <option key={estado} value={estado}>{estado.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grilla dividida por sala */}
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
                  <div key={`${pc.sala}-${pc.id}`} className="tarjeta-puesto-contenedor text-center">
                    <div
                      className={`puesto pc-${pc.estado}`}
                      title={`${pc.id} (${pc.sala}) | Estado: ${pc.estado.replace('_', ' ')} | Motivo: ${pc.motivo}`}
                      onClick={() => manejarClickPuesto(pc)}
                      style={{ cursor: pc.estado !== 'Fuera_de_servicio' ? 'pointer' : 'not-allowed' }}
                    >
                      {pc.id}
                    </div>

                    <Link
                      to="/detalles"
                      className="link-detalle-puesto"
                      onClick={() => abrirDetalles(pc)}
                    >
                      Ver detalle
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* Modal de reserva interactivo */}
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