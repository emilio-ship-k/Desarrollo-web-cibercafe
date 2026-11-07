import mongoose from 'mongoose';
import { TIPOS_PUESTO } from './Computador.js';

// Precio por hora según el tipo de puesto.
const tarifaSchema = new mongoose.Schema( {
    tipoPuesto: { type: String, enum: TIPOS_PUESTO, required: true },
    precioPorHora: { type: Number, required: true, min: 0 },
    vigenteDesde: { type: Date, default: Date.now },
    activa: { type: Boolean, default: true },
},
    { timestamps: true }
);

export default mongoose.model('Tarifa', tarifaSchema);