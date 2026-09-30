import { TaskRepository } from '../repositories/task.repository.js';
import { CreateTaskDTO, UpdateTaskDTO, Task } from '../models/task.model.js';
import { UserRole } from '../models/user.model.js';
import { AppError } from '../utils/custom-error.js';

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository = new TaskRepository()) {}

  public async createTask(userId: number, taskData: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.create(userId, taskData);
  }

  public async getTasks(userId: number, role: UserRole): Promise<Task[]> {
    if (role === UserRole.ADMIN) {
      return this.taskRepository.findAll();
    }
    return this.taskRepository.findByUserId(userId);
  }

  public async getTaskById(taskId: number, userId: number, role: UserRole): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    if (role !== UserRole.ADMIN && task.user_id !== userId) {
      throw new AppError('Acesso negado. Esta tarefa pertence a outro usuário', 403);
    }

    return task;
  }

  public async updateTask(
    taskId: number,
    userId: number,
    role: UserRole,
    taskData: UpdateTaskDTO
  ): Promise<Task> {
    const task = await this.getTaskById(taskId, userId, role);

    if (task.user_id !== userId) {
      throw new AppError('Acesso negado. Você não pode modificar tarefas de outros usuários', 403);
    }

    const updatedTask = await this.taskRepository.update(task.id, taskData);
    return updatedTask!;
  }

  public async deleteTask(taskId: number, userId: number, role: UserRole): Promise<void> {
    const task = await this.getTaskById(taskId, userId, role);

    if (task.user_id !== userId) {
      throw new AppError('Acesso negado. Você não pode excluir tarefas de outros usuários', 403);
    }

    await this.taskRepository.delete(taskId);
  }
}
