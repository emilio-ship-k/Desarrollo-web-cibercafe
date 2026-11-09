import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js';
import Cliente from '../models/Cliente.js';
import { hashearPassword } from '../utils/seguridad.js';
import { registrarHistorial } from '../utils/historial.js';

const ROLES = ['cliente', 'operador', 'administrador'];
const LARGO_MIN_PASSWORD = 8;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Datos de una cuenta que sí se pueden enviar al frontend (nunca el hash de la contraseña)
function datosUsuario(usuario) {
return {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    activo: usuario.activo,
    bloqueadoHasta: usuario.bloqueadoHasta,
};
}

// Busca el usuario de la dirección /:id; si no sirve, responde el error y devuelve null
async function buscarUsuarioDeLaRuta(req, res) {
const { id } = req.params;
if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ mensaje: 'El identificador del usuario no es válido' });
    return null;
}
const usuario = await Usuario.findById(id);
if (!usuario) {
    res.status(404).json({ mensaje: 'Usuario no encontrado' });
    return null;
}
return usuario;
}

// Garantiza que una cuenta con rol cliente tenga su perfil en la colección "clientes"
async function asegurarPerfilCliente(usuario) {
const existente = await Cliente.findOne({ usuario: usuario._id });
if (!existente) {
    await Cliente.create({ nombre: usuario.nombre, usuario: usuario._id });
}
}

export async function listarUsuarios(req, res) {
try {
    const { rol, activo, buscar } = req.query;
    const filtro = {};

    if (rol) {
    if (!ROLES.includes(rol)) {
        return res.status(400).json({ mensaje: `Rol inválido. Usa: ${ROLES.join(', ')}` });
    }
    filtro.rol = rol;
    }
    if (activo !== undefined) {
    if (activo !== 'true' && activo !== 'false') {
        return res.status(400).json({ mensaje: 'El filtro "activo" debe ser true o false' });
    }
    filtro.activo = activo === 'true';
    }
    if (typeof buscar === 'string' && buscar.trim()) {
    const texto = buscar.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filtro.$or = [
        { nombre: { $regex: texto, $options: 'i' } },
        { email: { $regex: texto, $options: 'i' } },
    ];
    }

    const usuarios = await Usuario.find(filtro).sort({ nombre: 1 }).limit(300);
    res.json({ usuarios: usuarios.map(datosUsuario) });
} catch (error) {
    console.error('Error al listar usuarios:', error.message);
    res.status(500).json({ mensaje: 'No se pudieron obtener los usuarios' });
}
}

// La contraseña inicial la define el administrador
export async function crearUsuario(req, res) {
try {
    const nombre = req.body.nombre?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ mensaje: 'Nombre, correo, contraseña y rol son obligatorios' });
    }
    if (!ROLES.includes(rol)) {
    return res.status(400).json({ mensaje: `Rol inválido. Usa: ${ROLES.join(', ')}` });
    }
    if (!FORMATO_EMAIL.test(email)) {
    return res.status(400).json({ mensaje: 'El correo no tiene un formato válido' });
    }
    if (typeof password !== 'string' || password.length < LARGO_MIN_PASSWORD) {
    return res
        .status(400)
        .json({ mensaje: `La contraseña debe tener al menos ${LARGO_MIN_PASSWORD} caracteres` });
    }
    if (await Usuario.findOne({ email })) {
    return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
    }

    const usuario = await Usuario.create({
    nombre,
    email,
    passwordHash: await hashearPassword(password),
    rol,
    });

    if (rol === 'cliente') {
    try {
        await asegurarPerfilCliente(usuario);
    } catch (error) {
        await Usuario.findByIdAndDelete(usuario._id); // no dejar una cuenta cliente sin su perfil
        throw error;
    }
    }

    await registrarHistorial({
    entidad: 'Usuario',
    entidadId: usuario._id,
    accion: 'crear',
    usuario: req.usuario.id,
    detalle: `${email} (${rol})`,
    });

    res.status(201).json({ usuario: datosUsuario(usuario) });
} catch (error) {
    if (error.code === 11000) {
    return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
    }
    console.error('Error al crear usuario:', error.message);
    res.status(500).json({ mensaje: 'No se pudo crear el usuario' });
}
}

// Un administrador no puede cambiar su propio rol
export async function cambiarRol(req, res) {
try {
    const usuario = await buscarUsuarioDeLaRuta(req, res);
    if (!usuario) return;

    const { rol } = req.body;
    if (!ROLES.includes(rol)) {
    return res.status(400).json({ mensaje: `Rol inválido. Usa: ${ROLES.join(', ')}` });
    }
    if (usuario._id.toString() === req.usuario.id) {
    return res.status(403).json({ mensaje: 'No puedes cambiar tu propio rol' });
    }
    if (usuario.rol === rol) {
    return res.status(400).json({ mensaje: `El usuario ya tiene el rol ${rol}` });
    }

    const rolAnterior = usuario.rol;
    usuario.rol = rol;
    await usuario.save();

    if (rol === 'cliente') {
    await asegurarPerfilCliente(usuario);
    }

    await registrarHistorial({
    entidad: 'Usuario',
    entidadId: usuario._id,
    accion: 'cambiar_rol',
    usuario: req.usuario.id,
    detalle: `${usuario.email}: ${rolAnterior} -> ${rol}`,
    });

    res.json({ usuario: datosUsuario(usuario) });
} catch (error) {
    console.error('Error al cambiar rol:', error.message);
    res.status(500).json({ mensaje: 'No se pudo cambiar el rol' });
}
}

// Un administrador no puede desactivar su propia cuenta
export async function cambiarEstado(req, res) {
try {
    const usuario = await buscarUsuarioDeLaRuta(req, res);
    if (!usuario) return;

    const { activo } = req.body;
    if (typeof activo !== 'boolean') {
    return res.status(400).json({ mensaje: 'El campo "activo" debe ser true o false' });
    }
    if (usuario._id.toString() === req.usuario.id) {
    return res.status(403).json({ mensaje: 'No puedes cambiar el estado de tu propia cuenta' });
    }
    if (usuario.activo === activo) {
    return res.status(400).json({ mensaje: `La cuenta ya está ${activo ? 'activa' : 'desactivada'}` });
    }

    usuario.activo = activo;
    if (activo) {
    // Al reactivar una cuenta se limpia cualquier bloqueo por intentos fallidos
    usuario.intentosFallidos = 0;
    usuario.bloqueadoHasta = null;
    }
    await usuario.save();

    await registrarHistorial({
    entidad: 'Usuario',
    entidadId: usuario._id,
    accion: activo ? 'activar' : 'desactivar',
    usuario: req.usuario.id,
    detalle: usuario.email,
    });

    res.json({ usuario: datosUsuario(usuario) });
} catch (error) {
    console.error('Error al cambiar estado del usuario:', error.message);
    res.status(500).json({ mensaje: 'No se pudo cambiar el estado de la cuenta' });
}
}

// Restablece la contraseña y desbloquea la cuenta
export async function restablecerPassword(req, res) {
try {
    const usuario = await buscarUsuarioDeLaRuta(req, res);
    if (!usuario) return;

    const { password } = req.body;
    if (typeof password !== 'string' || password.length < LARGO_MIN_PASSWORD) {
    return res
        .status(400)
        .json({ mensaje: `La contraseña debe tener al menos ${LARGO_MIN_PASSWORD} caracteres` });
    }

    usuario.passwordHash = await hashearPassword(password);
    usuario.intentosFallidos = 0;
    usuario.bloqueadoHasta = null;
    await usuario.save();

    // En el historial NUNCA se escribe la contraseña
    await registrarHistorial({
    entidad: 'Usuario',
    entidadId: usuario._id,
    accion: 'restablecer_password',
    usuario: req.usuario.id,
    detalle: usuario.email,
    });

    res.json({ mensaje: 'Contraseña actualizada', usuario: datosUsuario(usuario) });
} catch (error) {
    console.error('Error al restablecer contraseña:', error.message);
    res.status(500).json({ mensaje: 'No se pudo restablecer la contraseña' });
}
}