import { User } from '../domain/User';
import { Note, CreateNoteInput, UpdateNoteInput } from '../domain/Note';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: { email: string; passwordHash: string }): Promise<User>;
}

export interface INoteRepository {
  findByUserId(userId: string): Promise<Note[]>;
  findById(id: string): Promise<Note | null>;
  create(input: CreateNoteInput): Promise<Note>;
  update(id: string, input: UpdateNoteInput): Promise<Note>;
  delete(id: string): Promise<void>;
}

