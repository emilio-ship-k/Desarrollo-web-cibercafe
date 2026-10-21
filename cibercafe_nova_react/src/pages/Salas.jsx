import React, { useState } from 'react';
import '../css/Salas.css';

function Salas() {
  // Estado para controlar si la ventana de reserva está abierta y qué PC elegimos
  const [pcSeleccionado, setPcSeleccionado] = useState(null);

  // lista de PCs 
  const [listaPcs, setListaPcs] = useState([
    { id: 'PC-01', estado: 'disponible' }, { id: 'PC-02', estado: 'en_uso' },
    { id: 'PC-03', estado: 'disponible' },{ id: 'PC-04', estado: 'disponible' }
    ,{ id: 'PC-05', estado: 'en_uso' } ,{ id: 'PC-06', estado: 'en_uso' }
  ]);

  // Función para guardar la reserva 
  const confirmarReserva = (e) => {
    e.preventDefault(); // Evita que la página recargue
    alert(`Reserva confirmada para el ${pcSeleccionado.id}`);
    setPcSeleccionado(null); // Cierra la ventana
  };

  return (
    <main className="salas-container">
      <h2>Salas y Puestos</h2>
      
      {/* MAPA DE PCs */}
      <div className="grilla-pcs">
        {listaPcs.map((pc) => (
          <div key={pc.id} className={`puesto pc-${pc.estado}`} 
            
          // Si está disponible, al hacer clic lo seleccionamos para reservar
              onClick={() => {
              if (pc.estado === 'disponible') {
                setPcSeleccionado(pc);
              }
            }}
          >
            {pc.id}
          </div>
        ))}
      </div>

      {/* formulario de reserva aparece cuando se seleciona un pc */}
      {pcSeleccionado && (
        <div className="modal-reserva">
          <form onSubmit={confirmarReserva} className="cuadro-reserva">
            <h3>Reservar {pcSeleccionado.id}</h3>
            
            <label>Fecha:</label>
            <input type="date" required />
            
            <label>Hora Inicio:</label>
            <input type="time" required />
            
            <label>Hora Fin:</label>
            <input type="time" required />
            
            <div className="botones">
               {/* Botón de Cancelar */}
              <button type="button" onClick={() => setPcSeleccionado(null)}>
                Cancelar
              </button>
               {/* Botón de Confirmar  */}
              <button type="submit">
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default Salas;

