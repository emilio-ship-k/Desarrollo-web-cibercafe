import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImg from '../images/logo.png';

function Navbar({ usuario, setUsuario }) {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  const [terms, setTerms] = useState(false);

  const manejarIngreso = (e) => {
    e.preventDefault();
    setUsuario({ user: user || email.split('@')[0], email, rol });
    setMostrarLogin(false);
  };

  const manejarRegistro = (e) => {
    e.preventDefault();
    console.log("Guardando en BD:", { user, email, password, rol }); 
    
    setMostrarRegistro(false);
    alert('¡Registro exitoso! Por favor, inicia sesión.');
    
    
    setPassword('');
    setMostrarLogin(true);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setUser('');
    setEmail('');
    setPassword('');
    setRol('cliente');
    setTerms(false);
  };

  return (
    <section>
      <header className="barra">
        <nav className="navbar navbar-expand-md container py-2">
          <Link className="navbar-brand" to="/">
            <img src={logoImg} alt="logo" className="logo" />
          </Link>

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

          <div className="collapse navbar-collapse" id="menuNova">
            <div className="navbar-nav mx-auto encab text-center my-2 my-md-0">
              <NavLink className="nav-link" to="/" title="inicio">Inicio</NavLink>
              <NavLink className="nav-link" to="/panel" title="Operativos">Operativos</NavLink>
              <NavLink className="nav-link" to="/salas" title="Salas">Salas</NavLink>
              <NavLink className="nav-link" to="/sesiones" title="Sesiones">Sesiones</NavLink>
              <NavLink className="nav-link" to="/reservas" title="Reservas">Reservas</NavLink>
              <NavLink className="nav-link" to="/incidencias" title="Incidencias">Incidencias</NavLink>
            </div>

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
                <div className="d-flex gap-2">
                  <button
                    className="log btn"
                    onClick={() => { setMostrarLogin(true); setMostrarRegistro(false); }}
                  >
                    Login
                  </button>
                  <button
                    className="log btn"
                    style={{ backgroundColor: '#28a745' }}
                    onClick={() => { setMostrarRegistro(true); setMostrarLogin(false); }}
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Popup de Login */}
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

              <div className="button">
                <button type="submit">Ingresar</button>
              </div>
            </form>

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

      {/* Popup de Registro */}
      {mostrarRegistro && (
        <div className="login_backdrop">
          <div className="login_1 shadow-lg">
            <form onSubmit={manejarRegistro}>
              <h4>Registrarse</h4>

              <div className="input-wrapper">
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrapper">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrapper">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small mb-1">
                  Rol de la cuenta:
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
                <label htmlFor="termsRegistro">Acepto los términos y condiciones</label>
                <input
                  type="checkbox"
                  id="termsRegistro"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                />
              </div>

              <div className="button">
                <button type="submit">Crear cuenta</button>
              </div>
            </form>

            <button
              type="button"
              className="w-100 mt-2"
              onClick={() => setMostrarRegistro(false)}
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