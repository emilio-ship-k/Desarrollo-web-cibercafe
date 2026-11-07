import 'dotenv/config';
import mongoose from 'mongoose';
import { conectarDB } from '../config/db.js';
import Sala from '../models/Sala.js';
import Computador from '../models/Computador.js';
import Tarifa from '../models/Tarifa.js';

// Datos iniciales tomados del front: 3 salas, 30 PCs y tarifas por hora.
const SALAS = [
  { clave: 'general', nombre: 'Sala general', desde: 1, hasta: 10, hardware: 'Intel i5 12400, 16GB RAM, GTX 1660', etiqueta: 'General', precio: 2500 },
  { clave: 'gaming', nombre: 'Sala gaming', desde: 11, hasta: 20, hardware: 'Intel i7 13700F, 32GB RAM, RTX 4070', etiqueta: 'Gaming', precio: 3500 },
  { clave: 'grupos', nombre: 'Sala grupos', desde: 21, hasta: 30, hardware: 'AMD Ryzen 7 5800X, 32GB RAM, RTX 3070', etiqueta: 'Grupos', precio: 3500 },
];

await conectarDB();

// Se limpian solo las colecciones que este script vuelve a cargar
await Promise.all([Sala.deleteMany({}), Computador.deleteMany({}), Tarifa.deleteMany({})]);

for (const s of SALAS) {
  const sala = await Sala.create({ nombre: s.nombre });
  const pcs = [];
  for (let n = s.desde; n <= s.hasta; n++) {
    const num = String(n).padStart(2, '0');
    pcs.push({
      codigo: `PC-${num}`,
      nombre: `Pc ${num} (${s.etiqueta})`,
      sala: sala._id,
      tipoPuesto: s.clave,
      hardware: s.hardware,
    });
  }
  await Computador.insertMany(pcs);
  await Tarifa.create({ tipoPuesto: s.clave, precioPorHora: s.precio });
}

console.log('Carga inicial lista: 3 salas, 30 computadores y 3 tarifas.');
await mongoose.disconnect();