import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {

  // Start as null — never trust localStorage directly
  const [adminToken, setAdminToken] = useState(null);

  // true while we're verifying any stored token on app load
  const [isVerifying, setIsVerifying] = useState(true);

  const navigate = useNavigate();

  /**
   * On mount: if a token exists in localStorage, verify it is still
   * accepted by the backend by hitting a protected endpoint.
   * If the server rejects it (401/403) → clear it and force login.
   * This stops stale/expired tokens from bypassing the admin guard.
   */
  useEffect(() => {
    const verifyStoredToken = async () => {
      const storedToken = localStorage.getItem('adminToken');

      if (!storedToken) {
        setIsVerifying(false);
        return;
      }

      try {
        // Use an existing protected endpoint to validate the token.
        // /category/index requires x-Authorization header — perfect for a ping.
        const BASE = process.env.REACT_APP_API_BASE_URL;
        const res = await fetch(`${BASE}/category/index`, {
          method: 'GET',
          headers: { 'x-Authorization': `Bearer ${storedToken}` },
        });

        if (res.ok || res.status === 200) {
          // Token still accepted by server — restore session
          setAdminToken(storedToken);
        } else {
          // 401 / 403 / other → token expired or invalid
          localStorage.removeItem('adminToken');
          setAdminToken(null);
        }
      } catch {
        // Network error — to be safe, do NOT grant access
        localStorage.removeItem('adminToken');
        setAdminToken(null);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyStoredToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Login ─────────────────────────────────────────────────────── */
  const adminLogin = async (login, password) => {
    try {
      const params = new URLSearchParams();
      params.append("login", login);
      params.append("password", password);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Authentication/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.data.access_token;
        setAdminToken(accessToken);
        localStorage.setItem('adminToken', accessToken);
        navigate('/admin');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch {
      alert('Login failed. Please check your connection.');
    }
  };

  /* ── Logout ────────────────────────────────────────────────────── */
  const adminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const isAdminAuthenticated = !!adminToken;

  return (
    <AdminAuthContext.Provider
      value={{ adminToken, adminLogin, adminLogout, isAdminAuthenticated, isVerifying }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  return context;
};
