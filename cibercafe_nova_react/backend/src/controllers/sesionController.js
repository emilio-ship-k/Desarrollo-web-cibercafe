import mongoose from 'mongoose';
import Sesion from '../models/Sesion.js';
import Computador from '../models/Computador.js';
import Cliente from '../models/Cliente.js';
import Reserva from '../models/Reserva.js';
import Tarifa from '../models/Tarifa.js';
import Incidencia from '../models/Incidencia.js';
import { buscarReservaEnConflicto } from '../utils/disponibilidad.js';
import { registrarHistorial } from '../utils/historial.js';

const ESTADOS_SESION = ['activa', 'finalizada'];
const MOTIVO_EN_USO = 'Sesión en curso';
const MOTIVO_OPERATIVO = 'Equipo libre y operativo';
const ZONA_HORARIA = 'America/Santiago';

// Fecha legible para los mensajes (hora de Chile)
function formatear(fecha) {
return fecha.toLocaleString('es-CL', { timeZone: ZONA_HORARIA, dateStyle: 'short', timeStyle: 'short' });
}

function minutosValidos(minutos) {
return Number.isInteger(minutos) && minutos > 0;
}

function parsearFecha(valor) {
if (typeof valor !== 'string' || !valor.trim()) return null;
const fecha = new Date(valor);
return Number.isNaN(fecha.getTime()) ? null : fecha;
}

// minutos es el tiempo previsto de uso
export async function iniciarSesion(req, res) {
try {
    const { computador: computadorId, cliente: clienteId, minutos } = req.body;

    if (!computadorId || !clienteId || minutos === undefined) {
    return res.status(400).json({ mensaje: 'El computador, el cliente y los minutos previstos son obligatorios' });
    }
    if (!mongoose.isValidObjectId(computadorId) || !mongoose.isValidObjectId(clienteId)) {
    return res.status(400).json({ mensaje: 'El identificador del computador o del cliente no es válido' });
    }
    if (!minutosValidos(minutos)) {
    return res.status(400).json({ mensaje: 'Los minutos previstos deben ser un número entero mayor a 0' });
    }

    const computador = await Computador.findById(computadorId);
    if (!computador) {
    return res.status(404).json({ mensaje: 'Computador no encontrado' });
    }
    if (computador.estado === 'Fuera_de_servicio') {
    return res.status(409).json({
        mensaje: `El computador ${computador.codigo} está fuera de servicio y no puede iniciar sesiones`,
    });
    }
    if (computador.estado === 'En_uso') {
    return res.status(409).json({ mensaje: `El computador ${computador.codigo} ya tiene una sesión en curso` });
    }

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    const ahora = new Date();
    const finPrevisto = new Date(ahora.getTime() + minutos * 60000);

    // Si el cliente tiene una reserva propia sobre este PC dentro de ese tramo, la sesión se vincula a ella
    const reservaPropia = await Reserva.findOne({
    computador: computador._id,
    cliente: cliente._id,
    estado: 'confirmada',
    inicio: { $lt: finPrevisto },
    fin: { $gt: ahora },
    }).sort({ inicio: 1 });

    // El tramo previsto no puede chocar con la reserva de otro cliente
    const conflicto = await buscarReservaEnConflicto(computador._id, ahora, finPrevisto, reservaPropia?._id ?? null);
    if (conflicto) {
    return res.status(409).json({
        mensaje: `El computador ${computador.codigo} tiene una reserva de ${formatear(conflicto.inicio)} a ${formatear(conflicto.fin)} que choca con el tiempo previsto. Inicia con menos minutos o elige otro computador`,
    });
    }

    const tarifa = await Tarifa.findOne({ tipoPuesto: computador.tipoPuesto, activa: true });
    if (!tarifa) {
    return res.status(409).json({ mensaje: 'No hay una tarifa vigente para este tipo de puesto' });
    }

    // Se ocupa el PC en un solo paso: si otro operador lo tomó justo antes, no se encuentra y se rechaza
    const ocupado = await Computador.findOneAndUpdate(
    { _id: computador._id, estado: { $nin: ['En_uso', 'Fuera_de_servicio'] } },
    { estado: 'En_uso', motivo: MOTIVO_EN_USO },
    { new: true }
    );
    if (!ocupado) {
    return res.status(409).json({ mensaje: `El computador ${computador.codigo} ya no está disponible` });
    }

    let sesion;
    try {
    sesion = await Sesion.create({
        cliente: cliente._id,
        computador: computador._id,
        operador: req.usuario.id,
        reserva: reservaPropia?._id ?? null,
        inicio: ahora,
        finPrevisto,
        precioPorHora: tarifa.precioPorHora,
    });
    } catch (error) {
    // Si no se pudo crear la sesión, el PC vuelve al estado en que estaba
    await Computador.findByIdAndUpdate(computador._id, {
        estado: computador.estado,
        motivo: computador.motivo,
    });
    throw error;
    }

    await registrarHistorial({
    entidad: 'Sesion',
    entidadId: sesion._id,
    accion: 'iniciar',
    usuario: req.usuario.id,
    detalle: `${computador.codigo}: ${cliente.nombre}, ${minutos} min previstos`,
    });
    await registrarHistorial({
    entidad: 'Computador',
    entidadId: computador._id,
    accion: 'cambiar_estado',
    usuario: req.usuario.id,
    detalle: `${computador.codigo}: ${computador.estado} -> En_uso (sesión iniciada)`,
    });

    res.status(201).json({ sesion });
} catch (error) {
    console.error('Error al iniciar sesión de uso:', error.message);
    res.status(500).json({ mensaje: 'No se pudo iniciar la sesión' });
}
}

export async function extenderSesion(req, res) {
try {
    const { id } = req.params;
    const { minutos } = req.body;

    if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ mensaje: 'El identificador de la sesión no es válido' });
    }
    if (!minutosValidos(minutos)) {
    return res.status(400).json({ mensaje: 'Los minutos a extender deben ser un número entero mayor a 0' });
    }

    const sesion = await Sesion.findById(id).populate('computador', 'codigo');
    if (!sesion) {
    return res.status(404).json({ mensaje: 'Sesión no encontrada' });
    }
    if (sesion.estado !== 'activa') {
    return res.status(409).json({ mensaje: 'Solo se pueden extender sesiones activas' });
    }

    // Si el tiempo previsto ya se pasó, la extensión cuenta desde este momento
    const ahora = new Date();
    const desde = sesion.finPrevisto > ahora ? sesion.finPrevisto : ahora;
    const nuevoFin = new Date(desde.getTime() + minutos * 60000);

    const conflicto = await buscarReservaEnConflicto(sesion.computador._id, desde, nuevoFin, sesion.reserva);
    if (conflicto) {
    return res.status(409).json({
        mensaje: `No se puede extender: el computador ${sesion.computador.codigo} tiene una reserva de ${formatear(conflicto.inicio)} a ${formatear(conflicto.fin)}`,
    });
    }

    sesion.finPrevisto = nuevoFin;
    await sesion.save();

    await registrarHistorial({
    entidad: 'Sesion',
    entidadId: sesion._id,
    accion: 'extender',
    usuario: req.usuario.id,
    detalle: `${sesion.computador.codigo}: +${minutos} min, previsto hasta ${formatear(nuevoFin)}`,
    });

    res.json({ sesion });
} catch (error) {
    console.error('Error al extender sesión:', error.message);
    res.status(500).json({ mensaje: 'No se pudo extender la sesión' });
}
}

// Calcula duración y monto, y deja el PC disponible (o fuera de servicio si hay una falla abierta).
export async function finalizarSesion(req, res) {
try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ mensaje: 'El identificador de la sesión no es válido' });
    }

    const sesion = await Sesion.findById(id);
    if (!sesion) {
    return res.status(404).json({ mensaje: 'Sesión no encontrada' });
    }
    if (sesion.estado !== 'activa') {
    return res.status(409).json({ mensaje: 'Esta sesión ya fue finalizada' });
    }

    const fin = new Date();
    const duracionMin = Math.max(1, Math.ceil((fin - sesion.inicio) / 60000));
    // Monto: precio por hora aplicado al iniciar, proporcional a los minutos, en pesos enteros
    const monto = Math.round((sesion.precioPorHora * duracionMin) / 60);

    sesion.fin = fin;
    sesion.duracionMin = duracionMin;
    sesion.monto = monto;
    sesion.estado = 'finalizada';
    await sesion.save();

    // La reserva que originó la sesión queda completada
    if (sesion.reserva) {
    await Reserva.findByIdAndUpdate(sesion.reserva, { estado: 'completada' });
    }

    const computador = await Computador.findById(sesion.computador);
    if (computador) {
    // Vuelve a Disponible, salvo que tenga una incidencia abierta
    const incidenciaAbierta = await Incidencia.findOne({ computador: computador._id, estado: 'abierta' }).sort({
        createdAt: -1,
    });

    const estadoNuevo = incidenciaAbierta ? 'Fuera_de_servicio' : 'Disponible';
    computador.estado = estadoNuevo;
    computador.motivo = incidenciaAbierta ? incidenciaAbierta.descripcion : MOTIVO_OPERATIVO;
    await computador.save();

    await registrarHistorial({
        entidad: 'Computador',
        entidadId: computador._id,
        accion: 'cambiar_estado',
        usuario: req.usuario.id,
        detalle: `${computador.codigo}: En_uso -> ${estadoNuevo} (sesión finalizada)`,
    });
    }

    await registrarHistorial({
    entidad: 'Sesion',
    entidadId: sesion._id,
    accion: 'finalizar',
    usuario: req.usuario.id,
    detalle: `${computador?.codigo ?? ''}: ${duracionMin} min, $${monto}`,
    });

    res.json({ sesion, estadoComputador: computador?.estado ?? null });
} catch (error) {
    console.error('Error al finalizar sesión:', error.message);
    res.status(500).json({ mensaje: 'No se pudo finalizar la sesión' });
}
}

// El cliente ve solo las suyas; operador y administrador ven todas.
export async function listarSesiones(req, res) {
try {
    const { estado, computador, cliente, desde, hasta } = req.query;
    const filtro = {};

    if (req.usuario.rol === 'cliente') {
    const propio = await Cliente.findOne({ usuario: req.usuario.id });
    if (!propio) {
        return res.json({ sesiones: [] });
    }
      filtro.cliente = propio._id; // cualquier ?cliente= enviado se ignora
    } else if (cliente) {
    if (!mongoose.isValidObjectId(cliente)) {
        return res.status(400).json({ mensaje: 'El identificador del cliente no es válido' });
    }
    filtro.cliente = cliente;
    }

    if (estado) {
    if (!ESTADOS_SESION.includes(estado)) {
        return res.status(400).json({ mensaje: `Estado inválido. Usa: ${ESTADOS_SESION.join(', ')}` });
    }
    filtro.estado = estado;
    }
    if (computador) {
    if (!mongoose.isValidObjectId(computador)) {
        return res.status(400).json({ mensaje: 'El identificador del computador no es válido' });
    }
    filtro.computador = computador;
    }

    // Sesiones que comenzaron dentro del rango pedido
    if (desde || hasta) {
    filtro.inicio = {};
    if (desde) {
        const fechaDesde = parsearFecha(desde);
        if (!fechaDesde) return res.status(400).json({ mensaje: 'La fecha "desde" no es válida' });
        filtro.inicio.$gte = fechaDesde;
    }
    if (hasta) {
        const fechaHasta = parsearFecha(hasta);
        if (!fechaHasta) return res.status(400).json({ mensaje: 'La fecha "hasta" no es válida' });
        filtro.inicio.$lt = fechaHasta;
    }
    }

    const sesiones = await Sesion.find(filtro)
    .populate('computador', 'codigo nombre')
    .populate('cliente', 'nombre')
    .populate('operador', 'nombre')
    .sort({ inicio: -1 });

    res.json({ sesiones });
} catch (error) {
    console.error('Error al listar sesiones:', error.message);
    res.status(500).json({ mensaje: 'No se pudieron obtener las sesiones' });
}
}