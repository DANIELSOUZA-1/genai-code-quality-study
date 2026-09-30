import { Request, Response } from 'express';
import { TaskService } from '../services/task.service.js';

export class TaskController {
  constructor(private readonly taskService: TaskService = new TaskService()) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const task = await this.taskService.createTask(userId, req.body);
    res.status(201).json({
      message: 'Tarefa criada com sucesso',
      task,
    });
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const role = req.user!.role;
    const tasks = await this.taskService.getTasks(userId, role);
    res.status(200).json(tasks);
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const taskId = Number.parseInt(req.params.id, 10);
    const userId = req.user!.id;
    const role = req.user!.role;

    const task = await this.taskService.getTaskById(taskId, userId, role);
    res.status(200).json(task);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const taskId = Number.parseInt(req.params.id, 10);
    const userId = req.user!.id;
    const role = req.user!.role;

    const task = await this.taskService.updateTask(taskId, userId, role, req.body);
    res.status(200).json({
      message: 'Tarefa atualizada com sucesso',
      task,
    });
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const taskId = Number.parseInt(req.params.id, 10);
    const userId = req.user!.id;
    const role = req.user!.role;

    await this.taskService.deleteTask(taskId, userId, role);
    res.status(200).json({
      message: 'Tarefa excluída com sucesso',
    });
  };
}
