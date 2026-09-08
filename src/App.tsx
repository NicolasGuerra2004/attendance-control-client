import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from './components/LoginView';
import { UserListView } from './components/UserListView';
import { AttendanceView } from './components/AttendanceView';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route 
          path="/users" 
          element={
            <PrivateRoute>
              <UserListView />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/attendance" 
          element={
            <PrivateRoute>
              <AttendanceView />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}