import { Request, Response } from 'express';
import { AuthController } from '../../controllers/authController';
import { AuthService } from '../../services/AuthService';
import { ValidationError, UnauthorizedError } from '../../domain/errors';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: Partial<jest.Mocked<AuthService>>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      verifyToken: jest.fn(),
    };

    authController = new AuthController(mockAuthService as AuthService);

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user and return 201 with user and token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockResult = {
        user: {
          id: '1',
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'jwt-token',
      };

      mockRequest.body = { email, password };
      mockAuthService.register.mockResolvedValue(mockResult);

      await authController.register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.register).toHaveBeenCalledWith({ email, password });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if registration fails', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const error = new ValidationError('User already exists');

      mockRequest.body = { email, password };
      mockAuthService.register.mockRejectedValue(error);

      authController.register(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Wait for asyncHandler to catch the error and call next
      await new Promise(resolve => setImmediate(resolve));

      expect(mockAuthService.register).toHaveBeenCalledWith({ email, password });
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login user and return 200 with user and token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockResult = {
        user: {
          id: '1',
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'jwt-token',
      };

      mockRequest.body = { email, password };
      mockAuthService.login.mockResolvedValue(mockResult);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.login).toHaveBeenCalledWith(email, password);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if login fails', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';
      const error = new UnauthorizedError('Invalid credentials');

      mockRequest.body = { email, password };
      mockAuthService.login.mockRejectedValue(error);

      authController.login(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Wait for asyncHandler to catch the error and call next
      await new Promise(resolve => setImmediate(resolve));

      expect(mockAuthService.login).toHaveBeenCalledWith(email, password);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

