import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { asyncHandler } from '../middlewares/errorHandler';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *           examples:
   *             example1:
   *               value:
   *                 email: user@example.com
   *                 password: password123
   *     responses:
   *       201:
   *         description: User successfully registered
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *             example:
   *               user:
   *                 id: "123e4567-e89b-12d3-a456-426614174000"
   *                 email: user@example.com
   *                 createdAt: "2024-01-01T00:00:00.000Z"
   *                 updatedAt: "2024-01-01T00:00:00.000Z"
   *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       400:
   *         description: Validation error or email already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               error: "Email already exists"
   */
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await this.authService.register({ email, password });
    res.status(201).json(result);
  });

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *           examples:
   *             example1:
   *               value:
   *                 email: user@example.com
   *                 password: password123
   *     responses:
   *       200:
   *         description: User successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *             example:
   *               user:
   *                 id: "123e4567-e89b-12d3-a456-426614174000"
   *                 email: user@example.com
   *                 createdAt: "2024-01-01T00:00:00.000Z"
   *                 updatedAt: "2024-01-01T00:00:00.000Z"
   *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               error: "Invalid email or password"
   */
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);
    res.status(200).json(result);
  });
}

