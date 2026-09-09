import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Reports } from './pages/Reports';
import { Assist } from './pages/Assist';
import { authService } from './services/auth.service';
import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return localStorage.getItem('token') ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: ReactNode }) => {
  if (!authService.isAuthenticated()) return <Navigate to="/login" replace />;
  return authService.isAdmin() ? <>{children}</> : <Navigate to="/assist" replace />;
};

const HomeRedirect = () => {
  if (!authService.isAuthenticated()) return <Navigate to="/login" replace />;
  return <Navigate to={authService.isAdmin() ? '/dashboard' : '/assist'} replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />
        <Route path="/assist" element={<ProtectedRoute><Assist /></ProtectedRoute>} />
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;