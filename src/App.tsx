import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Playout from './pages/Playout';
import Home from './pages/Home';
import { GlobalStyle } from './Style/PlayoutStyle';
import AdminPanel from './pages/AdminPanel';
// import AdminSlides from './pages/AdminSlides';
import Login from './pages/Login'
import NewFeeds from './pages/NewFeeds';
import Introduce from './pages/introduce';
import Project from './pages/Project';
import PostCreate from './pages/PostCreate';
import PostDetail from './Component/PostDetail';
import Event from './pages/event';
import Contact from './pages/Contact';
const App: React.FC = () => {
   return (
      <BrowserRouter>
         <GlobalStyle />
         <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Playout />}>
               <Route index element={<Navigate to="/home" replace />} />
               <Route path="home"       element={<Home />} />
               <Route path="introduce" element={<Introduce />} />
               <Route path="du-an" element={<Project />}/>
               <Route path="su-kien" element={<Event />}/>
               <Route path="lien-he" element={<Contact />}/>
               <Route path="dang-bai" element={<PostCreate />}/>
               <Route path="/post/:id" element={<PostDetail />} />
               <Route path="panels"     element={<AdminPanel />} />
               {/* <Route path="slides"     element={<AdminSlides />} /> */}
               <Route path="news-feeds" element={<NewFeeds />} />
            </Route>
         </Routes>
      </BrowserRouter>

   );
}

export default App;
