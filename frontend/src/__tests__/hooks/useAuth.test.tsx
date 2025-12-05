import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../api/client';

// Mock the API
vi.mock('../../api/client', () => ({
  api: {
    isAuthenticated: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return isAuthenticated true when user is authenticated', () => {
    vi.mocked(api.isAuthenticated).mockReturnValue(true);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', async () => {
    vi.mocked(api.isAuthenticated).mockReturnValue(false);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('should redirect to custom path when provided', async () => {
    vi.mocked(api.isAuthenticated).mockReturnValue(false);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    renderHook(() => useAuth('/custom-login'), { wrapper });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/custom-login', { replace: true });
    });
  });

  it('should logout and redirect when logout is called', () => {
    vi.mocked(api.isAuthenticated).mockReturnValue(true);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.logout();

    expect(api.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});

