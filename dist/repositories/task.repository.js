"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const database_js_1 = require("../config/database.js");
class TaskRepository {
    async create(userId, taskData) {
        const db = await (0, database_js_1.getDatabase)();
        const status = taskData.status || 'PENDING';
        const result = await db.run(`INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)`, [taskData.title, taskData.description, status, userId]);
        const task = await this.findById(result.lastID);
        return task;
    }
    async findById(id) {
        const db = await (0, database_js_1.getDatabase)();
        const task = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
        return task;
    }
    async findByUserId(userId) {
        const db = await (0, database_js_1.getDatabase)();
        const tasks = await db.all(`SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
        return tasks;
    }
    async findAll() {
        const db = await (0, database_js_1.getDatabase)();
        const tasks = await db.all(`SELECT * FROM tasks ORDER BY created_at DESC`);
        return tasks;
    }
    async update(id, taskData) {
        const db = await (0, database_js_1.getDatabase)();
        const currentTask = await this.findById(id);
        if (!currentTask) {
            return null;
        }
        const title = taskData.title !== undefined ? taskData.title : currentTask.title;
        const description = taskData.description !== undefined ? taskData.description : currentTask.description;
        const status = taskData.status !== undefined ? taskData.status : currentTask.status;
        await db.run(`UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`, [title, description, status, id]);
        return this.findById(id);
    }
    async delete(id) {
        const db = await (0, database_js_1.getDatabase)();
        const result = await db.run(`DELETE FROM tasks WHERE id = ?`, [id]);
        return (result.changes || 0) > 0;
    }
}
exports.TaskRepository = TaskRepository;
