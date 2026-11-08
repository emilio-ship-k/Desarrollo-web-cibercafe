import { Router } from 'express';
import {
    iniciarSesion,
    extenderSesion,
    finalizarSesion,
    listarSesiones,
} from '../controllers/sesionController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

// Todas las rutas exigen sesión iniciada
router.use(autenticar);

// Consultar, todos los roles (el cliente solo ve las suyas, lo aplica el controlador)
router.get('/', listarSesiones);

// Operar sesiones, solo el personal del local
router.post('/', requiereRol('operador', 'administrador'), iniciarSesion);
router.put('/:id/extender', requiereRol('operador', 'administrador'), extenderSesion);
router.put('/:id/finalizar', requiereRol('operador', 'administrador'), finalizarSesion);

export default router;