import { Router } from 'express';
import { listarSalas, crearSala, editarSala } from '../controllers/salaController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

// Todas las rutas de salas exigen sesión iniciada
router.use(autenticar);

// cualquier rol
router.get('/', listarSalas);
// solo administrador
router.post('/', requiereRol('administrador'), crearSala);
router.put('/:id', requiereRol('administrador'), editarSala); 

export default router;