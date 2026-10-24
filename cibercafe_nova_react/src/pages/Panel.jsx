import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Panel.css';

function Panel({ setPcActualId }) {
  // Contadores de disponibilidad
  const [resumen] = useState({
    disponibles: 11,
    enUso: 10,
    reservas: 7,
    fueraServicio: 2
  });

  // Lista de sesiones activas en el local
  const [sesionesActivas] = useState([
    { id: 'PC-02', puesto: 'Pc 02', zona: 'general', cliente: 'Sebastián Quezada', inicio: '16:15', tiempo: '45 min', estado: 'En uso' },
    { id: 'PC-16', puesto: 'Pc 16', zona: 'Gamer', cliente: 'Diego Ibarra', inicio: '15:30', tiempo: '1 h 30 min', estado: 'En uso' },
    { id: 'PC-23', puesto: 'Pc 23', zona: 'Grupal', cliente: 'Jonathan Nuñez', inicio: '15:30', tiempo: '1 h 30 min', estado: 'En uso' }
  ]);

  // Lista de proximas reservas
  const [proximasReservas] = useState([
    { horario: '18:00 - 20:00', puesto: 'Pc 08', zona: 'General', cliente: 'Sebastián Quezada', modalidad: 'Individual' },
    { horario: '19:00 - 21:00', puesto: 'Pc 19', zona: 'Gamer', cliente: 'Jonathan Nuñez', modalidad: 'Grupo' }
  ]);

  // Lista de fallas registradas
  const [incidencias] = useState([
    { equipo: 'Pc 05 - Zona general', detalle: 'Falla en tarjeta gráfica. Equipo bloqueado temporalmente.' },
    { equipo: 'Pc 22 - Zona Gamer', detalle: 'Teclado mecánico con tecla espaciadora bloqueada. Requiere cambio de repuesto.' }
  ]);

  // Al hacer clic en un puesto de la tabla guardamos su id para la vista de detalles
  const seleccionarEquipo = (id) => {
    if (setPcActualId) {
      setPcActualId(id);
    }
  };

  return (
    <main className="panel-main">
      <h3 className="subtitulo-panel">Disponibilidad general</h3>

      {/* Tarjetas superiores con enlaces directos a cada seccion */}
      <section id="flexbox_resumen">
        <Link to="/salas" className="link-resum" title="Ir a Salas y Puestos">
          <article className="resum">
            <h4>Disponible</h4>
            <p className="verde">{resumen.disponibles}</p>
          </article>
        </Link>

        <Link to="/sesiones" className="link-resum" title="Ir a Gestión de Sesiones">
          <article className="resum">
            <h4>Sesiones de uso</h4>
            <p className="rojo">{resumen.enUso}</p>
          </article>
        </Link>

        <Link to="/reservas" className="link-resum" title="Ir a Reserva de Puestos">
          <article className="resum">
            <h4>Reserva Próxima</h4>
            <p className="tomate">{resumen.reservas}</p>
          </article>
        </Link>

        <Link to="/incidencias" className="link-resum" title="Ir a Registro de Incidencias">
          <article className="resum">
            <h4>Fuera de servicio</h4>
            <p className="gris">{resumen.fueraServicio}</p>
          </article>
        </Link>
      </section>

      <div className="centro">
        <div>
          {/* Bloque de sesiones activas */}
          <section className="panel">
            <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
              <h3 className="border-0 mb-0 p-0">Disponibilidad general (En curso)</h3>
              <Link to="/sesiones" className="btn btn-sm btn-outline-secondary py-0">Ver sesiones -&gt;</Link>
            </div>
            <div className="tabla-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Puesto</th>
                    <th>Cliente</th>
                    <th>Inicio</th>
                    <th>Tiempo Usado</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {sesionesActivas.map((sesion, index) => (
                    <tr key={index}>
                      <td>
                        <Link
                          to="/detalles"
                          className="link-puesto"
                          onClick={() => seleccionarEquipo(sesion.id)}
                        >
                          <strong>{sesion.puesto}</strong>
                        </Link> ({sesion.zona})
                      </td>
                      <td>{sesion.cliente}</td>
                      <td>{sesion.inicio}</td>
                      <td>{sesion.tiempo}</td>
                      <td>
                        <span className="badge-nova activa">{sesion.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bloque de reservas del dia */}
          <section className="panel">
            <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
              <h3 className="border-0 mb-0 p-0">Próximas Reservas de la Jornada</h3>
              <Link to="/reservas" className="btn btn-sm btn-outline-secondary py-0">Ver reservas -&gt;</Link>
            </div>
            <div className="tabla-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Horario</th>
                    <th>Puesto Asignado</th>
                    <th>Cliente</th>
                    <th>Modalidad</th>
                  </tr>
                </thead>
                <tbody>
                  {proximasReservas.map((reserva, index) => (
                    <tr key={index}>
                      <td>{reserva.horario}</td>
                      <td><strong>{reserva.puesto}</strong> ({reserva.zona})</td>
                      <td>{reserva.cliente}</td>
                      <td>
                        <span className="badge-nova modalidad">{reserva.modalidad}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Bloque lateral de fallas reportadas */}
        <section className="panel">
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            <h3 className="border-0 mb-0 p-0">Incidencias Abiertas</h3>
            <Link to="/incidencias" className="btn btn-sm btn-outline-secondary py-0">Reportar -&gt;</Link>
          </div>
          <ul className="list_incid">
            {incidencias.map((inc, index) => (
              <li key={index} className="item_incid">
                <strong>{inc.equipo}</strong>
                <p>{inc.detalle}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default Panel;