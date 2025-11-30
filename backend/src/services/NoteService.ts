import { NoteRepository } from '../repositories/NoteRepository';
import { CreateNoteInput, UpdateNoteInput, Note } from '../domain/Note';

export class NoteService {
  private noteRepository: NoteRepository;

  constructor() {
    this.noteRepository = new NoteRepository();
  }

  async listNotes(userId: string): Promise<Note[]> {
    return this.noteRepository.findByUserId(userId);
  }

  async getNoteById(id: string, userId: string): Promise<Note> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new Error('Note not found');
    }
    if (note.userId !== userId) {
      throw new Error('Unauthorized: Note does not belong to user');
    }
    return note;
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    if (!input.title || !input.content) {
      throw new Error('Title and content are required');
    }
    return this.noteRepository.create(input);
  }

  async updateNote(id: string, userId: string, input: UpdateNoteInput): Promise<Note> {
    // Verify note exists and belongs to user
    await this.getNoteById(id, userId);
    return this.noteRepository.update(id, input);
  }

  async deleteNote(id: string, userId: string): Promise<void> {
    // Verify note exists and belongs to user
    await this.getNoteById(id, userId);
    await this.noteRepository.delete(id);
  }
}

