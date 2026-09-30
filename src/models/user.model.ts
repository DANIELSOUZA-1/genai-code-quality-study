export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface LoginResponseDTO {
  user: UserResponseDTO;
  token: string;
}
