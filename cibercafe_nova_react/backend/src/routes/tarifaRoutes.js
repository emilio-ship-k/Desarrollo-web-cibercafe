import { Router } from 'express';
import { listarTarifas, cambiarTarifa } from '../controllers/tarifaController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

// Todas las rutas de tarifas exigen sesión iniciada
router.use(autenticar);

// cualquier rol
router.get('/', listarTarifas);
// solo administrador
router.put('/:tipoPuesto', requiereRol('administrador'), cambiarTarifa);

export default router;