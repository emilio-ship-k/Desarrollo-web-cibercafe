import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Cuantas vueltas de cifrado se aplican. Más vueltas = más seguro pero más lento.
const RONDAS = 10;

// Convierte la contraseña en un hash cifrado (se guarda en la base).
export async function hashearPassword(passwordPlano) {
  return bcrypt.hash(passwordPlano, RONDAS);
}

// Compara la contraseña escrita en el login con el hash guardado. Devuelve true o false.
export async function compararPassword(passwordPlano, hash) {
  return bcrypt.compare(passwordPlano, hash);
}

// Crea el token de sesión. Guarda solo el id y el rol del usuario, nunca la contraseña.
export function crearToken(usuario) {
  return jwt.sign(
    { id: usuario._id.toString(), rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

// Revisa que un token sea auténtico y no haya vencido, si es válido devuelve su contenido, si no lanza un error.
export function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}