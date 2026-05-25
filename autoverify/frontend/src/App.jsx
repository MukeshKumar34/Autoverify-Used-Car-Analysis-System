import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import Toast from './components/Toast';

import Landing  from './pages/Landing';
import Login    from './pages/Login';
import Signup   from './pages/Signup';
import AppShell from './pages/AppShell';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--dark)' }}>
      <div style={{ width:44, height:44, border:'3px solid var(--border)', borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/app" replace /> : children;
}

function AppWithToast() {
  const { toasts, toast } = useToast();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login"  element={<PublicRoute><Login  toast={toast} /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup toast={toast} /></PublicRoute>} />
          <Route path="/app/*"  element={<PrivateRoute><AppShell toast={toast} /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toast toasts={toasts} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWithToast />
    </AuthProvider>
  );
}
