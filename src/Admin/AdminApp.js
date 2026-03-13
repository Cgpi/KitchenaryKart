import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ── Admin auth — moved from /components to /Admin/auth ────────────
import AdminLogin from './auth/AdminLogin';
import ForgotPassword from './auth/AdminForgotPassword';
import AdminPrivateRoute from './auth/AdminPrivateRoute';

import AdminPanel from './AdminPanel';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';

const AdminApp = () => {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/admin/*"
            element={
              <AdminPrivateRoute>
                <AdminPanel />
              </AdminPrivateRoute>
            }
          />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
};

export default AdminApp;
