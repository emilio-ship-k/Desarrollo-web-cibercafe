import 'dotenv/config';
import mongoose from 'mongoose';
import readline from 'node:readline/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { conectarDB } from '../config/db.js';
import Usuario from '../models/Usuario.js';
import Cliente from '../models/Cliente.js';
import Sala from '../models/Sala.js';
import Computador from '../models/Computador.js';
import Tarifa from '../models/Tarifa.js';
import Reserva from '../models/Reserva.js';
import Sesion from '../models/Sesion.js';
import Incidencia from '../models/Incidencia.js';
import Historial from '../models/Historial.js';

// Reinicio total: vacía las 9 colecciones y vuelve a cargar los datos iniciales
// usando los mismos scripts de siempre (seed.js y seedUsuarios.js).

const MODELOS = [Usuario, Cliente, Sala, Computador, Tarifa, Reserva, Sesion, Incidencia, Historial];
const LARGO_MIN_PASSWORD = 8;

// 1Revisar el .env ANTES de borrar: si faltan las cuentas, la base quedaría sin usuarios
const faltantes = [];
for (const prefijo of ['ADMIN', 'OPERADOR', 'CLIENTE']) {
    for (const campo of ['NOMBRE', 'EMAIL', 'PASSWORD']) {
        if (!process.env[`${prefijo}_${campo}`]) faltantes.push(`${prefijo}_${campo}`);
    }
    const password = process.env[`${prefijo}_PASSWORD`];
    if (password && password.length < LARGO_MIN_PASSWORD) {
        faltantes.push(`${prefijo}_PASSWORD (mínimo ${LARGO_MIN_PASSWORD} caracteres)`);
    }
}
if (faltantes.length > 0) {
    console.error('No se borró nada. Revisa estas variables en el archivo .env:', faltantes.join(', '));
    process.exit(1);
}

await conectarDB();

// Mostrar qué base se va a borrar y cuántos documentos tiene cada colección
const { name: baseDatos, host } = mongoose.connection;
console.log(`\nSe va a BORRAR TODO en la base "${baseDatos}" (${host}):`);
for (const modelo of MODELOS) {
    const cantidad = await modelo.countDocuments();
    console.log(`  - ${modelo.collection.name}: ${cantidad} documentos`);
}

// Pedir confirmación escribiendo SI
const consola = readline.createInterface({ input: process.stdin, output: process.stdout });
const respuesta = await consola.question('\nEsta acción no se puede deshacer. Escribe SI para continuar: ');
consola.close();

if (respuesta.trim().toUpperCase() !== 'SI') {
    console.log('Cancelado. No se borró nada.');
    await mongoose.disconnect();
    process.exit(0);
}

// Vaciar las colecciones. Se usa deleteMany (no drop) para conservar los índices, como el email único de usuarios.
await Promise.all(MODELOS.map((modelo) => modelo.deleteMany({})));
console.log('\nColecciones vaciadas.');
await mongoose.disconnect();

// Volver a cargar los datos iniciales con los scripts que ya existen
const ejecutarSeed = (archivo) => {
    const ruta = fileURLToPath(new URL(archivo, import.meta.url));
    execFileSync(process.execPath, [ruta], { stdio: 'inherit' });
};
ejecutarSeed('./seed.js');
ejecutarSeed('./seedUsuarios.js');

console.log('\nReinicio completo: la base quedó como nueva.');