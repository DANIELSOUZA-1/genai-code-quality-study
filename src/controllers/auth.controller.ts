import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.authService.register(req.body);
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user,
    });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);
    res.status(200).json(result);
  };
}
