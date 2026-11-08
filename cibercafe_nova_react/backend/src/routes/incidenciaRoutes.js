import { Router } from 'express';
import {
    listarIncidencias,
    reportarIncidencia,
    resolverIncidencia,
} from '../controllers/incidenciaController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

// Las incidencias son solo para el personal: sesión iniciada y rol operador o administrador
router.use(autenticar, requiereRol('operador', 'administrador'));

router.get('/', listarIncidencias);
router.post('/', reportarIncidencia);
router.put('/:id/resolver', resolverIncidencia);

export default router;