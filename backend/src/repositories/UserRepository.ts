import prisma from './prismaClient';
import { User, CreateUserInput } from '../domain/User';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async create(input: CreateUserInput & { passwordHash: string }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
      },
    });
    return user;
  }
}

