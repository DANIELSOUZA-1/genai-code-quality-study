import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository.js';
import { CreateUserDTO, LoginResponseDTO, UserResponseDTO } from '../models/user.model.js';
import { AppError } from '../utils/custom-error.js';
import { generateToken } from '../utils/jwt.js';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new AppError('Este endereço de e-mail já está cadastrado', 409);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  public async login(email: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const userResponse: UserResponseDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    return {
      user: userResponse,
      token,
    };
  }
}
