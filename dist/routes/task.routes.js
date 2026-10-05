"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_js_1 = require("../controllers/task.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const validate_middleware_js_1 = require("../middlewares/validate.middleware.js");
const task_schema_js_1 = require("../schemas/task.schema.js");
const router = (0, express_1.Router)();
const taskController = new task_controller_js_1.TaskController();
// Todas as rotas de tarefas exigem autenticação
router.use(auth_middleware_js_1.authMiddleware);
router.post('/', (0, validate_middleware_js_1.validate)(task_schema_js_1.createTaskSchema), taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', (0, validate_middleware_js_1.validate)(task_schema_js_1.taskIdParamSchema), taskController.getById);
router.put('/:id', (0, validate_middleware_js_1.validate)(task_schema_js_1.updateTaskSchema), taskController.update);
router.delete('/:id', (0, validate_middleware_js_1.validate)(task_schema_js_1.taskIdParamSchema), taskController.delete);
exports.default = router;
