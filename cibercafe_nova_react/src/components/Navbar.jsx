import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar({ usuario, setUsuario }) {
  // Estado para abrir o cerrar el popup de Login
  const [mostrarLogin, setMostrarLogin] = useState(false);

  // Estados para capturar los datos del formulario
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('operador');
  const [terms, setTerms] = useState(false);

  // Función que se ejecuta al presionar "Ingresar"
  const manejarIngreso = (e) => {
    e.preventDefault();
    setUsuario({ user, email, rol });
    setMostrarLogin(false);
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setUsuario(null);
    setUser('');
    setEmail('');
    setPassword('');
    setTerms(false);
  };

  return (
    <section>
      <header className="barra">
        <nav className="navbar navbar-expand-md container py-2">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img src="/images/logo.png" alt="logo" className="logo" />
          </Link>

          {/* Botón de menú cuando se ve en celular */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuNova"
            aria-controls="menuNova"
            aria-expanded="false"
            aria-label="Alternar navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Vínculos de tu Hito 1 */}
          <div className="collapse navbar-collapse" id="menuNova">
            <div className="navbar-nav mx-auto encab text-center my-2 my-md-0">
              <NavLink className="nav-link" to="/panel" title="Operativos">
                Operativos
              </NavLink>
              <NavLink className="nav-link" to="/salas" title="Salas">
                Salas
              </NavLink>
            </div>

            {/* Botón Login o Usuario conectado */}
            <div className="d-flex justify-content-center align-items-center">
              {usuario ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary text-uppercase">
                    {usuario.rol}
                  </span>
                  <span className="fw-bold">{usuario.user}</span>
                  <button
                    className="btn btn-sm btn-danger fw-bold ms-2"
                    onClick={cerrarSesion}
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  className="log btn"
                  onClick={() => setMostrarLogin(true)}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Popup de Login (Se muestra cuando mostrarLogin es true) */}
      {mostrarLogin && (
        <div className="login_backdrop">
          <div className="login_1 shadow-lg">
            <form onSubmit={manejarIngreso}>
              <h4>Iniciar Sesión</h4>

              <div className="input-wrapper">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrapper">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Selector de Rol (Agregado para cumplir con roles del proyecto) */}
              <div className="mb-3">
                <label className="form-label fw-bold small mb-1">
                  Rol de acceso:
                </label>
                <select
                  className="form-select form-select-sm"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="cliente">Cliente</option>
                  <option value="operador">Operador de turno</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              <div className="terminos">
                <label htmlFor="terms">¿Acepta los términos?</label>
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                />
              </div>

              {/* Botón ingresar */}
              <div className="button">
                <button type="submit">Ingresar</button>
              </div>
            </form>

            {/* Botón cerrar pop up */}
            <button
              type="button"
              className="w-100 mt-2"
              onClick={() => setMostrarLogin(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Navbar;