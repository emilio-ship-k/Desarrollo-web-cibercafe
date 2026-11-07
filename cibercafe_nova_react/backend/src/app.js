import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Ruta de prueba: sirve para comprobar que la API está viva
app.get('/api/health', (req, res) => {
    res.json({ ok: true, servicio: 'Cibercafé Nova API' });
});

// Las rutas lo agregare despues.

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

export default app;