import { Router } from 'express';
import {
    listarUsuarios,
    crearUsuario,
    cambiarRol,
    cambiarEstado,
    restablecerPassword,
} from '../controllers/usuarioController.js';
import { autenticar, requiereRol } from '../middleware/auth.js';

const router = Router();

// La gestión de usuarios es solo del administrador
router.use(autenticar, requiereRol('administrador'));

router.get('/', listarUsuarios);
router.post('/', crearUsuario);
router.put('/:id/rol', cambiarRol);
router.put('/:id/estado', cambiarEstado);
router.put('/:id/password', restablecerPassword);

export default router;