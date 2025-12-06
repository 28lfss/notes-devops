import { NoteService } from '../../services/NoteService';
import { INoteRepository } from '../../repositories/interfaces';
import { Note } from '../../domain/Note';
import { NotFoundError, ForbiddenError } from '../../domain/errors';

describe('NoteService', () => {
  let noteService: NoteService;
  let mockNoteRepository: jest.Mocked<INoteRepository>;

  beforeEach(() => {
    mockNoteRepository = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    noteService = new NoteService(mockNoteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listNotes', () => {
    it('should return all notes for a user', async () => {
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
        {
          id: '2',
          title: 'Note 2',
          content: 'Content 2',
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockNoteRepository.findByUserId.mockResolvedValue(mockNotes);

      const result = await noteService.listNotes(userId);

      expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockNotes);
    });
  });

  describe('getNoteById', () => {
    it('should return note if it belongs to user', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const mockNote: Note = {
        id: noteId,
        title: 'Test Note',
        content: 'Test Content',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNoteRepository.findById.mockResolvedValue(mockNote);

      const result = await noteService.getNoteById(noteId, userId);

      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundError if note does not exist', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';

      mockNoteRepository.findById.mockResolvedValue(null);

      await expect(noteService.getNoteById(noteId, userId)).rejects.toThrow(NotFoundError);
      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
    });

    it('should throw ForbiddenError if note belongs to different user', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const otherUserId = 'user-2';
      const mockNote: Note = {
        id: noteId,
        title: 'Test Note',
        content: 'Test Content',
        userId: otherUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNoteRepository.findById.mockResolvedValue(mockNote);

      await expect(noteService.getNoteById(noteId, userId)).rejects.toThrow(ForbiddenError);
      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const input = {
        title: 'New Note',
        content: 'New Content',
        userId: 'user-1',
      };
      const mockNote: Note = {
        id: 'note-1',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNoteRepository.create.mockResolvedValue(mockNote);

      const result = await noteService.createNote(input);

      expect(mockNoteRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockNote);
    });
  });

  describe('updateNote', () => {
    it('should update note if it belongs to user', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const updateInput = { title: 'Updated Title' };
      const existingNote: Note = {
        id: noteId,
        title: 'Original Title',
        content: 'Content',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedNote: Note = {
        ...existingNote,
        title: 'Updated Title',
        updatedAt: new Date(),
      };

      mockNoteRepository.findById.mockResolvedValue(existingNote);
      mockNoteRepository.update.mockResolvedValue(updatedNote);

      const result = await noteService.updateNote(noteId, userId, updateInput);

      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
      expect(mockNoteRepository.update).toHaveBeenCalledWith(noteId, updateInput);
      expect(result).toEqual(updatedNote);
    });

    it('should throw NotFoundError if note does not exist', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const updateInput = { title: 'Updated Title' };

      mockNoteRepository.findById.mockResolvedValue(null);

      await expect(noteService.updateNote(noteId, userId, updateInput)).rejects.toThrow(NotFoundError);
      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
      expect(mockNoteRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError if note belongs to different user', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const otherUserId = 'user-2';
      const updateInput = { title: 'Updated Title' };
      const existingNote: Note = {
        id: noteId,
        title: 'Original Title',
        content: 'Content',
        userId: otherUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNoteRepository.findById.mockResolvedValue(existingNote);

      await expect(noteService.updateNote(noteId, userId, updateInput)).rejects.toThrow(ForbiddenError);
      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
      expect(mockNoteRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteNote', () => {
    it('should delete note if it belongs to user', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const existingNote: Note = {
        id: noteId,
        title: 'Test Note',
        content: 'Content',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNoteRepository.findById.mockResolvedValue(existingNote);
      mockNoteRepository.delete.mockResolvedValue(undefined);

      await noteService.deleteNote(noteId, userId);

      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
      expect(mockNoteRepository.delete).toHaveBeenCalledWith(noteId);
    });

    it('should throw NotFoundError if note does not exist', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';

      mockNoteRepository.findById.mockResolvedValue(null);

      await expect(noteService.deleteNote(noteId, userId)).rejects.toThrow(NotFoundError);
      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
      expect(mockNoteRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError if note belongs to different user', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const otherUserId = 'user-2';
      const existingNote: Note = {
        id: noteId,
        title: 'Test Note',
        content: 'Content',
        userId: otherUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNoteRepository.findById.mockResolvedValue(existingNote);

      await expect(noteService.deleteNote(noteId, userId)).rejects.toThrow(ForbiddenError);
      expect(mockNoteRepository.findById).toHaveBeenCalledWith(noteId);
      expect(mockNoteRepository.delete).not.toHaveBeenCalled();
    });
  });
});

