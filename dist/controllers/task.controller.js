"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_js_1 = require("../services/task.service.js");
class TaskController {
    taskService;
    constructor() {
        this.taskService = new task_service_js_1.TaskService();
    }
    create = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const task = await this.taskService.createTask(userId, req.body);
            res.status(201).json({
                message: 'Tarefa criada com sucesso',
                task,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            const tasks = await this.taskService.getTasks(userId, role);
            res.status(200).json(tasks);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const taskId = parseInt(req.params.id, 10);
            const userId = req.user.id;
            const role = req.user.role;
            const task = await this.taskService.getTaskById(taskId, userId, role);
            res.status(200).json(task);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const taskId = parseInt(req.params.id, 10);
            const userId = req.user.id;
            const role = req.user.role;
            const task = await this.taskService.updateTask(taskId, userId, role, req.body);
            res.status(200).json({
                message: 'Tarefa atualizada com sucesso',
                task,
            });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const taskId = parseInt(req.params.id, 10);
            const userId = req.user.id;
            const role = req.user.role;
            await this.taskService.deleteTask(taskId, userId, role);
            res.status(200).json({
                message: 'Tarefa excluída com sucesso',
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.TaskController = TaskController;
