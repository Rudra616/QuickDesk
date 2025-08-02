import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // No curly braces for default import
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);