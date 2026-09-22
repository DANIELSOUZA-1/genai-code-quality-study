import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();
const userController = new UserController();

// Rota restrita apenas para administradores autenticados
router.get('/', authMiddleware, requireRole(['ADMIN']), userController.getAllUsers);

export default router;
