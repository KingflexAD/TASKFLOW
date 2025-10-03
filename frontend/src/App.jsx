// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PendingPage from './pages/PendingPage';
import CompletedPage from './pages/CompletedPage';
import Profile from './pages/Profile';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser');
  }, [currentUser]);

  // ✅ Your function instead of setSession
  const handleAuthSubmit = (data) => {
    const user = {
      email: data.user.email,
      name: data.user.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || 'User')}&background=random`
    };
    setCurrentUser(user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user?.id || '');
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    toast.info('Logged out');
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login onSubmit={handleAuthSubmit} />} />
        <Route path="/signup" element={<Signup onSubmit={handleAuthSubmit} />} />

        <Route
          path="/"
          element={
            currentUser ? (
              <Layout currentUser={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pending" element={<PendingPage />} />
          <Route path="complete" element={<CompletedPage />} />
          <Route
            path="profile"
            element={
              <Profile
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                onLogout={handleLogout}
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
      </Routes>
    </>
  );
}
