import mongoose from 'mongoose';

// Un cliente puede tener cuenta usuario.
const clienteSchema = new mongoose.Schema( {
    nombre: { type: String, required: true, trim: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null },
},
    { timestamps: true }
);

export default mongoose.model('Cliente', clienteSchema);