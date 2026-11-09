import { Router } from 'express';
import { obtenerResumen } from '../controllers/resumenController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

// El resumen de uso e ingresos es solo del administrador
router.use(autenticar, requiereRol('administrador'));

router.get('/', obtenerResumen);

export default router;