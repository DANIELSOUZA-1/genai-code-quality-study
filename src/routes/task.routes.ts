import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} from '../schemas/task.schema.js';

const router = Router();
const taskController = new TaskController();

// Todas as rotas de tarefas exigem autenticação
router.use(authMiddleware);

router.post('/', validate(createTaskSchema), taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', validate(taskIdParamSchema), taskController.getById);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', validate(taskIdParamSchema), taskController.delete);

export default router;
