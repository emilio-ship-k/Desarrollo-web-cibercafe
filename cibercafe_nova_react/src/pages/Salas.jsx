import React, { useState } from 'react';
import '../css/Salas.css';
import Modal_Reserva from '../components/Modal_reserva';
function Salas() {
 
  const [pcSeleccionado, setPcSeleccionado] = useState(null);

  // lista de PCs 
  const [listaPcs, setListaPcs] = useState([
    { id: 'PC-01', estado: 'disponible' }, { id: 'PC-02', estado: 'en_uso' },
    { id: 'PC-03', estado: 'disponible' },{ id: 'PC-04', estado: 'disponible' }
    ,{ id: 'PC-05', estado: 'en_uso' } ,{ id: 'PC-06', estado: 'en_uso' }
  ]);

 const guardarReserva = (pc) => {
    alert(`¡Reserva exitosa !`);
    setPcSeleccionado(null);
  };

  return (
    <main className="salas-container">
      <h2>Salas y Puestos</h2>
      
     
      <div className="grilla-pcs">
        {listaPcs.map((pc) => (
          <div key={pc.id} className={`puesto pc-${pc.estado}`} 
            
          
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

      
      {pcSeleccionado && (
        <Modal_Reserva 
          pc = {pcSeleccionado}
          funcionCerrar={() => setPcSeleccionado(null)}
          funcionConfirmar={guardarReserva}
        />
      )}
    </main>
  );
}

export default Salas;

