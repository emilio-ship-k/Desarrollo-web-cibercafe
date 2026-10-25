import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TablaReservas from '../components/TablaReservas';
import '../css/Sesiones.css';

function Reservas() {
  const [reservas, setReservas] = useState([
    {
      id: 101,
      puesto: 'Pc 08 (General)',
      cliente: 'Sebastián Quezada',
      fecha: '2026-10-24',
      horaInicio: '18:00',
      horaFin: '20:00',
      estado: 'Confirmada'
    },
    {
      id: 102,
      puesto: 'Pc 19 (Gamer)',
      cliente: 'Jonathan Nuñez',
      fecha: '2026-10-24',
      horaInicio: '19:00',
      horaFin: '21:00',
      estado: 'Confirmada'
    }
  ]);

  const [cliente, setCliente] = useState('');
  const [puesto, setPuesto] = useState('Pc 01 (General)');
  const [fecha, setFecha] = useState('2026-10-24');
  const [horaInicio, setHoraInicio] = useState('17:00');
  const [horaFin, setHoraFin] = useState('18:00');
  const [errorValidacion, setErrorValidacion] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const guardarReserva = (e) => {
    e.preventDefault();

    if (!cliente.trim() || cliente.trim().length < 3) {
      setErrorValidacion('Ingresa el nombre del cliente (mínimo 3 letras).');
      return;
    }

    if (horaFin <= horaInicio) {
      setErrorValidacion('La hora de término debe ser posterior a la de inicio.');
      return;
    }

    const conflicto = reservas.some((r) => {
      if (r.puesto !== puesto || r.fecha !== fecha) return false;
      return horaInicio < r.horaFin && horaFin > r.horaInicio;
    });

    if (conflicto) {
      setErrorValidacion(`El puesto ${puesto} ya tiene una reserva en ese horario.`);
      return;
    }

    const nueva = {
      id: Date.now(),
      puesto,
      cliente: cliente.trim(),
      fecha,
      horaInicio,
      horaFin,
      estado: 'Pendiente'
    };

    setReservas([...reservas, nueva]);
    setCliente('');
    setErrorValidacion('');
    setMensajeExito(`Reserva ingresada para ${nueva.cliente} en ${nueva.puesto}.`);
  };

  const confirmarReserva = (id) => {
    setReservas(
      reservas.map((r) => (r.id === id ? { ...r, estado: 'Confirmada' } : r))
    );
    setMensajeExito('Reserva confirmada exitosamente.');
  };

  const cancelarReserva = (id) => {
    const eliminada = reservas.find((r) => r.id === id);
    setReservas(reservas.filter((r) => r.id !== id));
    if (eliminada) {
      setMensajeExito(`Reserva de ${eliminada.cliente} cancelada correctamente.`);
    }
  };

  return (
    <main className="sesiones-container container-fluid px-2 px-md-3">
   
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 mt-3">
        <div>
          <h2 className="fw-bold mb-1 fs-3">Reserva de Puestos</h2>
          <p className="text-secondary mb-0 small">Agendamiento de computadores y control de turnos</p>
        </div>
        <Link to="/panel" className="btn btn-outline-secondary btn-sm w-100 text-md-center" style={{ maxWidth: '200px' }}>
          &lt; Volver al Panel
        </Link>
      </div>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show mb-4">
          {mensajeExito}
          <button type="button" className="btn-close" onClick={() => setMensajeExito('')}></button>
        </div>
      )}

      <div className="tarjeta-sesion shadow-sm border-0 rounded-3 mb-4">
        <div className="tarjeta-sesion-header bg-light border-bottom p-3 fw-bold rounded-top">
          Agendar Nueva Reserva
        </div>
        <div className="p-3 p-md-4">
          {errorValidacion && (
            <div className="alert alert-danger py-2 px-3 small fw-semibold mb-3">
              {errorValidacion}
            </div>
          )}
          <form onSubmit={guardarReserva}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold mb-1">Puesto:</label>
                <select
                  className="form-select form-select-sm"
                  value={puesto}
                  onChange={(e) => setPuesto(e.target.value)}
                >
                  <option value="Pc 01 (General)">Pc 01 (General)</option>
                  <option value="Pc 03 (General)">Pc 03 (General)</option>
                  <option value="Pc 04 (General)">Pc 04 (General)</option>
                  <option value="Pc 06 (General)">Pc 06 (General)</option>
                  <option value="Pc 07 (General)">Pc 07 (General)</option>
                  <option value="Pc 08 (General)">Pc 08 (General)</option>
                  <option value="Pc 09 (General)">Pc 09 (General)</option>
                  <option value="Pc 10 (General)">Pc 10 (General)</option>
                  <option value="Pc 11 (Gaming)">Pc 11 (Gaming)</option>
                  <option value="Pc 16 (Gamer)">Pc 16 (Gamer)</option>
                  <option value="Pc 17 (Gaming)">Pc 17 (Gaming)</option>
                  <option value="Pc 19 (Gamer)">Pc 19 (Gamer)</option>
                  <option value="Pc 21 (Grupos)">Pc 21 (Grupos)</option>
                  <option value="Pc 23 (Grupal)">Pc 23 (Grupal)</option>
                  <option value="Pc 24 (Grupos)">Pc 24 (Grupos)</option>
                  <option value="Pc 25 (Grupos)">Pc 25 (Grupos)</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold mb-1">Cliente:</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Nombre completo..."
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                />
              </div>

              <div className="col-12 col-sm-4 col-md-2">
                <label className="form-label small fw-bold mb-1">Fecha:</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>

              <div className="col-6 col-sm-4 col-md-2">
                <label className="form-label small fw-bold mb-1">Desde:</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>

              <div className="col-6 col-sm-4 col-md-2">
                <label className="form-label small fw-bold mb-1">Hasta:</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                />
              </div>

              <div className="col-12 d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary btn-sm fw-bold px-4 w-100 w-md-auto">
                  Reservar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

 
      <div className="table-responsive">
        <TablaReservas
          reservas={reservas}
          onConfirmar={confirmarReserva}
          onCancelar={cancelarReserva}
        />
      </div>
    </main>
  );
}

export default Reservas;