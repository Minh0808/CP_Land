import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Contexts/AuthContext';
import App from './App';
import './Style/global.css';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <HelmetProvider>
      <React.StrictMode>
         <AuthProvider>
            <App />
         </AuthProvider>
      </React.StrictMode>
   </HelmetProvider>
);
