import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { UnauthorizedError } from '../../domain/errors';
import Dependencies from '../../config/dependencies';
import { AuthService } from '../../services/AuthService';

// Mock Dependencies
jest.mock('../../config/dependencies');

describe('authMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockAuthService: Partial<jest.Mocked<AuthService>>;

  beforeEach(() => {
    mockAuthService = {
      verifyToken: jest.fn(),
    };

    (Dependencies.getAuthService as jest.Mock) = jest.fn().mockReturnValue(mockAuthService);

    mockRequest = {
      headers: {},
    };

    mockResponse = {};

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set userId and call next when token is valid', () => {
    const userId = 'user-123';
    const token = 'valid-token';

    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    mockAuthService.verifyToken.mockReturnValue({ userId });

    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockAuthService.verifyToken).toHaveBeenCalledWith(token);
    expect(mockRequest.userId).toBe(userId);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with UnauthorizedError when no authorization header', () => {
    mockRequest.headers = {};

    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockAuthService.verifyToken).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should call next with UnauthorizedError when authorization header does not start with Bearer', () => {
    mockRequest.headers = {
      authorization: 'Invalid token',
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockAuthService.verifyToken).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should call next with error when token verification fails', () => {
    const token = 'invalid-token';
    const error = new UnauthorizedError('Invalid token');

    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    mockAuthService.verifyToken.mockImplementation(() => {
      throw error;
    });

    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockAuthService.verifyToken).toHaveBeenCalledWith(token);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

