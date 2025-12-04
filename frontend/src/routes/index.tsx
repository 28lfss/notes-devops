import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { NotesPage } from '../features/notes/NotesPage';
import { ProtectedRoute } from './ProtectedRoute';

const FRONTEND_PREFIX = import.meta.env.VITE_FRONTEND_PREFIX || '';
const normalizedPrefix = FRONTEND_PREFIX 
  ? (FRONTEND_PREFIX.startsWith('/') 
      ? FRONTEND_PREFIX.replace(/\/$/, '') 
      : `/${FRONTEND_PREFIX.replace(/\/$/, '')}`)
  : '';

export const AppRoutes = () => {
  return (
    <BrowserRouter basename={normalizedPrefix}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

