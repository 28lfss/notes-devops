import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../domain/errors';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new ValidationError('Email and password must be strings');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new ValidationError('Email and password must be strings');
  }

  next();
};

export const validateCreateNote = (req: Request, res: Response, next: NextFunction): void => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ValidationError('Title and content are required');
  }

  if (typeof title !== 'string' || typeof content !== 'string') {
    throw new ValidationError('Title and content must be strings');
  }

  if (title.trim().length === 0 || content.trim().length === 0) {
    throw new ValidationError('Title and content cannot be empty');
  }

  next();
};

