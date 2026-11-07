import mongoose from 'mongoose';

// Registro de cambios relevantes: quién hizo qué y cuándo.
const historialSchema = new mongoose.Schema( {
    // ej:Reserva
    entidad: { type: String, required: true },
    entidadId: { type: mongoose.Schema.Types.ObjectId, required: true },
    // ej: crear, cancelar, cambiar_estado
    accion: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    detalle: { type: String, default: '' },
},
    { timestamps: { createdAt: 'fecha', updatedAt: false } }
);

export default mongoose.model('Historial', historialSchema);