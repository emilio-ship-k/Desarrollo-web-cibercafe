import 'dotenv/config';
import app from './app.js';
import { conectarDB } from './config/db.js';

const PORT = process.env.PORT || 4000;

try {
  await conectarDB();
  app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));
} catch (error) {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
}