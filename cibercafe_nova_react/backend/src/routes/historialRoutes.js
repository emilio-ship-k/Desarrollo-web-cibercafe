import { Router } from 'express';
import { listarHistorial } from '../controllers/historialController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

// El historial general es solo del administrador
router.use(autenticar, requiereRol('administrador'));

router.get('/', listarHistorial);

export default router;