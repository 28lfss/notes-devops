import { UserRepository } from '../repositories/UserRepository';
import { NoteRepository } from '../repositories/NoteRepository';
import { AuthService } from '../services/AuthService';
import { NoteService } from '../services/NoteService';
import { AuthController } from '../controllers/authController';
import { NoteController } from '../controllers/noteController';

/**
 * Dependency Factory
 * Centralizes dependency creation for consistency across the application
 * In a larger app, consider using a DI container (e.g., Inversify, TSyringe)
 */
class Dependencies {
  private static _userRepository: UserRepository | null = null;
  private static _noteRepository: NoteRepository | null = null;
  private static _authService: AuthService | null = null;
  private static _noteService: NoteService | null = null;
  private static _authController: AuthController | null = null;
  private static _noteController: NoteController | null = null;

  static getUserRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository();
    }
    return this._userRepository;
  }

  static getNoteRepository(): NoteRepository {
    if (!this._noteRepository) {
      this._noteRepository = new NoteRepository();
    }
    return this._noteRepository;
  }

  static getAuthService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService(this.getUserRepository());
    }
    return this._authService;
  }

  static getNoteService(): NoteService {
    if (!this._noteService) {
      this._noteService = new NoteService(this.getNoteRepository());
    }
    return this._noteService;
  }

  static getAuthController(): AuthController {
    if (!this._authController) {
      this._authController = new AuthController(this.getAuthService());
    }
    return this._authController;
  }

  static getNoteController(): NoteController {
    if (!this._noteController) {
      this._noteController = new NoteController(this.getNoteService());
    }
    return this._noteController;
  }
}

export default Dependencies;

