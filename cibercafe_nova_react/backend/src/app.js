import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import salaRoutes from './routes/salaRoutes.js';
import computadorRoutes from './routes/computadorRoutes.js';
import tarifaRoutes from './routes/tarifaRoutes.js';
import incidenciaRoutes from './routes/incidenciaRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import sesionRoutes from './routes/sesionRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import historialRoutes from './routes/historialRoutes.js';


const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Ruta de prueba: sirve para comprobar que la API está viva
app.get('/api/health', (req, res) => {
    res.json({ ok: true, servicio: 'Cibercafé Nova API' });
});

// Autenticación /api/auth/registro o login o perfil
app.use('/api/auth', authRoutes);

// Salas, computadores y tarifas
app.use('/api/salas', salaRoutes);
app.use('/api/computadores', computadorRoutes);
app.use('/api/tarifas', tarifaRoutes);

// Incidencias (solo operador y administrador)
app.use('/api/incidencias', incidenciaRoutes);


// Reservas (todos los roles con sesión) y clientes (solo operador y administrador)
app.use('/api/reservas', reservaRoutes);
app.use('/api/clientes', clienteRoutes);

// Sesiones de uso (consultar: todos los roles; operar: operador y administrador)
app.use('/api/sesiones', sesionRoutes);

// Gestión de usuarios (solo administrador)
app.use('/api/usuarios', usuarioRoutes);

// Historial general (solo administrador)
app.use('/api/historial', historialRoutes);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

export default app;