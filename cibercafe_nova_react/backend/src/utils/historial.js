import Historial from '../models/Historial.js';

// Deja una línea en la bitácora: quién hizo qué, sobre qué y cuándo (la fecha la agrega Mongoose).
export async function registrarHistorial({ entidad, entidadId, accion, usuario, detalle = '' }) {
    try {
        await Historial.create({ entidad, entidadId, accion, usuario, detalle });
    } catch (error) {
        // Si el registro falla no se cancela la acción principal ya que se realizo, pero el error queda en la consola del servidor
        console.error('No se pudo registrar en el historial:', error.message);
    }
}