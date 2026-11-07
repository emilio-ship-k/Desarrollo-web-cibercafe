import mongoose from 'mongoose';

const incidenciaSchema = new mongoose.Schema( {
    computador: { type: mongoose.Schema.Types.ObjectId, ref: 'Computador', required: true },
    descripcion: { type: String, required: true, trim: true },
    estado: { type: String, enum: ['abierta', 'resuelta'], default: 'abierta' },
    reportadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    resueltaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null },
    resolucion: { type: String, default: '' },
    fechaResolucion: { type: Date, default: null },
},
    { timestamps: true }
);

export default mongoose.model('Incidencia', incidenciaSchema);