import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Playout from './pages/Playout';
import Home from './pages/Home';
import Slide from './pages/AdminSlides'
import { GlobalStyle } from './Style/PlayoutStyle';
import Panel from './pages/AdminPanel'

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Playout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="slide" element={<Slide />} />
        <Route path="panel" element={<Panel />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
