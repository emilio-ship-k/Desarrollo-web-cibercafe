import Usuario from '../models/Usuario.js';
import Cliente from '../models/Cliente.js';
import { hashearPassword, compararPassword, crearToken } from '../utils/seguridad.js';

const MAX_INTENTOS = 4; 
const BLOQUEO_MINUTOS = 15;
const LARGO_MIN_PASSWORD = 8;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Datos del usuario que sí se pueden enviar al frontend
function datosPublicos(usuario) {
  return { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
}

// Crea una cuenta de CLIENTE
export async function registrar(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios' });
    }
    if (!FORMATO_EMAIL.test(email.trim())) {
      return res.status(400).json({ mensaje: 'El correo no tiene un formato válido' });
    }
    if (password.length < LARGO_MIN_PASSWORD) {
      return res
        .status(400)
        .json({ mensaje: `La contraseña debe tener al menos ${LARGO_MIN_PASSWORD} caracteres` });
    }

    const correo = email.trim().toLowerCase();
    if (await Usuario.findOne({ email: correo })) {
      return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
    }

    // El rol no se toma de lo que envía el front, el registro publico siempre crea clientes
    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      email: correo,
      passwordHash: await hashearPassword(password),
      rol: 'cliente',
    });

    try {
      await Cliente.create({ nombre: usuario.nombre, usuario: usuario._id });
    } catch (error) {
      await Usuario.findByIdAndDelete(usuario._id); // no dejar un usuario sin su cliente
      throw error;
    }

    res.status(201).json({ token: crearToken(usuario), usuario: datosPublicos(usuario) });
  } catch (error) {
    console.error('Error en registro:', error.message);
    res.status(500).json({ mensaje: 'No se pudo crear la cuenta. Intenta nuevamente' });
  }
}

// Inicia sesión y entrega el token
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    // Mismo mensaje si el correo no existe o la contraseña falla, para no revelar qué cuentas existen
    const mensajeCredenciales = 'Correo o contraseña incorrectos';
    const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ mensaje: mensajeCredenciales });
    }

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: 'Esta cuenta está desactivada' });
    }

    // Esta bloqueado por intentos fallidos?
    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
      const minutos = Math.ceil((usuario.bloqueadoHasta - new Date()) / 60000);
      return res.status(423).json({
        mensaje: `Cuenta bloqueada por demasiados intentos. Intenta de nuevo en ${minutos} minuto(s)`,
      });
    }

    const correcta = await compararPassword(password, usuario.passwordHash);

    if (!correcta) {
      usuario.intentosFallidos += 1;
      if (usuario.intentosFallidos >= MAX_INTENTOS) {
        usuario.bloqueadoHasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60000);
        usuario.intentosFallidos = 0;
      }
      await usuario.save();
      return res.status(401).json({ mensaje: mensajeCredenciales });
    }

    // Login correcto: se limpia el control de intentos
    usuario.intentosFallidos = 0;
    usuario.bloqueadoHasta = null;
    await usuario.save();

    res.json({ token: crearToken(usuario), usuario: datosPublicos(usuario) });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ mensaje: 'No se pudo iniciar sesión. Intenta nuevamente' });
  }
}

// Datos de quien tiene la sesión iniciada
export async function perfil(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ usuario: datosPublicos(usuario) });
  } catch (error) {
    console.error('Error en perfil:', error.message);
    res.status(500).json({ mensaje: 'No se pudo obtener el perfil' });
  }
}