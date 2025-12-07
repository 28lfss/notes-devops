import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';
import { asyncHandler } from '../middlewares/errorHandler';

export class NoteController {
  constructor(private noteService: NoteService) {}

  /**
   * @swagger
   * /notes:
   *   get:
   *     summary: Get all user's notes
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of user's notes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Note'
   *             example:
   *               - id: "123e4567-e89b-12d3-a456-426614174000"
   *                 title: "My First Note"
   *                 content: "This is the content of my note."
   *                 userId: "123e4567-e89b-12d3-a456-426614174000"
   *                 createdAt: "2024-01-01T00:00:00.000Z"
   *                 updatedAt: "2024-01-01T00:00:00.000Z"
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               error: "Unauthorized"
   */
  listNotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    const notes = await this.noteService.listNotes(userId);
    res.status(200).json(notes);
  });

  /**
   * @swagger
   * /notes/{id}:
   *   get:
   *     summary: Get a specific note by ID
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Note ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Note details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Note'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - Note doesn't belong to user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               error: "You don't have access to this note"
   *       404:
   *         description: Note not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               error: "Note not found"
   */
  getNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.userId;
    const note = await this.noteService.getNoteById(id, userId);
    res.status(200).json(note);
  });

  /**
   * @swagger
   * /notes:
   *   post:
   *     summary: Create a new note
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateNoteRequest'
   *           examples:
   *             example1:
   *               value:
   *                 title: "My First Note"
   *                 content: "This is the content of my note."
   *     responses:
   *       201:
   *         description: Note successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Note'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               error: "Title and content are required"
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  createNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { title, content } = req.body;
    const userId = req.userId;
    const note = await this.noteService.createNote({ title, content, userId });
    res.status(201).json(note);
  });

  /**
   * @swagger
   * /notes/{id}:
   *   put:
   *     summary: Update a note
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Note ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateNoteRequest'
   *           examples:
   *             example1:
   *               value:
   *                 title: "Updated Note Title"
   *                 content: "Updated note content."
   *     responses:
   *       200:
   *         description: Note successfully updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Note'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               error: "At least one field must be provided"
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - Note doesn't belong to user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Note not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  updateNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;
    const note = await this.noteService.updateNote(id, userId, { title, content });
    res.status(200).json(note);
  });

  /**
   * @swagger
   * /notes/{id}:
   *   delete:
   *     summary: Delete a note
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Note ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       204:
   *         description: Note successfully deleted
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - Note doesn't belong to user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Note not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  deleteNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.userId;
    await this.noteService.deleteNote(id, userId);
    res.status(204).send();
  });
}

