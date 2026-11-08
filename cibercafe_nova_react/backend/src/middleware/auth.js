import Usuario from '../models/Usuario.js';
import { verificarToken } from '../utils/seguridad.js';

// Comprueba que la petición venga con un token válido, ll front lo envía en el encabezado
export async function autenticar(req, res, next) {
  try {
    const encabezado = req.headers.authorization || '';
    const [tipo, token] = encabezado.split(' ');

    if (tipo !== 'Bearer' || !token) {
      return res.status(401).json({ mensaje: 'Debes iniciar sesión para continuar' });
    }
    // lanza error si es falso o venció
    const datos = verificarToken(token); 

    // Se consulta la base para usar el rol y estado actuales del usuario
    const usuario = await Usuario.findById(datos.id).select('rol activo');
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'La cuenta no existe o está desactivada' });
    }

    req.usuario = { id: usuario._id.toString(), rol: usuario.rol };
    next();
  } catch {
    return res.status(401).json({ mensaje: 'Sesión inválida o vencida. Inicia sesión nuevamente' });
  }
}

// Permite el paso solo a los roles indicados, requiereRol('operador', 'administrador')
export function requiereRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
}