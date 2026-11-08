import mongoose from 'mongoose';
import Incidencia from '../models/Incidencia.js';
import Computador from '../models/Computador.js';
import { registrarHistorial } from '../utils/historial.js';

const MOTIVO_OPERATIVO = 'Equipo libre y operativo';
const ESTADOS_INCIDENCIA = ['abierta', 'resuelta'];

export async function listarIncidencias(req, res) {
    try {
        const { estado, computador } = req.query;
        const filtro = {};

        if (estado) {
            if (!ESTADOS_INCIDENCIA.includes(estado)) {
            return res.status(400).json({ mensaje: `Estado inválido. Usa: ${ESTADOS_INCIDENCIA.join(', ')}` });
        }
        filtro.estado = estado;
    }
        if (computador) {
            if (!mongoose.isValidObjectId(computador)) {
                return res.status(400).json({ mensaje: 'El identificador del computador no es válido' });
            }
        filtro.computador = computador;
        }

        const incidencias = await Incidencia.find(filtro)
            .populate('computador', 'codigo nombre')
            .populate('reportadaPor', 'nombre')
            .populate('resueltaPor', 'nombre')
            .sort({ createdAt: -1 });

        res.json({ incidencias });
        } catch (error) {
            console.error('Error al listar incidencias:', error.message);
            res.status(500).json({ mensaje: 'No se pudieron obtener las incidencias' });
        }
}

// Abre una incidencia y, si el PC no está en uso, lo deja Fuera_de_servicio.
export async function reportarIncidencia(req, res) {
    try {
        const { computador: computadorId } = req.body;
        const descripcion = req.body.descripcion?.trim();

        if (!computadorId || !descripcion) {
            return res.status(400).json({ mensaje: 'El computador y la descripción de la falla son obligatorios' });
        }
        if (!mongoose.isValidObjectId(computadorId)) {
            return res.status(400).json({ mensaje: 'El identificador del computador no es válido' });
        }

        const computador = await Computador.findById(computadorId);
        if (!computador) {
            return res.status(404).json({ mensaje: 'Computador no encontrado' });
        }

        const incidencia = await Incidencia.create({
        computador: computador._id,
        descripcion,
        reportadaPor: req.usuario.id,
        });

        await registrarHistorial({
            entidad: 'Incidencia',
            entidadId: incidencia._id,
            accion: 'crear',
            usuario: req.usuario.id,
            detalle: `${computador.codigo}: ${descripcion}`,
        });

    // Si el PC está En_uso, no se toca: al cerrar la sesión pasará a Fuera_de_servicio, en cualquier otro estado queda bloqueado de inmediato.
        if (computador.estado !== 'En_uso') {
            const estadoAnterior = computador.estado;
            computador.estado = 'Fuera_de_servicio';
            computador.motivo = descripcion;
            await computador.save();

        if (estadoAnterior !== 'Fuera_de_servicio') {
            await registrarHistorial({
                entidad: 'Computador',
                entidadId: computador._id,
                accion: 'cambiar_estado',
                usuario: req.usuario.id,
                detalle: `${computador.codigo}: ${estadoAnterior} -> Fuera_de_servicio (incidencia)`,
            });
        }
    }

        res.status(201).json({ incidencia, estadoComputador: computador.estado });
        } catch (error) {
            console.error('Error al reportar incidencia:', error.message);
            res.status(500).json({ mensaje: 'No se pudo registrar la incidencia' });
        }
}

// Cierra la incidencia y, si el PC queda sin fallas abiertas, lo vuelve a habilitar.
export async function resolverIncidencia(req, res) {
    try {
        const { id } = req.params;
        const resolucion = req.body.resolucion?.trim();

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ mensaje: 'El identificador de la incidencia no es válido' });
        }
        if (!resolucion) {
            return res.status(400).json({ mensaje: 'Debes indicar qué se hizo para resolver la falla' });
        }

        const incidencia = await Incidencia.findById(id);
        if (!incidencia) {
            return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
        }
        if (incidencia.estado === 'resuelta') {
            return res.status(409).json({ mensaje: 'Esta incidencia ya fue resuelta' });
        }

        incidencia.estado = 'resuelta';
        incidencia.resolucion = resolucion;
        incidencia.resueltaPor = req.usuario.id;
        incidencia.fechaResolucion = new Date();
        await incidencia.save();

        const computador = await Computador.findById(incidencia.computador);

        await registrarHistorial({
            entidad: 'Incidencia',
            entidadId: incidencia._id,
            accion: 'resolver',
            usuario: req.usuario.id,
            detalle: `${computador?.codigo ?? ''}: ${resolucion}`,
        });

        if (computador) {
            // ¿Le quedan otras fallas abiertas?
            const otraAbierta = await Incidencia.findOne({ computador: computador._id, estado: 'abierta' }).sort({
            createdAt: -1,
        });

        if (otraAbierta) {
            // Sigue bloqueado: el motivo pasa a ser el de la falla abierta más reciente
            if (computador.estado === 'Fuera_de_servicio') {
                computador.motivo = otraAbierta.descripcion;
                await computador.save();
            }
        } else if (computador.estado === 'Fuera_de_servicio') {
            computador.estado = 'Disponible';
            computador.motivo = MOTIVO_OPERATIVO;
            await computador.save();

            await registrarHistorial({
                entidad: 'Computador',
                entidadId: computador._id,
                accion: 'cambiar_estado',
                usuario: req.usuario.id,
                detalle: `${computador.codigo}: Fuera_de_servicio -> Disponible (incidencia resuelta)`,
            });
        }
    }

    res.json({ incidencia, estadoComputador: computador?.estado ?? null });
    } catch (error) {
        console.error('Error al resolver incidencia:', error.message);
        res.status(500).json({ mensaje: 'No se pudo resolver la incidencia' });
    }
}