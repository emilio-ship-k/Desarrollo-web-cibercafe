import { Router } from 'express';
import {
    consultarDisponibilidad,
    crearReserva,
    listarReservas,
    cancelarReserva,
} from '../controllers/reservaController.js';
import { autenticar } from '../middleware/auth.js';

const router = Router();

// Todos los roles pueden usar estas rutas, pero deben tener sesión iniciada.
router.use(autenticar);

router.get('/disponibilidad', consultarDisponibilidad);
router.get('/', listarReservas);
router.post('/', crearReserva);
router.put('/:id/cancelar', cancelarReserva);

export default router;