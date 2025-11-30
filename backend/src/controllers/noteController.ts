import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';
import { asyncHandler } from '../middlewares/errorHandler';

export class NoteController {
  constructor(private noteService: NoteService) {}

  listNotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId; // Set by authMiddleware (now required, not optional)
    const notes = await this.noteService.listNotes(userId);
    res.status(200).json(notes);
  });

  getNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.userId; // Set by authMiddleware
    const note = await this.noteService.getNoteById(id, userId);
    res.status(200).json(note);
  });

  createNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { title, content } = req.body;
    const userId = req.userId; // Set by authMiddleware
    const note = await this.noteService.createNote({ title, content, userId });
    res.status(201).json(note);
  });

  updateNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId; // Set by authMiddleware
    const note = await this.noteService.updateNote(id, userId, { title, content });
    res.status(200).json(note);
  });

  deleteNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.userId; // Set by authMiddleware
    await this.noteService.deleteNote(id, userId);
    res.status(204).send();
  });
}

