import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  public getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAllUsers();
    res.status(200).json(users);
  };
}
