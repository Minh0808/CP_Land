import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Contexts/AuthContext';
import App from './App';
import './Style/global.css';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <AuthProvider>
         <App />
      </AuthProvider>
   </React.StrictMode>
);
