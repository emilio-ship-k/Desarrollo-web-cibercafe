import { Router } from 'express';
import { registrar, login, perfil } from '../controllers/authController.js';
import { autenticar } from '../middleware/auth.js';

const router = Router();

// Rutas públicas (no requieren sesión)
router.post('/registro', registrar);
router.post('/login', login);

// Ruta protegida: primero pasa por el autenticador y luego llega a perfil
router.get('/perfil', autenticar, perfil);

export default router;