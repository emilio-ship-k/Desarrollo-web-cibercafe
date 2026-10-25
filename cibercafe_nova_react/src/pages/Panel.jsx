import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Panel.css';

function Panel({ setPcActualId }) {
  // Contadores de disponibilidad
  const [resumen] = useState({
    disponibles: 23,
    enUso: 3,
    reservas: 2,
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

  
  const seleccionarEquipo = (id) => {
    if (setPcActualId) {
      setPcActualId(id);
    }
  };

  return (
    <main className="panel-main container-fluid px-2 px-md-3">
      <h3 className="subtitulo-panel mt-3 mb-4 fw-bold fs-4">Disponibilidad general</h3>

    
      <section id="flexbox_resumen" className="d-flex flex-wrap gap-3 mb-4">
        <Link to="/salas" className="link-resum flex-fill text-decoration-none" title="Ir a Salas y Puestos">
          <article className="resum card shadow-sm text-center p-3 h-100">
            <h4 className="fs-6 text-muted mb-2">Disponible</h4>
            <p className="verde fs-3 fw-bold mb-0 text-success">{resumen.disponibles}</p>
          </article>
        </Link>

        <Link to="/sesiones" className="link-resum flex-fill text-decoration-none" title="Ir a Gestión de Sesiones">
          <article className="resum card shadow-sm text-center p-3 h-100">
            <h4 className="fs-6 text-muted mb-2">Sesiones de uso</h4>
            <p className="rojo fs-3 fw-bold mb-0 text-danger">{resumen.enUso}</p>
          </article>
        </Link>

        <Link to="/reservas" className="link-resum flex-fill text-decoration-none" title="Ir a Reserva de Puestos">
          <article className="resum card shadow-sm text-center p-3 h-100">
            <h4 className="fs-6 text-muted mb-2">Reserva Próxima</h4>
            <p className="tomate fs-3 fw-bold mb-0 text-warning">{resumen.reservas}</p>
          </article>
        </Link>

        <Link to="/incidencias" className="link-resum flex-fill text-decoration-none" title="Ir a Registro de Incidencias">
          <article className="resum card shadow-sm text-center p-3 h-100">
            <h4 className="fs-6 text-muted mb-2">Fuera de servicio</h4>
            <p className="gris fs-3 fw-bold mb-0 text-secondary">{resumen.fueraServicio}</p>
          </article>
        </Link>
      </section>

      <div className="centro row g-4">
        <div className="col-12 col-lg-8">
         
          <section className="panel card shadow-sm p-3 mb-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h3 className="border-0 mb-0 p-0 fs-5 fw-bold">Disponibilidad general (En curso)</h3>
              <Link to="/sesiones" className="btn btn-sm btn-outline-secondary">Ver sesiones -&gt;</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
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
                          className="link-puesto text-decoration-none fw-bold"
                          onClick={() => seleccionarEquipo(sesion.id)}
                        >
                          {sesion.puesto}
                        </Link> <span className="text-muted small">({sesion.zona})</span>
                      </td>
                      <td>{sesion.cliente}</td>
                      <td>{sesion.inicio}</td>
                      <td>{sesion.tiempo}</td>
                      <td>
                        <span className="badge bg-success">{sesion.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

     
          <section className="panel card shadow-sm p-3 border-0">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h3 className="border-0 mb-0 p-0 fs-5 fw-bold">Próximas Reservas de la Jornada</h3>
              <Link to="/reservas" className="btn btn-sm btn-outline-secondary">Ver reservas -&gt;</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
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
                      <td><strong>{reserva.puesto}</strong> <span className="text-muted small">({reserva.zona})</span></td>
                      <td>{reserva.cliente}</td>
                      <td>
                        <span className="badge bg-primary">{reserva.modalidad}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

       
        <div className="col-12 col-lg-4">
          <section className="panel card shadow-sm p-3 border-0 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h3 className="border-0 mb-0 p-0 fs-5 fw-bold">Incidencias Abiertas</h3>
              <Link to="/incidencias" className="btn btn-sm btn-outline-secondary">Reportar -&gt;</Link>
            </div>
            <ul className="list-group list-group-flush">
              {incidencias.map((inc, index) => (
                <li key={index} className="list-group-item px-0 py-3">
                  <strong className="d-block mb-1 text-danger">{inc.equipo}</strong>
                  <p className="mb-0 text-muted small">{inc.detalle}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Panel;