import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TablaSesiones from '../components/TablaSesiones';
import TablaReservasEspera from '../components/TablaReservasEspera';
import '../css/Sesiones.css';

function Sesiones() {
  const tarifaPorHora = 3500;

  const [sesiones, setSesiones] = useState([
    { id: 1, equipo: 'Pc 02 (general)', cliente: 'Sebastián Quezada', horaInicio: '16:15', tiempoTexto: '45 min', horas: 0.75 },
    { id: 2, equipo: 'Pc 16 (Gamer)', cliente: 'Diego Ibarra', horaInicio: '15:30', tiempoTexto: '1 h 30 min', horas: 1.5 },
    { id: 3, equipo: 'Pc 23 (Grupal)', cliente: 'Jonathan Nuñez', horaInicio: '15:30', tiempoTexto: '1 h 30 min', horas: 1.5 }
  ]);

  const [proximasReservas] = useState([
    { id: 101, puesto: 'Pc 08 (General)', cliente: 'Sebastián Quezada', horario: '18:00 - 20:00 hrs', estado: 'Confirmada' },
    { id: 102, puesto: 'Pc 19 (Gamer)', cliente: 'Jonathan Nuñez', horario: '19:00 - 21:00 hrs', estado: 'Confirmada' }
  ]);

  const [nuevoEquipo, setNuevoEquipo] = useState('Pc 01 (General)');
  const [nuevoCliente, setNuevoCliente] = useState('');
  const [nuevasHoras, setNuevasHoras] = useState(1);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [cobroPendiente, setCobroPendiente] = useState(null);
  const [mensajeAlerta, setMensajeAlerta] = useState('');

  const registrarSesion = (e) => {
    e.preventDefault();
    if (!nuevoCliente.trim() || nuevoCliente.trim().length < 3) {
      setErrorValidacion('El nombre del cliente debe tener al menos 3 letras.');
      return;
    }

    const ahora = new Date();
    const horaActual = ahora.toTimeString().slice(0, 5);

    const nueva = {
      id: Date.now(),
      equipo: nuevoEquipo,
      cliente: nuevoCliente.trim(),
      horaInicio: horaActual,
      tiempoTexto: `${nuevasHoras} hr(s)`,
      horas: Number(nuevasHoras)
    };

    setSesiones([...sesiones, nueva]);
    setNuevoCliente('');
    setNuevasHoras(1);
    setErrorValidacion('');
    setMensajeAlerta(`Sesión iniciada con éxito para ${nueva.cliente} en ${nueva.equipo}.`);
  };

  const extenderTiempo = (id) => {
    setSesiones(
      sesiones.map((s) =>
        s.id === id ? { ...s, horas: s.horas + 0.5, tiempoTexto: `${s.horas + 0.5} hrs` } : s
      )
    );
    setMensajeAlerta('Se agregaron 30 minutos a la sesión seleccionada.');
  };

  const prepararCobro = (sesion) => {
    setCobroPendiente({
      id: sesion.id,
      equipo: sesion.equipo,
      cliente: sesion.cliente,
      tiempoTexto: sesion.tiempoTexto,
      total: Math.round(sesion.horas * tarifaPorHora)
    });
  };

  const confirmarCobro = () => {
    setSesiones(sesiones.filter((s) => s.id !== cobroPendiente.id));
    setMensajeAlerta(`Cobro finalizado: $${cobroPendiente.total.toLocaleString('es-CL')} pagados por ${cobroPendiente.cliente}. Puesto liberado.`);
    setCobroPendiente(null);
  };

  return (
    <main className="sesiones-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Gestión de Sesiones y Caja</h2>
          <p className="text-secondary mb-0">Control de puestos activos, cobros y reservas en espera</p>
        </div>
        <Link to="/panel" className="btn btn-outline-secondary btn-sm">&lt;- Volver al Panel</Link>
      </div>

      {mensajeAlerta && (
        <div className="alert alert-success alert-dismissible fade show mb-4">
          {mensajeAlerta}
          <button type="button" className="btn-close" onClick={() => setMensajeAlerta('')}></button>
        </div>
      )}

      {cobroPendiente && (
        <div className="card border-primary mb-4 shadow-sm">
          <div className="card-header bg-primary text-white fw-bold">Recibo de Cierre y Cobro Total</div>
          <div className="card-body">
            <p className="mb-1"><strong>Equipo:</strong> {cobroPendiente.equipo}</p>
            <p className="mb-1"><strong>Cliente:</strong> {cobroPendiente.cliente}</p>
            <p className="mb-2"><strong>Tiempo registrado:</strong> {cobroPendiente.tiempoTexto}</p>
            <h4 className="text-success fw-bold mb-3">Total a pagar: ${cobroPendiente.total.toLocaleString('es-CL')}</h4>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-success fw-bold" onClick={confirmarCobro}>Confirmar Pago y Liberar Equipo</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setCobroPendiente(null)}>Volver</button>
            </div>
          </div>
        </div>
      )}

      <div className="tarjeta-sesion">
        <div className="tarjeta-sesion-header">Iniciar Nueva Sesión</div>
        <div className="p-3">
          {errorValidacion && <div className="alert alert-danger py-2 px-3 small fw-semibold mb-3">{errorValidacion}</div>}
          <form onSubmit={registrarSesion}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <label className="form-label small fw-bold mb-1">Puesto disponible:</label>
                <select className="form-select form-select-sm" value={nuevoEquipo} onChange={(e) => setNuevoEquipo(e.target.value)}>
                  <option value="Pc 01 (General)">Pc 01 (General)</option>
                  <option value="Pc 03 (General)">Pc 03 (General)</option>
                  <option value="Pc 04 (General)">Pc 04 (General)</option>
                  <option value="Pc 06 (General)">Pc 06 (General)</option>
                  <option value="Pc 07 (General)">Pc 07 (General)</option>
                  <option value="Pc 09 (General)">Pc 09 (General)</option>
                  <option value="Pc 10 (General)">Pc 10 (General)</option>
                  <option value="Pc 11 (Gaming)">Pc 11 (Gaming)</option>
                  <option value="Pc 17 (Gaming)">Pc 17 (Gaming)</option>
                  <option value="Pc 21 (Grupos)">Pc 21 (Grupos)</option>
                  <option value="Pc 24 (Grupos)">Pc 24 (Grupos)</option>
                  <option value="Pc 25 (Grupos)">Pc 25 (Grupos)</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-bold mb-1">Cliente:</label>
                <input type="text" className="form-control form-control-sm" placeholder="Nombre del cliente..." value={nuevoCliente} onChange={(e) => setNuevoCliente(e.target.value)} />
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label small fw-bold mb-1">Horas:</label>
                <select className="form-select form-select-sm" value={nuevasHoras} onChange={(e) => setNuevasHoras(e.target.value)}>
                  <option value={0.5}>0.5 hrs</option>
                  <option value={1}>1.0 hr</option>
                  <option value={1.5}>1.5 hrs</option>
                  <option value={2}>2.0 hrs</option>
                </select>
              </div>
              <div className="col-6 col-md-2 d-grid">
                <button type="submit" className="btn btn-primary btn-sm fw-bold">Iniciar Turno</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <TablaSesiones
        sesiones={sesiones}
        tarifaPorHora={tarifaPorHora}
        onExtender={extenderTiempo}
        onCobrar={prepararCobro}
      />

      <TablaReservasEspera reservas={proximasReservas} />
    </main>
  );
}

export default Sesiones;