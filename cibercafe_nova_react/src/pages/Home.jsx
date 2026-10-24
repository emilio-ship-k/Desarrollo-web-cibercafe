import { Link } from 'react-router-dom';

function Home() {
  return (
    <main className="container my-4 flex-grow-1">
      <section className="presentacion mx-auto" style={{ maxWidth: '900px' }}>
        <h1>Bienvenido a Cibercafé Nova</h1>
        <p>
          En Cibercafé Nova, nos enorgullece ofrecer un espacio acogedor y moderno
          para que nuestros clientes disfruten de una experiencia única. Nuestro
          objetivo es brindar un ambiente cómodo y seguro donde puedas conectarte,
          trabajar o simplemente relajarte mientras disfrutas de nuestros servicios.
        </p>
        <p>
          Contamos con una amplia variedad de salas y puestos equipados con
          tecnología de última generación, ideales para reuniones, estudio o
          entretenimiento. Nuestro personal capacitado está siempre disponible para
          ayudarte y asegurarse de que tu visita sea placentera.
        </p>
        <p>
          Además, ofrecemos acceso a internet de alta velocidad, impresoras,
          escáneres y otros servicios que facilitan tu trabajo o estudio. En
          Cibercafé Nova, nos esforzamos por crear un lugar donde la productividad y
          la comodidad se encuentren en perfecta armonía.
        </p>
      </section>

      <section className="detalles">
        <h2>Sistema de Gestión y Operaciones</h2>
        <p>
          Accede a los módulos del local para monitorear turnos, consultar salas o
          revisar el estado operativo.
        </p>
      </section>

      <section className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-4">
          <article className="box h-100">
            <div>
              <h3>Panel Operativo</h3>
              <p>
                Monitorea la disponibilidad general en tiempo real, las sesiones en
                curso, el calendario de próximas reservas y los incidentes abiertos
                del local.
              </p>
            </div>
            <Link to="/panel">Ver panel operativo -&gt;</Link>
          </article>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <article className="box h-100">
            <div>
              <h3>Salas y Puestos</h3>
              <p>
                Visualiza el mapa de distribución de los 30 computadores repartidos
                entre la Zona General, la Zona Gamer y la Sala Grupal.
              </p>
            </div>
            <Link to="/salas">Ver mapa de salas -&gt;</Link>
          </article>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <article className="box h-100">
            <div>
              <h3>Gestión de Sesiones</h3>
              <p>
                Inicia turnos de uso en puestos libres, extiende tiempos de juego
                y realiza el cálculo final con cierre de cobro.
              </p>
            </div>
            <Link to="/sesiones">Gestionar turnos -&gt;</Link>
          </article>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <article className="box h-100">
            <div>
              <h3>Reserva de Puestos</h3>
              <p>
                Agenda computadores por bloque horario, revisa la lista de espera
                y evita solapamientos o conflictos de turnos.
              </p>
            </div>
            <Link to="/reservas">Agendar reserva -&gt;</Link>
          </article>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <article className="box h-100">
            <div>
              <h3>Registro de Incidencias</h3>
              <p>
                Reporta fallas técnicas de hardware o periféricos, bloquea puestos
                averiados y registra su posterior reparación.
              </p>
            </div>
            <Link to="/incidencias">Reportar fallas -&gt;</Link>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;