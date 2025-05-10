import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Playout from './pages/Playout';
import Home from './pages/Home';
import { GlobalStyle } from './Style/PlayoutStyle';
import AdminPanel from './pages/AdminPanel';
import AdminSlides from './pages/AdminSlides';
import Login from './pages/Login'
import AdminNews from './pages/AdminNews';
const App: React.FC = () => {
   return (
      <BrowserRouter>
         <GlobalStyle />
         <Routes>
         <Route path="/" element={<Playout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/panels" element={<AdminPanel />} />
            <Route path="/slides" element={<AdminSlides />} />
            <Route path="/admin/news" element={<AdminNews />} />
            
         </Route>
         </Routes>
      </BrowserRouter>
   );
}

export default App;
