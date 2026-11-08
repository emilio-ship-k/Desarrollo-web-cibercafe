import { Router } from 'express';
import {
    listarComputadores,
    obtenerComputador,
    crearComputador,
    editarComputador,
} from '../controllers/computadorController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

// Todas las rutas de computadores exigen sesión iniciada
router.use(autenticar);

// cualquier rol
router.get('/', listarComputadores); 
// ficha de detalle
router.get('/:id', requiereRol('operador', 'administrador'), obtenerComputador);
// solo administrador
router.post('/', requiereRol('administrador'), crearComputador); 
router.put('/:id', requiereRol('administrador'), editarComputador); 

export default router;