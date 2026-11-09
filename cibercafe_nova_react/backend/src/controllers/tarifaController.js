import Tarifa from '../models/Tarifa.js';
import { TIPOS_PUESTO } from '../models/Computador.js';
import { registrarHistorial } from '../utils/historial.js';

// Formato de pesos chilenos: 3500 -> $3.500
const pesos = (valor) => `$${valor.toLocaleString('es-CL')}`;

// tarifas vigentes, una por tipo de puesto (cualquier usuario con sesión)
export async function listarTarifas(req, res) {
    try {
        const tarifas = await Tarifa.find({ activa: true }).sort({ tipoPuesto: 1 });
        res.json({ tarifas });
    } catch (error) {
        console.error('Error al listar tarifas:', error.message);
        res.status(500).json({ mensaje: 'No se pudieron obtener las tarifas' });
    }
}

// Cambiar el precio por hora (solo administrador), no se edita la tarifa antigua solo se crea una nueva y la anterior queda desactivada
export async function cambiarTarifa(req, res) {
    try {
        const { tipoPuesto } = req.params;
        const { precioPorHora } = req.body;

        if (!TIPOS_PUESTO.includes(tipoPuesto)) {
            return res.status(400).json({ mensaje: `Tipo de puesto inválido. Usa: ${TIPOS_PUESTO.join(', ')}` });
        }
        if (!Number.isInteger(precioPorHora) || precioPorHora <= 0) {
            return res.status(400).json({ mensaje: 'El precio por hora debe ser un número entero mayor a 0' });
        }

        const vigente = await Tarifa.findOne({ tipoPuesto, activa: true });
        if (vigente && vigente.precioPorHora === precioPorHora) {
            return res.status(400).json({ mensaje: 'Ese ya es el precio vigente para este tipo de puesto' });
        }

        // Primero se crea la nueva y después se desactivan las anteriores, así nunca queda un tipo de puesto sin tarifa vigente.
        const nueva = await Tarifa.create({ tipoPuesto, precioPorHora });
        await Tarifa.updateMany(
            { tipoPuesto, activa: true, _id: { $ne: nueva._id } },
            { activa: false }
        );

        // Se deja el precio anterior y el nuevo, para saber cuánto subió o bajó
        const precioAnterior = vigente ? pesos(vigente.precioPorHora) : 'sin tarifa';
        await registrarHistorial({
            entidad: 'Tarifa',
            entidadId: nueva._id,
            accion: 'cambiar',
            usuario: req.usuario.id,
            detalle: `${tipoPuesto}: ${precioAnterior} -> ${pesos(precioPorHora)} por hora`,
        });

        res.status(201).json({ tarifa: nueva });
    } catch (error) {
        console.error('Error al cambiar tarifa:', error.message);
        res.status(500).json({ mensaje: 'No se pudo cambiar la tarifa' });
    }
}