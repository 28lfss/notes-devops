import prisma from './prismaClient';
import { Note, CreateNoteInput, UpdateNoteInput } from '../domain/Note';
import { INoteRepository } from './interfaces';

export class NoteRepository implements INoteRepository {
  async findByUserId(userId: string, search?: string): Promise<Note[]> {
    const where: Parameters<typeof prisma.note.findMany>[0]['where'] = { userId };

    if (search && search.trim().length > 0) {
      const searchTerm = search.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return notes;
  }

  async findById(id: string): Promise<Note | null> {
    const note = await prisma.note.findUnique({
      where: { id },
    });
    return note;
  }

  async create(input: CreateNoteInput): Promise<Note> {
    const note = await prisma.note.create({
      data: {
        title: input.title,
        content: input.content,
        userId: input.userId,
      },
    });
    return note;
  }

  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    const note = await prisma.note.update({
      where: { id },
      data: input,
    });
    return note;
  }

  async delete(id: string): Promise<void> {
    await prisma.note.delete({
      where: { id },
    });
  }
}

