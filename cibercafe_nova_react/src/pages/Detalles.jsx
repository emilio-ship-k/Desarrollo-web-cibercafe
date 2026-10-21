import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FichaEquipo from '../components/FichaEquipo';
import FormPagoSimulado from '../components/FormPagoSimulado';
import FormNuevaSesion from '../components/FormNuevaSesion';
import FormReporteFalla from '../components/FormReporteFalla';
import '../css/Detalles.css';

// Funciones auxiliares de conversión de hora
const textoAHorasDecimales = (horaStr) => {
  const [horas, minutos] = horaStr.split(':').map(Number);
  return horas + minutos / 60;
};

const decimalesAHoraTexto = (decimal) => {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
};

const obtenerFechaHoy = () => new Date().toISOString().split('T')[0];

function Detalles() {
  const [fechaActualSistema, setFechaActualSistema] = useState(obtenerFechaHoy());
  const [horaActualSistema, setHoraActualSistema] = useState('17:00');
  const [mensajeSistema, setMensajeSistema] = useState(null);

  // Qué formulario secundario está visible
  const [panelActivo, setPanelActivo] = useState(null);

  const [equipo, setEquipo] = useState({
    id: 'PC-16',
    nombre: 'Pc 16 - Zona Gamer',
    estado: 'EN_USO',
    hardware: 'Procesador Intel i7 13700F, 32GB RAM, DDR5, RTX 4070, Monitor 165hz',
    clienteActual: 'Sebastián Quezada',
    fechaSesion: obtenerFechaHoy(),
    horaInicio: '15:30',
    horasUsadas: 1.5,
    reserva: {
      activa: true,
      cliente: 'Jonathan Nuñez',
      fecha: obtenerFechaHoy(),
      inicio: '19:00',
      fin: '21:00'
    },
    tarifaHora: 2500,
    incidencia: 'Sin fallas críticas activas (Observación menor: tecla SHIFT revisada).'
  });

  const horaFinActualDecimal = equipo.horaInicio
    ? textoAHorasDecimales(equipo.horaInicio) + equipo.horasUsadas
    : 0;
  const horaFinActualTexto = equipo.horaInicio
    ? decimalesAHoraTexto(horaFinActualDecimal)
    : '';

  const reservaEsHoy =
    equipo.reserva.activa && equipo.reserva.fecha === fechaActualSistema;

  // Confirmar pago y liberar PC
  const confirmarPago = (metodoPago, montoTotal) => {
    const clienteSaliente = equipo.clienteActual;
    setHoraActualSistema(horaFinActualTexto);
    setEquipo({
      ...equipo,
      estado: 'DISPONIBLE',
      clienteActual: null,
      horaInicio: null,
      horasUsadas: 0
    });
    setPanelActivo(null);
    setMensajeSistema({
      tipo: 'success',
      texto: `Pago registrado ($${montoTotal.toLocaleString('es-CL')} vía ${metodoPago}) para ${clienteSaliente}. El puesto quedó DISPONIBLE a las ${horaFinActualTexto} hrs.`
    });
  };

  // Extender tiempo (+30 min) validando reserva
  const extenderTiempo = () => {
    const nuevasHoras = equipo.horasUsadas + 0.5;
    const nuevoFinDecimal = textoAHorasDecimales(equipo.horaInicio) + nuevasHoras;

    if (reservaEsHoy && nuevoFinDecimal > textoAHorasDecimales(equipo.reserva.inicio)) {
      setMensajeSistema({
        tipo: 'danger',
        texto: `No se puede extender hasta las ${decimalesAHoraTexto(nuevoFinDecimal)} hrs. Hoy ${equipo.reserva.fecha} existe una reserva a las ${equipo.reserva.inicio} hrs para ${equipo.reserva.cliente}.`
      });
      return;
    }

    setEquipo({ ...equipo, horasUsadas: nuevasHoras });
    setMensajeSistema({
      tipo: 'info',
      texto: `Tiempo extendido en 30 min. Nueva hora de término: ${decimalesAHoraTexto(nuevoFinDecimal)} hrs.`
    });
  };

  // Iniciar sesión a otro cliente validando choques
  const iniciarSesionOtroUsuario = (nuevoCliente, duracion) => {
    const inicioDecimal = textoAHorasDecimales(horaActualSistema);
    const finDecimal = inicioDecimal + duracion;
    const esDuenoReserva =
      reservaEsHoy &&
      nuevoCliente.trim().toLowerCase() === equipo.reserva.cliente.toLowerCase();

    if (reservaEsHoy && !esDuenoReserva) {
      const iniRes = textoAHorasDecimales(equipo.reserva.inicio);
      const finRes = textoAHorasDecimales(equipo.reserva.fin);

      if (inicioDecimal < finRes && finDecimal > iniRes) {
        setMensajeSistema({
          tipo: 'danger',
          texto: `Conflicto de horario: No puedes asignar de ${horaActualSistema} a ${decimalesAHoraTexto(finDecimal)} hrs porque choca con la reserva de ${equipo.reserva.cliente} (${equipo.reserva.inicio} - ${equipo.reserva.fin} hrs).`
        });
        return;
      }
    }

    setEquipo({
      ...equipo,
      estado: 'EN_USO',
      clienteActual: nuevoCliente,
      fechaSesion: fechaActualSistema,
      horaInicio: horaActualSistema,
      horasUsadas: duracion,
      reserva: esDuenoReserva ? { ...equipo.reserva, activa: false } : equipo.reserva
    });
    setPanelActivo(null);
    setMensajeSistema({
      tipo: 'info',
      texto: `Sesión iniciada para ${nuevoCliente} (${horaActualSistema} a ${decimalesAHoraTexto(finDecimal)} hrs).`
    });
  };

  // 4. Iniciar directamente al cliente de la reserva
  const iniciarReservaProxima = () => {
    const duracion =
      textoAHorasDecimales(equipo.reserva.fin) -
      textoAHorasDecimales(equipo.reserva.inicio);

    setFechaActualSistema(equipo.reserva.fecha);
    setHoraActualSistema(equipo.reserva.inicio);
    setEquipo({
      ...equipo,
      estado: 'EN_USO',
      clienteActual: equipo.reserva.cliente,
      fechaSesion: equipo.reserva.fecha,
      horaInicio: equipo.reserva.inicio,
      horasUsadas: duracion,
      reserva: { ...equipo.reserva, activa: false }
    });
    setPanelActivo(null);
    setMensajeSistema({
      tipo: 'success',
      texto: `Reserva activada: ${equipo.reserva.cliente} inició su sesión de ${equipo.reserva.inicio} a ${equipo.reserva.fin} hrs.`
    });
  };

  // Bloquear por falla y Reparar
  const guardarFalla = (descripcionFalla) => {
    setEquipo({
      ...equipo,
      estado: 'FUERA_DE_SERVICIO',
      clienteActual: null,
      horaInicio: null,
      horasUsadas: 0,
      incidencia: `BLOQUEADO POR FALLA: ${descripcionFalla}`
    });
    setPanelActivo(null);
    setMensajeSistema({
      tipo: 'danger',
      texto: 'Falla reportada. El computador quedó FUERA_DE_SERVICIO.'
    });
  };

  const marcarComoReparado = () => {
    setEquipo({
      ...equipo,
      estado: 'DISPONIBLE',
      incidencia: 'Incidencia resuelta. Equipo operativo y verificado por soporte.'
    });
    setMensajeSistema({
      tipo: 'success',
      texto: '¡Equipo marcado como REPARADO! El computador volvió a estar DISPONIBLE.'
    });
  };

  return (
    <main className="detalles-main container">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <Link to="/salas" className="volver mb-0">
          &lt;- Volver a Salas y Puesto
        </Link>

        <div className="d-flex align-items-center gap-2 bg-light border rounded px-3 py-1 small">
          <span className="fw-bold text-secondary">Horario del local:</span>
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: '135px' }}
            value={fechaActualSistema}
            onChange={(e) => setFechaActualSistema(e.target.value)}
          />
          <input
            type="time"
            className="form-control form-control-sm"
            style={{ width: '105px' }}
            value={horaActualSistema}
            onChange={(e) => setHoraActualSistema(e.target.value)}
          />
        </div>
      </div>

      {/* Alertas dinámicas */}
      {mensajeSistema && (
        <div className={`alert alert-${mensajeSistema.tipo} alert-dismissible fade show mb-3`} role="alert">
          {mensajeSistema.texto}
          <button type="button" className="btn-close" onClick={() => setMensajeSistema(null)}></button>
        </div>
      )}

      {/* Cuadro de detalles */}
      <article className="panel-detalle shadow-sm">
        {/* Ficha técnica */}
        <FichaEquipo
          equipo={equipo}
          horaFinActualTexto={horaFinActualTexto}
          horaActualSistema={horaActualSistema}
          fechaActualSistema={fechaActualSistema}
          reservaEsHoy={reservaEsHoy}
        />

        {/* Botonera de operador */}
        <div className="alerta-detalle">
          <div>
            <strong>Estado Técnico / Incidencia:</strong> {equipo.incidencia}
          </div>

          <div className="acciones_op">
            {equipo.estado === 'EN_USO' && (
              <>
                <button type="button" className="btn-op peligro" onClick={() => setPanelActivo('pago')}>
                  Finalizar y Cobrar Sesión
                </button>
                <button type="button" className="btn-op secundario" onClick={extenderTiempo}>
                  Extender Tiempo (+30m)
                </button>
                <button type="button" className="btn-op alert-btn" onClick={() => setPanelActivo(panelActivo === 'falla' ? null : 'falla')}>
                  Reportar Falla
                </button>
              </>
            )}

            {equipo.estado === 'DISPONIBLE' && (
              <>
                <button type="button" className="btn-op peligro" onClick={() => setPanelActivo(panelActivo === 'nuevoUsuario' ? null : 'nuevoUsuario')}>
                  + Iniciar Sesión ({horaActualSistema} hrs)
                </button>
                {equipo.reserva.activa && (
                  <button type="button" className="btn-op secundario" onClick={iniciarReservaProxima}>
                    Iniciar Reserva de {equipo.reserva.cliente} ({equipo.reserva.inicio})
                  </button>
                )}
                <button type="button" className="btn-op alert-btn" onClick={() => setPanelActivo(panelActivo === 'falla' ? null : 'falla')}>
                  Reportar Falla
                </button>
              </>
            )}

            {equipo.estado === 'FUERA_DE_SERVICIO' && (
              <button type="button" className="btn btn-success fw-bold btn-sm px-3 py-2" onClick={marcarComoReparado}>
                ✓ Marcar como Reparado (Habilitar PC)
              </button>
            )}
          </div>

          {panelActivo === 'pago' && equipo.estado === 'EN_USO' && (
            <FormPagoSimulado
              equipo={equipo}
              horaFinActualTexto={horaFinActualTexto}
              onConfirmarPago={confirmarPago}
              onCancelar={() => setPanelActivo(null)}
            />
          )}

          {panelActivo === 'nuevoUsuario' && equipo.estado === 'DISPONIBLE' && (
            <FormNuevaSesion
              fechaActualSistema={fechaActualSistema}
              horaActualSistema={horaActualSistema}
              reserva={equipo.reserva}
              reservaEsHoy={reservaEsHoy}
              onIniciarSesion={iniciarSesionOtroUsuario}
            />
          )}

          {panelActivo === 'falla' && equipo.estado !== 'FUERA_DE_SERVICIO' && (
            <FormReporteFalla onGuardarFalla={guardarFalla} />
          )}
        </div>
      </article>
    </main>
  );
}

export default Detalles;