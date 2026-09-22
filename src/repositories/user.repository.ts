import { getDatabase } from '../config/database.js';
import { User, CreateUserDTO, UserResponseDTO } from '../models/user.model.js';

export class UserRepository {
  public async create(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const db = await getDatabase();
    const role = userData.role || 'USER';

    const result = await db.run(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [userData.name, userData.email, userData.password, role]
    );

    const userId = result.lastID!;
    const user = await this.findById(userId);
    return user!;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.get<User>(`SELECT * FROM users WHERE email = ?`, [email]);
    return user || null;
  }

  public async findById(id: number): Promise<UserResponseDTO | null> {
    const db = await getDatabase();
    const user = await db.get<UserResponseDTO>(
      `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
      [id]
    );
    return user || null;
  }

  public async findAll(): Promise<UserResponseDTO[]> {
    const db = await getDatabase();
    const users = await db.all<UserResponseDTO[]>(
      `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`
    );
    return users;
  }
}
