import mongoose from 'mongoose';
import Historial from '../models/Historial.js';

const ENTIDADES = ['Usuario', 'Cliente', 'Sala', 'Computador', 'Tarifa', 'Reserva', 'Sesion', 'Incidencia'];
const LIMITE_POR_DEFECTO = 50;
const LIMITE_MAXIMO = 100;

function parsearFecha(valor) {
if (typeof valor !== 'string' || !valor.trim()) return null;
const fecha = new Date(valor);
return Number.isNaN(fecha.getTime()) ? null : fecha;
}

// historial  (solo administrador)
// Filtros opcionales: entidad, accion, usuario, entidadId, desde, hasta
export async function listarHistorial(req, res) {
try {
    const { entidad, accion, usuario, entidadId, desde, hasta } = req.query;
    const filtro = {};

    if (entidad) {
    if (!ENTIDADES.includes(entidad)) {
        return res.status(400).json({ mensaje: `Entidad inválida. Usa: ${ENTIDADES.join(', ')}` });
    }
    filtro.entidad = entidad;
    }
    if (typeof accion === 'string' && accion.trim()) {
    filtro.accion = accion.trim();
    }
    if (usuario) {
    if (!mongoose.isValidObjectId(usuario)) {
        return res.status(400).json({ mensaje: 'El identificador del usuario no es válido' });
    }
    filtro.usuario = usuario;
    }
    if (entidadId) {
    if (!mongoose.isValidObjectId(entidadId)) {
        return res.status(400).json({ mensaje: 'El identificador de la entidad no es válido' });
    }
    filtro.entidadId = entidadId;
    }
    if (desde || hasta) {
    filtro.fecha = {};
    if (desde) {
        const fechaDesde = parsearFecha(desde);
        if (!fechaDesde) return res.status(400).json({ mensaje: 'La fecha "desde" no es válida' });
        filtro.fecha.$gte = fechaDesde;
    }
    if (hasta) {
        const fechaHasta = parsearFecha(hasta);
        if (!fechaHasta) return res.status(400).json({ mensaje: 'La fecha "hasta" no es válida' });
        filtro.fecha.$lt = fechaHasta;
    }
    }

    const pagina = Math.max(1, Number.parseInt(req.query.pagina, 10) || 1);
    const limite = Math.min(LIMITE_MAXIMO, Math.max(1, Number.parseInt(req.query.limite, 10) || LIMITE_POR_DEFECTO));

    const [total, historial] = await Promise.all([
    Historial.countDocuments(filtro),
    Historial.find(filtro)
        .populate('usuario', 'nombre email rol')
        .sort({ fecha: -1 })
        .skip((pagina - 1) * limite)
        .limit(limite),
    ]);

    res.json({ historial, pagina, limite, total, totalPaginas: Math.ceil(total / limite) });
} catch (error) {
    console.error('Error al listar historial:', error.message);
    res.status(500).json({ mensaje: 'No se pudo obtener el historial' });
}
}