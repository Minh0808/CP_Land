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
import Contact from './pages/Contact';
import CreateNewFeeds from './pages/createNewFeeds';
// import NewFeedsList from './Component/NewFeedsList';
import NewFeedsDetail from './pages/NewFeedsDetail';
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
               <Route path="lien-he" element={<Contact />}/>
               <Route path="dang-bai" element={<PostCreate />}/>
               <Route path="du-an/:id" element={<PostDetail />} />
               <Route path="panels"     element={<AdminPanel />} />
               <Route path="news-feeds" element={<NewFeeds />} />
               <Route path="dang-tin-tuc" element={<CreateNewFeeds />} />
               <Route path="tin-tuc" element={<NewFeeds />} />
               <Route path="tin-tuc/:id" element={<NewFeedsDetail />} />
            </Route>
         </Routes>
      </BrowserRouter>

   );
}

export default App;
