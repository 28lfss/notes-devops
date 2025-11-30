import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../domain/errors';
import Dependencies from '../config/dependencies';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    const authService = Dependencies.getAuthService();
    const decoded = authService.verifyToken(token);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

