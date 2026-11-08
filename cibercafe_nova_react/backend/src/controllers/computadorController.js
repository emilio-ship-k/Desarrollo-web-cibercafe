import mongoose from 'mongoose';
import Computador, { ESTADOS_PC, TIPOS_PUESTO } from '../models/Computador.js';
import Sala from '../models/Sala.js';
import Reserva from '../models/Reserva.js';
import Incidencia from '../models/Incidencia.js';
import { aplicarEstadoEfectivo } from '../utils/disponibilidad.js';

// Lista los PCs. Los filtros son opcionales y se pueden combinar.
export async function listarComputadores(req, res) {
try {
    const { sala, tipoPuesto, estado } = req.query;
    const filtro = {};

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
if (estado) {
    if (!ESTADOS_PC.includes(estado)) {
        return res.status(400).json({ mensaje: `Estado inválido. Usa: ${ESTADOS_PC.join(', ')}` });
    }
}

const encontrados = await Computador.find(filtro).populate('sala', 'nombre').sort({ codigo: 1 });

// El estado mostrado considera las reservas que están ocurriendo ahora.
const conEstado = await aplicarEstadoEfectivo(encontrados);
const computadores = estado ? conEstado.filter((c) => c.estado === estado) : conEstado;

res.json({ computadores });
    } catch (error) {
        console.error('Error al listar computadores:', error.message);
        res.status(500).json({ mensaje: 'No se pudieron obtener los computadores' });
    }
}

// Ficha de un PC con su reserva próxima e incidencias abiertas (solo operador y administrador)
export async function obtenerComputador(req, res) {
try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ mensaje: 'El identificador del computador no es válido' });
    }

    const computador = await Computador.findById(id).populate('sala', 'nombre');
    if (!computador) {
    return res.status(404).json({ mensaje: 'Computador no encontrado' });
    }

    const [reservaProxima, incidenciasAbiertas] = await Promise.all([
    // La reserva confirmada más cercana que aún no termina
    Reserva.findOne({ computador: computador._id, estado: 'confirmada', fin: { $gt: new Date() } })
        .sort({ inicio: 1 })
        .populate('cliente', 'nombre'),
    Incidencia.find({ computador: computador._id, estado: 'abierta' }).sort({ createdAt: -1 }),
    ]);

    const [computadorConEstado] = await aplicarEstadoEfectivo([computador]);

    res.json({ computador: computadorConEstado, reservaProxima, incidenciasAbiertas });
} catch (error) {
    console.error('Error al obtener computador:', error.message);
    res.status(500).json({ mensaje: 'No se pudo obtener el computador' });
}
}

// crear PC (solo administrador)
export async function crearComputador(req, res) {
try {
    const codigo = req.body.codigo?.trim();
    const nombre = req.body.nombre?.trim();
    const { sala, tipoPuesto } = req.body;
    const hardware = req.body.hardware?.trim() || '';

    if (!codigo || !nombre || !sala || !tipoPuesto) {
        return res.status(400).json({ mensaje: 'Código, nombre, sala y tipo de puesto son obligatorios' });
    }
    if (!TIPOS_PUESTO.includes(tipoPuesto)) {
        return res.status(400).json({ mensaje: `Tipo de puesto inválido. Usa: ${TIPOS_PUESTO.join(', ')}` });
    }
    if (!mongoose.isValidObjectId(sala) || !(await Sala.exists({ _id: sala }))) {
        return res.status(400).json({ mensaje: 'La sala indicada no existe' });
    }
    if (await Computador.findOne({ codigo })) {
        return res.status(409).json({ mensaje: 'Ya existe un computador con ese código' });
    }

    // El estado NO se toma de la petición: todo PC nuevo parte como Disponible
    const computador = await Computador.create({ codigo, nombre, sala, tipoPuesto, hardware });
    res.status(201).json({ computador });
} catch (error) {
    console.error('Error al crear computador:', error.message);
    res.status(500).json({ mensaje: 'No se pudo crear el computador' });
}
}

// editar PC (solo administrador)
// Se puede cambiar nombre, sala, tipo de puesto y hardware. El código y el estado no se editan.
export async function editarComputador(req, res) {
try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ mensaje: 'El identificador del computador no es válido' });
    }

    const computador = await Computador.findById(id);
    if (!computador) {
        return res.status(404).json({ mensaje: 'Computador no encontrado' });
    }

    const { nombre, sala, tipoPuesto, hardware } = req.body;

    if (nombre !== undefined) {
    if (!nombre.trim()) {
        return res.status(400).json({ mensaje: 'El nombre no puede quedar vacío' });
    }
    computador.nombre = nombre.trim();
    }
    if (sala !== undefined) {
    if (!mongoose.isValidObjectId(sala) || !(await Sala.exists({ _id: sala }))) {
        return res.status(400).json({ mensaje: 'La sala indicada no existe' });
    }
    computador.sala = sala;
    }
    if (tipoPuesto !== undefined) {
    if (!TIPOS_PUESTO.includes(tipoPuesto)) {
        return res.status(400).json({ mensaje: `Tipo de puesto inválido. Usa: ${TIPOS_PUESTO.join(', ')}` });
    }
    computador.tipoPuesto = tipoPuesto;
    }
    if (hardware !== undefined) {
    computador.hardware = hardware.trim();
    }

    await computador.save();
    res.json({ computador });
} catch (error) {
    console.error('Error al editar computador:', error.message);
    res.status(500).json({ mensaje: 'No se pudo editar el computador' });
}
}