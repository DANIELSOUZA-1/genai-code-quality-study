"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_js_1 = require("../repositories/task.repository.js");
const custom_error_js_1 = require("../utils/custom-error.js");
class TaskService {
    taskRepository;
    constructor() {
        this.taskRepository = new task_repository_js_1.TaskRepository();
    }
    async createTask(userId, taskData) {
        return this.taskRepository.create(userId, taskData);
    }
    async getTasks(userId, role) {
        if (role === 'ADMIN') {
            return this.taskRepository.findAll();
        }
        return this.taskRepository.findByUserId(userId);
    }
    async getTaskById(taskId, userId, role) {
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            throw new custom_error_js_1.AppError('Tarefa não encontrada', 404);
        }
        if (role !== 'ADMIN' && task.user_id !== userId) {
            throw new custom_error_js_1.AppError('Acesso negado. Esta tarefa pertence a outro usuário', 403);
        }
        return task;
    }
    async updateTask(taskId, userId, role, taskData) {
        const task = await this.getTaskById(taskId, userId, role);
        const updatedTask = await this.taskRepository.update(task.id, taskData);
        return updatedTask;
    }
    async deleteTask(taskId, userId, role) {
        await this.getTaskById(taskId, userId, role);
        await this.taskRepository.delete(taskId);
    }
}
exports.TaskService = TaskService;
