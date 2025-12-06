import { AuthService } from '../../services/AuthService';
import { IUserRepository } from '../../repositories/interfaces';
import { User } from '../../domain/User';
import { ValidationError, UnauthorizedError, AppError } from '../../domain/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, JWT_SECRET: 'test-secret-key' };
    
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    authService = new AuthService(mockUserRepository);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const mockUser: User = {
        id: '1',
        email: input.email,
        passwordHash: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

      const result = await authService.register(input);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: input.email,
        passwordHash: 'hashed-password',
      });
      expect(result.user.email).toBe(input.email);
      expect(result.token).toBeDefined();
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw ValidationError if user already exists', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const existingUser: User = {
        id: '1',
        email: input.email,
        passwordHash: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(input)).rejects.toThrow(ValidationError);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser: User = {
        id: '1',
        email,
        passwordHash: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(email, password);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash);
      expect(result.user.email).toBe(email);
      expect(result.token).toBeDefined();
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw UnauthorizedError if user does not exist', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedError);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';
      const mockUser: User = {
        id: '1',
        email,
        passwordHash: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedError);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token and return userId', () => {
      const userId = 'user-123';
      const token = jwt.sign({ userId }, 'test-secret-key', { expiresIn: '7d' });

      const result = authService.verifyToken(token);

      expect(result.userId).toBe(userId);
    });

    it('should throw UnauthorizedError for invalid token', () => {
      const invalidToken = 'invalid-token';

      expect(() => authService.verifyToken(invalidToken)).toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for expired token', () => {
      const expiredToken = jwt.sign({ userId: 'user-123' }, 'test-secret-key', { expiresIn: '-1h' });

      expect(() => authService.verifyToken(expiredToken)).toThrow(UnauthorizedError);
    });
  });

  describe('constructor', () => {
    it('should throw AppError if JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;

      expect(() => new AuthService(mockUserRepository)).toThrow(AppError);
    });
  });
});

