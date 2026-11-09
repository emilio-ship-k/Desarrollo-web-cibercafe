import Sesion from '../models/Sesion.js';
import Reserva from '../models/Reserva.js';
import Incidencia from '../models/Incidencia.js';
import Sala from '../models/Sala.js';
import Computador, { TIPOS_PUESTO } from '../models/Computador.js';

const ZONA_HORARIA = 'America/Santiago';

function parsearFecha(valor) {
    if (typeof valor !== 'string' || !valor.trim()) return null;
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function inicioDelMesEnChile(ahora = new Date()) {
    const partes = new Intl.DateTimeFormat('en-US', {
        timeZone: ZONA_HORARIA, year: 'numeric', month: '2-digit',
    }).formatToParts(ahora);
    const anio = Number(partes.find((p) => p.type === 'year').value);
    const mes = Number(partes.find((p) => p.type === 'month').value);

    const medianocheUTC = Date.UTC(anio, mes - 1, 1);
    const nombreZona = new Intl.DateTimeFormat('en-US', {
        timeZone: ZONA_HORARIA, timeZoneName: 'longOffset',
    }).formatToParts(new Date(medianocheUTC)).find((p) => p.type === 'timeZoneName').value;
    const coincidencia = nombreZona.match(/GMT([+-])(\d{2}):(\d{2})/);
    const minutosDiferencia = coincidencia
        ? (coincidencia[1] === '-' ? -1 : 1) * (Number(coincidencia[2]) * 60 + Number(coincidencia[3]))
        : 0;

    return new Date(medianocheUTC - minutosDiferencia * 60000);
}

// Resumen de uso (solo administrador)
// Filtros opcionales: desde, hasta. Sin ellos se usa el mes actual hasta este momento.
export async function obtenerResumen(req, res) {
    try {
        const { desde, hasta } = req.query;

        let fechaDesde = inicioDelMesEnChile();
        let fechaHasta = new Date();
        if (desde) {
            fechaDesde = parsearFecha(desde);
            if (!fechaDesde) return res.status(400).json({ mensaje: 'La fecha "desde" no es válida' });
        }
        if (hasta) {
            fechaHasta = parsearFecha(hasta);
            if (!fechaHasta) return res.status(400).json({ mensaje: 'La fecha "hasta" no es válida' });
        }
        if (fechaDesde >= fechaHasta) {
            return res.status(400).json({ mensaje: 'La fecha "desde" debe ser anterior a "hasta"' });
        }

        const rango = { $gte: fechaDesde, $lt: fechaHasta };

        const [usoSesiones, sesionesEnCurso, reservasPorEstado, incidenciasDelPeriodo, incidenciasAbiertasAhora, salas] =
            await Promise.all([
                Sesion.aggregate([
                    { $match: { estado: 'finalizada', fin: rango } },
                    { $lookup: { from: Computador.collection.name, localField: 'computador', foreignField: '_id', as: 'pc' } },
                    { $unwind: '$pc' },
                    {
                        $facet: {
                            totales: [
                                { $group: { _id: null, cantidad: { $sum: 1 }, minutos: { $sum: '$duracionMin' }, ingresos: { $sum: '$monto' } } },
                            ],
                            porSala: [
                                { $group: { _id: '$pc.sala', sesiones: { $sum: 1 }, minutos: { $sum: '$duracionMin' }, ingresos: { $sum: '$monto' } } },
                            ],
                            porTipo: [
                                { $group: { _id: '$pc.tipoPuesto', sesiones: { $sum: 1 }, minutos: { $sum: '$duracionMin' }, ingresos: { $sum: '$monto' } } },
                            ],
                        },
                    },
                ]),
                Sesion.countDocuments({ estado: 'activa' }),
                Reserva.aggregate([
                    { $match: { inicio: rango } },
                    { $group: { _id: '$estado', cantidad: { $sum: 1 } } },
                ]),
                Incidencia.find({ createdAt: rango }).select('estado createdAt fechaResolucion'),
                Incidencia.countDocuments({ estado: 'abierta' }),
                Sala.find().sort({ nombre: 1 }).select('nombre'),
            ]);

        //  Sesiones
        const { totales, porSala, porTipo } = usoSesiones[0];
        const total = totales[0] ?? { cantidad: 0, minutos: 0, ingresos: 0 };
        const sesiones = {
            finalizadas: total.cantidad,
            minutos: total.minutos,
            ingresos: total.ingresos,
            promedioMinutos: total.cantidad ? Math.round(total.minutos / total.cantidad) : 0,
            promedioIngreso: total.cantidad ? Math.round(total.ingresos / total.cantidad) : 0,
            enCurso: sesionesEnCurso,
        };

        // Reservas: siempre aparecen los tres estados, aunque sea con 0
        const reservas = { confirmada: 0, cancelada: 0, completada: 0 };
        for (const grupo of reservasPorEstado) reservas[grupo._id] = grupo.cantidad;
        reservas.total = reservas.confirmada + reservas.cancelada + reservas.completada;

        // Incidencias 
        const resueltas = incidenciasDelPeriodo.filter((i) => i.estado === 'resuelta' && i.fechaResolucion);
        const minutosResolucion = resueltas.reduce((suma, i) => suma + (i.fechaResolucion - i.createdAt) / 60000, 0);
        const incidencias = {
            reportadas: incidenciasDelPeriodo.length,
            abiertas: incidenciasDelPeriodo.filter((i) => i.estado === 'abierta').length,
            resueltas: resueltas.length,
            promedioMinutosResolucion: resueltas.length ? Math.round(minutosResolucion / resueltas.length) : 0,
            abiertasAhora: incidenciasAbiertasAhora,
        };

        // Uso por sala y por tipo: se incluyen todas, aunque no tengan uso
        const vacio = { sesiones: 0, minutos: 0, ingresos: 0 };
        const usoPorSala = salas.map((sala) => {
            const grupo = porSala.find((g) => g._id?.equals(sala._id));
            return { sala: sala._id, nombre: sala.nombre, ...(grupo ? { sesiones: grupo.sesiones, minutos: grupo.minutos, ingresos: grupo.ingresos } : vacio) };
        });
        const usoPorTipo = TIPOS_PUESTO.map((tipo) => {
            const grupo = porTipo.find((g) => g._id === tipo);
            return { tipoPuesto: tipo, ...(grupo ? { sesiones: grupo.sesiones, minutos: grupo.minutos, ingresos: grupo.ingresos } : vacio) };
        });

        res.json({
            periodo: { desde: fechaDesde, hasta: fechaHasta },
            sesiones,
            reservas,
            incidencias,
            usoPorSala,
            usoPorTipo,
        });
    } catch (error) {
        console.error('Error al obtener resumen:', error.message);
        res.status(500).json({ mensaje: 'No se pudo obtener el resumen' });
    }
}