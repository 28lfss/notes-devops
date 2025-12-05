import { Request, Response } from 'express';
import { NoteController } from '../../controllers/noteController';
import { NoteService } from '../../services/NoteService';
import { Note } from '../../domain/Note';
import { NotFoundError, ForbiddenError } from '../../domain/errors';

describe('NoteController', () => {
  let noteController: NoteController;
  let mockNoteService: jest.Mocked<NoteService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockNoteService = {
      listNotes: jest.fn(),
      getNoteById: jest.fn(),
      createNote: jest.fn(),
      updateNote: jest.fn(),
      deleteNote: jest.fn(),
    } as any;

    noteController = new NoteController(mockNoteService);

    mockRequest = {
      body: {},
      params: {},
      userId: 'user-1',
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listNotes', () => {
    it('should return all notes for user', async () => {
      const userId = 'user-1';
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRequest.userId = userId;
      mockNoteService.listNotes.mockResolvedValue(mockNotes);

      await noteController.listNotes(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNoteService.listNotes).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNotes);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('getNote', () => {
    it('should return note by id', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const mockNote: Note = {
        id: noteId,
        title: 'Test Note',
        content: 'Content',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: noteId };
      mockRequest.userId = userId;
      mockNoteService.getNoteById.mockResolvedValue(mockNote);

      await noteController.getNote(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNoteService.getNoteById).toHaveBeenCalledWith(noteId, userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNote);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if note not found', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const error = new NotFoundError('Note not found');

      mockRequest.params = { id: noteId };
      mockRequest.userId = userId;
      mockNoteService.getNoteById.mockRejectedValue(error);

      noteController.getNote(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Wait for asyncHandler to catch the error and call next
      await new Promise(resolve => setImmediate(resolve));

      expect(mockNoteService.getNoteById).toHaveBeenCalledWith(noteId, userId);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const userId = 'user-1';
      const title = 'New Note';
      const content = 'New Content';
      const mockNote: Note = {
        id: 'note-1',
        title,
        content,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = { title, content };
      mockRequest.userId = userId;
      mockNoteService.createNote.mockResolvedValue(mockNote);

      await noteController.createNote(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNoteService.createNote).toHaveBeenCalledWith({ title, content, userId });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNote);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const title = 'Updated Title';
      const content = 'Updated Content';
      const mockNote: Note = {
        id: noteId,
        title,
        content,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: noteId };
      mockRequest.body = { title, content };
      mockRequest.userId = userId;
      mockNoteService.updateNote.mockResolvedValue(mockNote);

      await noteController.updateNote(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNoteService.updateNote).toHaveBeenCalledWith(noteId, userId, { title, content });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNote);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if note not found', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const error = new NotFoundError('Note not found');

      mockRequest.params = { id: noteId };
      mockRequest.body = { title: 'Updated Title' };
      mockRequest.userId = userId;
      mockNoteService.updateNote.mockRejectedValue(error);

      noteController.updateNote(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Wait for asyncHandler to catch the error and call next
      await new Promise(resolve => setImmediate(resolve));

      expect(mockNoteService.updateNote).toHaveBeenCalledWith(noteId, userId, { title: 'Updated Title' });
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';

      mockRequest.params = { id: noteId };
      mockRequest.userId = userId;
      mockNoteService.deleteNote.mockResolvedValue(undefined);

      await noteController.deleteNote(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNoteService.deleteNote).toHaveBeenCalledWith(noteId, userId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if note not found', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const error = new NotFoundError('Note not found');

      mockRequest.params = { id: noteId };
      mockRequest.userId = userId;
      mockNoteService.deleteNote.mockRejectedValue(error);

      noteController.deleteNote(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Wait for asyncHandler to catch the error and call next
      await new Promise(resolve => setImmediate(resolve));

      expect(mockNoteService.deleteNote).toHaveBeenCalledWith(noteId, userId);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

