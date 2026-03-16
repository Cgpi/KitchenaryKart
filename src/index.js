import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminApp from './Admin/AdminApp';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import { validateEnvironment } from './config/validateEnv';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Validate environment variables before app runs
try {
  validateEnvironment();
} catch (error) {
  // Display error message to user
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#fff3cd',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#856404', marginBottom: '20px' }}>⚠️ Configuration Error</h1>
      <p style={{ color: '#856404', fontSize: '16px', maxWidth: '600px', lineHeight: '1.6' }}>
        Missing required environment variables. Please check the console for details.
      </p>
      <p style={{ color: '#856404', fontSize: '14px' }}>
        📋 See <code>.env.example</code> for required variables
      </p>
    </div>
  );
  throw error;
}

const isAdminRoute = window.location.pathname.startsWith('/admin');
const SelectedApp = isAdminRoute ? <AdminApp /> : <App />;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      {SelectedApp}
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
