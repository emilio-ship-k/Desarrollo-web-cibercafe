import React from 'react';
import '../Css_componentes/Modal_reserva.css';

function Modal_Reserva({ pc, funcionCerrar, funcionConfirmar }) {
  
  const manejarEnvio = (envio) => {
    envio.preventDefault(); 
    funcionConfirmar(pc); 
  };

  return (
    <div className="fondo-modal-oscuro">
      <div className="ventana-emergente-reserva">
        <h3>Reservar {pc.id}</h3>
        
        <form onSubmit={manejarEnvio}>
          
          <div className="mb-3">
            <label>Fecha:</label>
            <input type="date" className="form-control" required />
          </div>
          
          <div className="mb-3">
            <label>Hora Inicio:</label>
            <input type="time" className="form-control" required />
          </div>
          
          <div className="mb-3">
            <label>Hora Fin:</label>
            <input type="time" className="form-control" required />
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={funcionCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success">
              Confirmar Reserva
            </button>
          </div>

        </form>
      </div>
    </div>
  );
} 

export default Modal_Reserva;