import mongoose from 'mongoose';

const sesionSchema = new mongoose.Schema( {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    computador: { type: mongoose.Schema.Types.ObjectId, ref: 'Computador', required: true },
    operador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    reserva: { type: mongoose.Schema.Types.ObjectId, ref: 'Reserva', default: null },
    inicio: { type: Date, required: true },
    fin: { type: Date, default: null },
    duracionMin: { type: Number, default: 0 },
    // Se guarda el precio por hora usado, para que un cambio de tarifa no altere cobros antiguos
    precioPorHora: { type: Number, required: true },
    monto: { type: Number, default: 0 },
    estado: { type: String, enum: ['activa', 'finalizada'], default: 'activa' },
},
    { timestamps: true }
);

export default mongoose.model('Sesion', sesionSchema);