import mongoose from 'mongoose';

export const ESTADOS_PC = ['Disponible', 'Reservado', 'En_uso', 'Fuera_de_servicio'];
export const TIPOS_PUESTO = ['general', 'gaming', 'grupos'];

const computadorSchema = new mongoose.Schema( {
    codigo: { type: String, required: true, unique: true, trim: true }, // ej: PC-01
    nombre: { type: String, required: true, trim: true },
    sala: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true }, // solo una
    tipoPuesto: { type: String, enum: TIPOS_PUESTO, required: true },
    hardware: { type: String, default: '' },
    estado: { type: String, enum: ESTADOS_PC, default: 'Disponible' }, // igual que sala
    motivo: { type: String, default: 'Equipo libre y operativo' },
},
    { timestamps: true }
);

export default mongoose.model('Computador', computadorSchema);