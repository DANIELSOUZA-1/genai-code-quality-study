import { UserRepository } from '../repositories/user.repository.js';
import { UserResponseDTO } from '../models/user.model.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  public async getAllUsers(): Promise<UserResponseDTO[]> {
    return this.userRepository.findAll();
  }
}
