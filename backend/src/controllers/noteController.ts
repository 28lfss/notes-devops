import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';

export class NoteController {
  private noteService: NoteService;

  constructor() {
    this.noteService = new NoteService();
  }

  listNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId!; // Set by authMiddleware
      const notes = await this.noteService.listNotes(userId);
      res.status(200).json(notes);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  getNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId!; // Set by authMiddleware

      const note = await this.noteService.getNoteById(id, userId);
      res.status(200).json(note);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      const statusCode = message.includes('not found') ? 404 : message.includes('Unauthorized') ? 403 : 500;
      res.status(statusCode).json({ error: message });
    }
  };

  createNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, content } = req.body;
      const userId = req.userId!; // Set by authMiddleware

      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }

      const note = await this.noteService.createNote({ title, content, userId });
      res.status(201).json(note);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(400).json({ error: message });
    }
  };

  updateNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.userId!; // Set by authMiddleware

      const note = await this.noteService.updateNote(id, userId, { title, content });
      res.status(200).json(note);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      const statusCode = message.includes('not found') ? 404 : message.includes('Unauthorized') ? 403 : 500;
      res.status(statusCode).json({ error: message });
    }
  };

  deleteNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId!; // Set by authMiddleware

      await this.noteService.deleteNote(id, userId);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      const statusCode = message.includes('not found') ? 404 : message.includes('Unauthorized') ? 403 : 500;
      res.status(statusCode).json({ error: message });
    }
  };
}

