import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminApp from './Admin/AdminApp';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


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
