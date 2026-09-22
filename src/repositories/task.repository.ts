import { getDatabase } from '../config/database.js';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/task.model.js';

export class TaskRepository {
  public async create(userId: number, taskData: CreateTaskDTO): Promise<Task> {
    const db = await getDatabase();
    const status = taskData.status || 'PENDING';

    const result = await db.run(
      `INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)`,
      [taskData.title, taskData.description, status, userId]
    );

    const task = await this.findById(result.lastID!);
    return task!;
  }

  public async findById(id: number): Promise<Task | null> {
    const db = await getDatabase();
    const task = await db.get<Task>(`SELECT * FROM tasks WHERE id = ?`, [id]);
    return task || null;
  }

  public async findByUserId(userId: number): Promise<Task[]> {
    const db = await getDatabase();
    const tasks = await db.all<Task[]>(
      `SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return tasks;
  }

  public async findAll(): Promise<Task[]> {
    const db = await getDatabase();
    const tasks = await db.all<Task[]>(`SELECT * FROM tasks ORDER BY created_at DESC`);
    return tasks;
  }

  public async update(id: number, taskData: UpdateTaskDTO): Promise<Task | null> {
    const db = await getDatabase();
    const currentTask = await this.findById(id);

    if (!currentTask) {
      return null;
    }

    const title = taskData.title !== undefined ? taskData.title : currentTask.title;
    const description = taskData.description !== undefined ? taskData.description : currentTask.description;
    const status = taskData.status !== undefined ? taskData.status : currentTask.status;

    await db.run(
      `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`,
      [title, description, status, id]
    );

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.run(`DELETE FROM tasks WHERE id = ?`, [id]);
    return (result.changes || 0) > 0;
  }
}
