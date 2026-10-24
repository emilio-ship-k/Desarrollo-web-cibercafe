import React, { useState } from 'react';
import '../css/Salas.css';
import Modal_Reserva from '../components/Modal_reserva';

function Salas({ listaPcs, cambiarEstadoPc }) {
  
  const [pcSeleccionado, setPcSeleccionado] = useState(null);

  const guardarReserva = (pc) => {
    
    cambiarEstadoPc(pc.id, 'Reservado');
    
    alert(`¡Reserva exitosa para el ${pc.id}!`);
    setPcSeleccionado(null);
  };

  return (
    <main className="salas-container">
      <h2>Salas y Puestos</h2>
      
      <div className="grilla-pcs">
        
        {listaPcs.map((pc) => (
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
        ))}
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