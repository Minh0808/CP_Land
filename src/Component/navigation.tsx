// src/components/Navigation.tsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import IconLogo from "../assets/Logo.png";
import { styled } from 'styled-components';
import { FaEnvelope, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { AuthContext } from '../Contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [openAdminMenu, setOpenAdminMenu] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Ẩn submenu admin khi click ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (openAdminMenu && adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setOpenAdminMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openAdminMenu]);



  return (
    <Background>
      <Link to="/home">
        <LogoImg src={IconLogo} alt="Logo CP Land" />
      </Link>

      <Nav>
        <NavLink to="/home">TRANG CHỦ</NavLink>
        <NavLink to="/introduce">GIỚI THIỆU</NavLink>
        <NavLink to="/du-an">DỰ ÁN</NavLink>
        <NavLink to="/su-kien">SỰ KIỆN</NavLink>
        <NavLink to="/news-feeds">TIN TỨC</NavLink>
        <NavLink to="/lien-he">LIÊN HỆ</NavLink>

        {user?.role === 'admin' && (
          <AdminMenu ref={adminRef}>
            <MenuButton onClick={() => setOpenAdminMenu(o => !o)}>
              ADMIN ▾
            </MenuButton>
            {openAdminMenu && (
              <Submenu>
                <NavLink to="/panels" onClick={() => setOpenAdminMenu(false)}>Thêm Panel</NavLink>
                <NavLink to="/slides" onClick={() => setOpenAdminMenu(false)}>Thêm Slide</NavLink>
                <NavLink to="/dang-bai" onClick={() => setOpenAdminMenu(false)}>Đăng Bài</NavLink>
              </Submenu>
            )}
          </AdminMenu>
        )}

        {user?.role === 'user' && (
          <NavLink to="/new">Đăng Bài</NavLink>
        )}
      </Nav>

      <Social>
         {!loading && (
            user
               ? <>
                  <Greeting>Xin chào, {user.name}</Greeting>
                  <Logout onClick={() => { logout(); navigate('/home'); }}>ĐĂNG XUẤT</Logout>
               </>
               : <NavLink to="/login">ĐĂNG NHẬP</NavLink>
         )}

         {/* <Link to="/"><FaFacebookF size={20} /></Link>
         <Link to="/"><FaInstagram size={20} /></Link>
         <Link to="/"><FaTwitter size={20} /></Link>
         <Link to="/"><FaEnvelope size={20} /></Link> */}
      </Social>
    </Background>
  );
};

export default Navigation;

/** Styled Components riêng nếu cần **/
const Background = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 250px;
  padding: 0 20px;
  background-color: #b38055;
  height: 65px;
  z-index: 2;
`;
const LogoImg = styled.img`
  /* width: 200px;
  height: 100px; */
  width: 120px;
  height: 70px;
  position: absolute;
  top: 1%;
  left: 5rem;
`;
const Nav = styled.nav`
  display: flex;
  gap: 25px;
  align-items: center;
  a {
    color: white;
    font-weight: bold;
    text-decoration: none;
    &:hover { opacity: 0.8; }
  }
`;
const Social = styled.div`
   display: flex;
   gap: 10px;
   align-items: center;
   a {
      color: white;
      text-decoration: none;
      font-weight: bold;
      &:hover { 
         color: blue;
      }
   }
`;
const Greeting = styled.span`
  color: white;
  margin-right: 12px;
  font-weight: bold;
`;
const Logout = styled.button`
   background: none;
   border: none;
   color: white;
   font-size: 16px;
   font-weight: bold;
   font-family: 'Times New Roman', Times, serif;
   cursor: pointer;
   &:hover { 
      color: blue;
   }
`
const Submenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 160px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 10;

  a {
    display: block;
    padding: 0.5rem 1rem;
    color: #333;
    text-decoration: none;
  }
  a:hover {
    background: #f5f5f5;
  }
`
const MenuButton = styled.button`
   background: none;
   border: none;
   color: white;
   font-weight: bold;
   font-family: 'Times New Roman', Times, serif;
   font-size: 16px;
   cursor: pointer;
   padding: 0.5rem 1rem;
   &:hover { 
      color: blue;
   }
`
const AdminMenu = styled.div`
  position: relative;
  display: inline-block;
`