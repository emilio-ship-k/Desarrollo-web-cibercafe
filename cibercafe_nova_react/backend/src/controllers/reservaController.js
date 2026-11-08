import mongoose from 'mongoose';
import Reserva from '../models/Reserva.js';
import Cliente from '../models/Cliente.js';
import Computador, { TIPOS_PUESTO } from '../models/Computador.js';
import { buscarReservaEnConflicto } from '../utils/disponibilidad.js';
import { registrarHistorial } from '../utils/historial.js';

const ESTADOS_RESERVA = ['confirmada', 'cancelada', 'completada'];
const TOLERANCIA_MIN = 5; // minutos de margen para reservas que empiezan "ahora"
const ZONA_HORARIA = 'America/Santiago';

// Convierte un texto en fecha; devuelve null si no es válido
function parsearFecha(valor) {
    if (typeof valor !== 'string' || !valor.trim()) return null;
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
}

// Fecha legible para los mensajes
function formatear(fecha) {
    return fecha.toLocaleString('es-CL', { timeZone: ZONA_HORARIA, dateStyle: 'short', timeStyle: 'short' });
}

// Busca el perfil de cliente que corresponde a un usuario
function obtenerClienteDeUsuario(usuarioId) {
    return Cliente.findOne({ usuario: usuarioId });
}

// Lista los PCs que se pueden reservar en ese horario.
export async function consultarDisponibilidad(req, res) {
    try {
        const inicio = parsearFecha(req.query.inicio);
        const fin = parsearFecha(req.query.fin);
        const { sala, tipoPuesto } = req.query;

    if (!inicio || !fin) {
        return res.status(400).json({ mensaje: 'Debes indicar inicio y fin con una fecha y hora válidas' });
    }
    if (fin <= inicio) {
        return res.status(400).json({ mensaje: 'El fin debe ser posterior al inicio' });
    }

    // Los PCs fuera de servicio no se pueden reservar, así que se excluyen desde el principio
    const filtro = { estado: { $ne: 'Fuera_de_servicio' } };
    if (sala) {
        if (!mongoose.isValidObjectId(sala)) {
            return res.status(400).json({ mensaje: 'El identificador de la sala no es válido' });
        }
        filtro.sala = sala;
        }
    if (tipoPuesto) {
        if (!TIPOS_PUESTO.includes(tipoPuesto)) {
            return res.status(400).json({ mensaje: `Tipo de puesto inválido. Usa: ${TIPOS_PUESTO.join(', ')}` });
            }
        filtro.tipoPuesto = tipoPuesto;
        }

        const candidatos = await Computador.find(filtro).select('_id');

    // PCs que ya tienen una reserva confirmada que se cruza con ese horario
    const ocupados = await Reserva.find({
        computador: { $in: candidatos.map((c) => c._id) },
        estado: 'confirmada',
        inicio: { $lt: fin },
        fin: { $gt: inicio },
        }).distinct('computador');
    const idsOcupados = new Set(ocupados.map((id) => id.toString()));

    const libres = candidatos.filter((c) => !idsOcupados.has(c._id.toString())).map((c) => c._id);
    const computadores = await Computador.find({ _id: { $in: libres } })
        .populate('sala', 'nombre')
        .sort({ codigo: 1 });

    res.json({ computadores });
    } catch (error) {
        console.error('Error al consultar disponibilidad:', error.message);
        res.status(500).json({ mensaje: 'No se pudo consultar la disponibilidad' });
    }
}

// Cliente: reserva para sí mismo. Operador y administrador: indican el cliente
export async function crearReserva(req, res) {
    try {
        const { computador: computadorId } = req.body;
        const inicio = parsearFecha(req.body.inicio);
        const fin = parsearFecha(req.body.fin);

        if (!computadorId || !inicio || !fin) {
            return res.status(400).json({ mensaje: 'El computador, el inicio y el fin son obligatorios' });
        }
        if (!mongoose.isValidObjectId(computadorId)) {
            return res.status(400).json({ mensaje: 'El identificador del computador no es válido' });
        }
        if (fin <= inicio) {
            return res.status(400).json({ mensaje: 'El fin de la reserva debe ser posterior al inicio' });
        }
        if (inicio < new Date(Date.now() - TOLERANCIA_MIN * 60000)) {
            return res.status(400).json({ mensaje: 'No se puede reservar en un horario que ya pasó' });
        }

    // El cliente solo puede reservar para sí mismo; el valor enviado se ignora.
        let clienteId;
        if (req.usuario.rol === 'cliente') {
            const propio = await obtenerClienteDeUsuario(req.usuario.id);
            if (!propio) {
                return res.status(404).json({ mensaje: 'Tu cuenta no tiene un perfil de cliente asociado' });
            }
            clienteId = propio._id;
        } else {
            const { cliente } = req.body;
            if (!cliente || !mongoose.isValidObjectId(cliente)) {
                return res.status(400).json({ mensaje: 'Debes indicar el cliente para quien es la reserva' });
            }
        if (!(await Cliente.exists({ _id: cliente }))) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        clienteId = cliente;
        }

        const computador = await Computador.findById(computadorId);
        if (!computador) {
            return res.status(404).json({ mensaje: 'Computador no encontrado' });
        }
        if (computador.estado === 'Fuera_de_servicio') {
            return res.status(409).json({
        mensaje: `El computador ${computador.codigo} está fuera de servicio y no puede reservarse`,
        });
        }

        const conflicto = await buscarReservaEnConflicto(computador._id, inicio, fin);
        if (conflicto) {
            return res.status(409).json({
        mensaje: `El computador ${computador.codigo} ya tiene una reserva de ${formatear(conflicto.inicio)} a ${formatear(conflicto.fin)}`,
            });
        }

        const reserva = await Reserva.create({
            cliente: clienteId,
            computador: computador._id,
            inicio,
            fin,
            creadaPor: req.usuario.id,
        });

        await registrarHistorial({
            entidad: 'Reserva',
            entidadId: reserva._id,
            accion: 'crear',
            usuario: req.usuario.id,
            detalle: `${computador.codigo}: ${formatear(inicio)} a ${formatear(fin)}`,
        });

        res.status(201).json({ reserva });
        } catch (error) {
            console.error('Error al crear reserva:', error.message);
            res.status(500).json({ mensaje: 'No se pudo crear la reserva' });
        }
        }

// El cliente ve solo las suyas; operador y administrador ven todas.
export async function listarReservas(req, res) {
    try {
        const { estado, computador, cliente, desde, hasta, orden } = req.query;
        const filtro = {};

        if (req.usuario.rol === 'cliente') {
            const propio = await obtenerClienteDeUsuario(req.usuario.id);
        if (!propio) {
            return res.json({ reservas: [] });
        }
        filtro.cliente = propio._id;
        } else if (cliente) {
            if (!mongoose.isValidObjectId(cliente)) {
                return res.status(400).json({ mensaje: 'El identificador del cliente no es válido' });
            }
            filtro.cliente = cliente;
        }

        if (estado) {
            if (!ESTADOS_RESERVA.includes(estado)) {
                return res.status(400).json({ mensaje: `Estado inválido. Usa: ${ESTADOS_RESERVA.join(', ')}` });
            }
            filtro.estado = estado;
        }
        if (computador) {
            if (!mongoose.isValidObjectId(computador)) {
                return res.status(400).json({ mensaje: 'El identificador del computador no es válido' });
            }
            filtro.computador = computador;
        }

        // Reservas que ocurren dentro del rango pedido
        if (desde) {
            const fechaDesde = parsearFecha(desde);
            if (!fechaDesde) return res.status(400).json({ mensaje: 'La fecha "desde" no es válida' });
        filtro.fin = { $gt: fechaDesde };
        }
        if (hasta) {
            const fechaHasta = parsearFecha(hasta);
            if (!fechaHasta) return res.status(400).json({ mensaje: 'La fecha "hasta" no es válida' });
            filtro.inicio = { $lt: fechaHasta };
        }

        const reservas = await Reserva.find(filtro)
            .populate('computador', 'codigo nombre')
            .populate('cliente', 'nombre')
            .sort({ inicio: orden === 'asc' ? 1 : -1 });

        res.json({ reservas });
        } catch (error) {
            console.error('Error al listar reservas:', error.message);
            res.status(500).json({ mensaje: 'No se pudieron obtener las reservas' });
        }
    }

// El cliente cancela las suyas mientras no hayan comenzado; operador y administrador, siempre.
export async function cancelarReserva(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ mensaje: 'El identificador de la reserva no es válido' });
        }

    const reserva = await Reserva.findById(id).populate('computador', 'codigo');
    if (!reserva) {
        return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    if (req.usuario.rol === 'cliente') {
        const propio = await obtenerClienteDeUsuario(req.usuario.id);
        if (!propio || reserva.cliente.toString() !== propio._id.toString()) {
        return res.status(403).json({ mensaje: 'Solo puedes cancelar tus propias reservas' });
        }
        if (reserva.inicio <= new Date()) {
            return res.status(409).json({ mensaje: 'No puedes cancelar una reserva que ya comenzó' });
        }
    }

    if (reserva.estado !== 'confirmada') {
        return res.status(409).json({ mensaje: `La reserva ya está ${reserva.estado}` });
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    await registrarHistorial({
        entidad: 'Reserva',
        entidadId: reserva._id,
        accion: 'cancelar',
        usuario: req.usuario.id,
        detalle: `${reserva.computador?.codigo ?? ''}: ${formatear(reserva.inicio)} a ${formatear(reserva.fin)}`,
    });

    res.json({ reserva });
    } catch (error) {
    console.error('Error al cancelar reserva:', error.message);
    res.status(500).json({ mensaje: 'No se pudo cancelar la reserva' });
    }
}