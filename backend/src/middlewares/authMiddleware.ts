import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { UnauthorizedError } from '../domain/errors';

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId: string; // Made required since middleware ensures it's set
    }
  }
}

// Singleton AuthService instance for middleware
let authServiceInstance: AuthService | null = null;

const getAuthService = (): AuthService => {
  if (!authServiceInstance) {
    const userRepository = new UserRepository();
    authServiceInstance = new AuthService(userRepository);
  }
  return authServiceInstance;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const authService = getAuthService();
    const decoded = authService.verifyToken(token);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error); // Pass to error handler
  }
};

