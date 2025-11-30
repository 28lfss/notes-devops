import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../domain/errors';

// Common validation helpers
const validateString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }
  return value;
};

const validateNonEmptyString = (value: unknown, fieldName: string): string => {
  const str = validateString(value, fieldName);
  if (str.trim().length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`);
  }
  return str;
};

const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

const validatePassword = (password: string, minLength: number = 6): void => {
  if (password.length < minLength) {
    throw new ValidationError(`Password must be at least ${minLength} characters long`);
  }
};

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const emailStr = validateNonEmptyString(email, 'Email');
  const passwordStr = validateString(password, 'Password');

  validateEmail(emailStr);
  validatePassword(passwordStr);

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  validateString(email, 'Email');
  validateString(password, 'Password');

  next();
};

export const validateCreateNote = (req: Request, res: Response, next: NextFunction): void => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ValidationError('Title and content are required');
  }

  validateNonEmptyString(title, 'Title');
  validateNonEmptyString(content, 'Content');

  next();
};

export const validateUpdateNote = (req: Request, res: Response, next: NextFunction): void => {
  const { title, content } = req.body;

  // Both fields are optional for update, but if provided, must be valid
  if (title !== undefined) {
    validateNonEmptyString(title, 'Title');
  }

  if (content !== undefined) {
    validateNonEmptyString(content, 'Content');
  }

  // At least one field must be provided
  if (title === undefined && content === undefined) {
    throw new ValidationError('At least one field (title or content) must be provided for update');
  }

  next();
};
