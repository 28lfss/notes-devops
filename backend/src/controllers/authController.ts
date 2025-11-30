import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await this.authService.register({ email, password });
      res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(400).json({ error: message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(401).json({ error: message });
    }
  };
}

