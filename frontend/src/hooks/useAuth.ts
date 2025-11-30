import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export const useAuth = (redirectTo: string = '/login') => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  return {
    isAuthenticated: api.isAuthenticated(),
    logout: () => {
      api.logout();
      navigate(redirectTo, { replace: true });
    },
  };
};

