import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema( {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    computador: { type: mongoose.Schema.Types.ObjectId, ref: 'Computador', required: true },
    inicio: { type: Date, required: true },
    fin: { type: Date, required: true },
    estado: { type: String, enum: ['confirmada', 'cancelada', 'completada'], default: 'confirmada' },
    creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
},
    { timestamps: true }
);

// Acelera la búsqueda de reservas que se superponen en un mismo puesto
reservaSchema.index({ computador: 1, inicio: 1, fin: 1 });

export default mongoose.model('Reserva', reservaSchema);