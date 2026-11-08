import Reserva from '../models/Reserva.js';
import Sesion from '../models/Sesion.js';

// Busca si ya existe una reserva confirmada del mismo PC que se cruce con el horario pedido.
export async function buscarReservaEnConflicto(computadorId, inicio, fin, excluirReservaId = null) {
const filtro = {
    computador: computadorId,
    estado: 'confirmada',
    inicio: { $lt: fin },
    fin: { $gt: inicio },
};
if (excluirReservaId) {
    filtro._id = { $ne: excluirReservaId };
}
return Reserva.findOne(filtro).sort({ inicio: 1 });
}

// Busca sesiones activas que ocupen alguno de los PCs indicados durante el horario pedido.
export async function buscarSesionesEnConflicto(computadorIds, inicio, fin) {
const ahora = new Date();
const activas = await Sesion.find({ computador: { $in: computadorIds }, estado: 'activa' });

return activas
    .map((sesion) => ({
    sesion,
    ocupadoHasta: sesion.finPrevisto > ahora ? sesion.finPrevisto : ahora,
    }))
    .filter(({ sesion, ocupadoHasta }) => sesion.inicio < fin && ocupadoHasta > inicio);
}

// Calcula el estado que se debe MOSTRAR de cada PC en este momento.
export async function aplicarEstadoEfectivo(computadores) {
const ahora = new Date();
const candidatos = computadores.filter((c) => c.estado === 'Disponible').map((c) => c._id);

const reservados =
    candidatos.length > 0
    ? await Reserva.find({
        computador: { $in: candidatos },
        estado: 'confirmada',
        inicio: { $lte: ahora },
        fin: { $gt: ahora },
        }).distinct('computador')
    : [];
const idsReservados = new Set(reservados.map((id) => id.toString()));

return computadores.map((c) => {
    const objeto = c.toObject();
    if (idsReservados.has(c._id.toString())) {
    objeto.estado = 'Reservado';
    objeto.motivo = 'Reservado en este horario';
    }
    return objeto;
});
}