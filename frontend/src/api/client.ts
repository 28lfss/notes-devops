import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(
      errorData.error || response.statusText,
      response.status,
      response.statusText
    );
  }

  return response;
};

export const api = {
  // Auth
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiError(
        errorData.error || response.statusText,
        response.status,
        response.statusText
      );
    }

    const data: AuthResponse = await response.json();
    setAuthToken(data.token);
    return data;
  },

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiError(
        errorData.error || response.statusText,
        response.status,
        response.statusText
      );
    }

    const data: AuthResponse = await response.json();
    setAuthToken(data.token);
    return data;
  },

  logout(): void {
    removeAuthToken();
  },

  isAuthenticated(): boolean {
    return getAuthToken() !== null;
  },

  // Notes
  async getNotes(): Promise<Note[]> {
    const response = await fetchWithAuth('/notes');
    return response.json();
  },

  async getNote(id: string): Promise<Note> {
    const response = await fetchWithAuth(`/notes/${id}`);
    return response.json();
  },

  async createNote(note: CreateNoteRequest): Promise<Note> {
    const response = await fetchWithAuth('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    return response.json();
  },

  async updateNote(id: string, note: UpdateNoteRequest): Promise<Note> {
    const response = await fetchWithAuth(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
    return response.json();
  },

  async deleteNote(id: string): Promise<void> {
    await fetchWithAuth(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};

