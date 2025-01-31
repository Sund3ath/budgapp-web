import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './lib/AuthProvider';
import App from './App.tsx';
import './index.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>
);
