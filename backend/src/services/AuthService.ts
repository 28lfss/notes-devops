import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/interfaces';
import { CreateUserInput, UserWithoutPassword } from '../domain/User';
import { ValidationError, UnauthorizedError, AppError } from '../domain/errors';

export class AuthService {
  private jwtSecret: string;

  constructor(private userRepository: IUserRepository) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('JWT_SECRET environment variable is required', 500);
    }
    this.jwtSecret = secret;
  }

  async register(input: CreateUserInput): Promise<{ user: UserWithoutPassword; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, 10);

    // Create user
    const user = await this.userRepository.create({
      email: input.email,
      passwordHash,
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as UserWithoutPassword,
      token,
    };
  }

  async login(email: string, password: string): Promise<{ user: UserWithoutPassword; token: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as UserWithoutPassword,
      token,
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '7d' });
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}

