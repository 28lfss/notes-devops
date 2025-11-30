import { Router } from 'express';
import { AuthController } from './authController';
import { NoteController } from './noteController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();
const noteController = new NoteController();

// Auth routes (public)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Note routes (protected)
router.get('/notes', authMiddleware, noteController.listNotes);
router.get('/notes/:id', authMiddleware, noteController.getNote);
router.post('/notes', authMiddleware, noteController.createNote);
router.put('/notes/:id', authMiddleware, noteController.updateNote);
router.delete('/notes/:id', authMiddleware, noteController.deleteNote);

export default router;

