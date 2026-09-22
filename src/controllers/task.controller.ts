import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const task = await this.taskService.createTask(userId, req.body);
      res.status(201).json({
        message: 'Tarefa criada com sucesso',
        task,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const tasks = await this.taskService.getTasks(userId, role);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      const role = req.user!.role;

      const task = await this.taskService.getTaskById(taskId, userId, role);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      const role = req.user!.role;

      const task = await this.taskService.updateTask(taskId, userId, role, req.body);
      res.status(200).json({
        message: 'Tarefa atualizada com sucesso',
        task,
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      const role = req.user!.role;

      await this.taskService.deleteTask(taskId, userId, role);
      res.status(200).json({
        message: 'Tarefa excluída com sucesso',
      });
    } catch (error) {
      next(error);
    }
  };
}
