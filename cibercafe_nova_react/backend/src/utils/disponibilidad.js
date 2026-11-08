import Reserva from '../models/Reserva.js';

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