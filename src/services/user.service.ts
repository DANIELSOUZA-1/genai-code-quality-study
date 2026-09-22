import { UserRepository } from '../repositories/user.repository.js';
import { UserResponseDTO } from '../models/user.model.js';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getAllUsers(): Promise<UserResponseDTO[]> {
    return this.userRepository.findAll();
  }
}
