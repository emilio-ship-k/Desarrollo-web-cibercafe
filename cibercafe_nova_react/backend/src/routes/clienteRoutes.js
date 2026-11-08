import { Router } from 'express';
import { listarClientes, crearCliente } from '../controllers/clienteController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

router.use(autenticar, requiereRol('operador', 'administrador'));

router.get('/', listarClientes);
router.post('/', crearCliente);

export default router;