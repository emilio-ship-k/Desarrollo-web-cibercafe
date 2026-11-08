import 'dotenv/config';
import mongoose from 'mongoose';
import { conectarDB } from '../config/db.js';
import Usuario from '../models/Usuario.js';
import Cliente from '../models/Cliente.js';
import { hashearPassword } from '../utils/seguridad.js';

// Las cuentas se leen del archivo .env, así las contraseñas no quedan escritas en el código.
const CUENTAS = [
    { rol: 'administrador', prefijo: 'ADMIN' },
    { rol: 'operador', prefijo: 'OPERADOR' },
    { rol: 'cliente', prefijo: 'CLIENTE' },
];

const LARGO_MIN_PASSWORD = 8;

// Revision de variables antes de tocar la base de datos
const faltantes = [];
for (const { prefijo } of CUENTAS) {
    for (const campo of ['NOMBRE', 'EMAIL', 'PASSWORD']) {
        if (!process.env[`${prefijo}_${campo}`]) faltantes.push(`${prefijo}_${campo}`);
    }
}
if (faltantes.length > 0) {
    console.error('Faltan estas variables en el archivo .env:', faltantes.join(', '));
    process.exit(1);
}

await conectarDB();

for (const { rol, prefijo } of CUENTAS) {
    const nombre = process.env[`${prefijo}_NOMBRE`].trim();
    const email = process.env[`${prefijo}_EMAIL`].trim().toLowerCase();
    const password = process.env[`${prefijo}_PASSWORD`];

    if (password.length < LARGO_MIN_PASSWORD) {
        console.error(`La contraseña de ${prefijo} debe tener al menos ${LARGO_MIN_PASSWORD} caracteres`);
        continue;
    }

    // Si el correo ya existe, no se modifica ni se duplica
    if (await Usuario.findOne({ email })) {
        console.log(`Ya existe (se omite): ${rol} - ${email}`);
        continue;
    }

    const usuario = await Usuario.create({
        nombre,
        email,
        passwordHash: await hashearPassword(password),
        rol,
    });

    // Los clientes tienen además su registro en la colección clientes
    if (rol === 'cliente') {
        await Cliente.create({ nombre, usuario: usuario._id });
    }

    console.log(`Creado: ${rol} - ${email}`);
    }

await mongoose.disconnect();