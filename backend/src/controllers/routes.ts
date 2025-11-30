import { Router } from 'express';
import { AuthController } from './authController';
import { NoteController } from './noteController';
import { AuthService } from '../services/AuthService';
import { NoteService } from '../services/NoteService';
import { UserRepository } from '../repositories/UserRepository';
import { NoteRepository } from '../repositories/NoteRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRegister, validateLogin, validateCreateNote } from '../middlewares/validation';

const router = Router();

// Initialize dependencies (in a real app, use a DI container)
const userRepository = new UserRepository();
const noteRepository = new NoteRepository();
const authService = new AuthService(userRepository);
const noteService = new NoteService(noteRepository);

const authController = new AuthController(authService);
const noteController = new NoteController(noteService);

// Auth routes (public)
router.post('/auth/register', validateRegister, authController.register);
router.post('/auth/login', validateLogin, authController.login);

// Note routes (protected)
router.get('/notes', authMiddleware, noteController.listNotes);
router.get('/notes/:id', authMiddleware, noteController.getNote);
router.post('/notes', authMiddleware, validateCreateNote, noteController.createNote);
router.put('/notes/:id', authMiddleware, noteController.updateNote);
router.delete('/notes/:id', authMiddleware, noteController.deleteNote);

export default router;

