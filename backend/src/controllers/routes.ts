import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  validateRegister,
  validateLogin,
  validateCreateNote,
  validateUpdateNote,
} from '../middlewares/validation';
import Dependencies from '../config/dependencies';

const router = Router();

const authController = Dependencies.getAuthController();
const noteController = Dependencies.getNoteController();

router.post('/auth/register', validateRegister, authController.register);
router.post('/auth/login', validateLogin, authController.login);

router.get('/notes', authMiddleware, noteController.listNotes);
router.get('/notes/:id', authMiddleware, noteController.getNote);
router.post('/notes', authMiddleware, validateCreateNote, noteController.createNote);
router.put('/notes/:id', authMiddleware, validateUpdateNote, noteController.updateNote);
router.delete('/notes/:id', authMiddleware, noteController.deleteNote);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "ok"
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;

