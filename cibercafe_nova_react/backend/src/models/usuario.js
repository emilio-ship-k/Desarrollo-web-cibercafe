import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema( {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // guarda la contraseña en el hash (nunca el texto legible)
    passwordHash: { type: String, required: true },
    rol: { type: String, enum: ['cliente', 'operador', 'administrador'], default: 'cliente' },
    activo: { type: Boolean, default: true },
},
    { timestamps: true }
);

export default mongoose.model('Usuario', usuarioSchema);