export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

