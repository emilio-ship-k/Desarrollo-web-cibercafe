import { useState } from 'react';
import '../Css_componentes/Modal_reserva.css';

function Modal_Reserva({ pc, funcionCerrar, funcionConfirmar }) {
  const [fecha, setFecha] = useState('2026-10-24');
  const [horaInicio, setHoraInicio] = useState('18:00');
  const [horaFin, setHoraFin] = useState('19:30');
  const [errorModal, setErrorModal] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (horaFin <= horaInicio) {
      setErrorModal('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    funcionConfirmar(pc, fecha, horaInicio, horaFin);
  };

  return (
    <div className="fondo-modal-oscuro">
      <div className="ventana-emergente-reserva">
        <h3>Reservar {pc.id}</h3>

        {errorModal && (
          <div className="alert alert-danger py-1 px-2 small mb-2 fw-semibold">
            {errorModal}
          </div>
        )}

        <form onSubmit={manejarEnvio}>
          <div className="mb-3 text-start">
            <label className="form-label small fw-bold mb-1">Fecha:</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label small fw-bold mb-1">Hora Inicio:</label>
            <input
              type="time"
              className="form-control"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label small fw-bold mb-1">Hora Fin:</label>
            <input
              type="time"
              className="form-control"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              required
            />
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