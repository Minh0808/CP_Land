// src/components/Navigation.tsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import IconLogo from '../assets/Logo.png';
import styled from 'styled-components';
import { AuthContext } from '../Contexts/AuthContext';
import { IoMenu, IoSearchOutline } from 'react-icons/io5';

function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

const Navigation: React.FC = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const width = useWindowSize();
  const isMobile = width < 768;

  // Desktop admin submenu
  const [openAdminMenu, setOpenAdminMenu] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        openAdminMenu &&
        adminRef.current &&
        !adminRef.current.contains(e.target as Node)
      ) {
        setOpenAdminMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openAdminMenu]);

  // Mobile sidebar menu
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        openMobileMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setOpenMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMobileMenu]);

  return (
    <Background>
      {!isMobile ? (
        <>
          <Link to="/home">
            <LogoImg src={IconLogo} alt="Logo CP Land" />
          </Link>

          <Nav>
            <NavLink to="/home">TRANG CHỦ</NavLink>
            <NavLink to="/introduce">GIỚI THIỆU</NavLink>
            <NavLink to="/du-an">DỰ ÁN</NavLink>
            <NavLink to="/news-feeds">TIN TỨC</NavLink>
            <NavLink to="/lien-he">LIÊN HỆ</NavLink>

            {user?.role === 'admin' && (
              <AdminMenu ref={adminRef}>
                <MenuButton onClick={() => setOpenAdminMenu(o => !o)}>
                  ADMIN ▾
                </MenuButton>
                {openAdminMenu && (
                  <Submenu>
                    <NavLink to="/panels" onClick={() => setOpenAdminMenu(false)}>
                      Thêm Panel
                    </NavLink>
                    <NavLink to="/dang-bai" onClick={() => setOpenAdminMenu(false)}>
                      Đăng Bài
                    </NavLink>
                  </Submenu>
                )}
              </AdminMenu>
            )}

            {user?.role === 'user' && (
              <NavLink to="/new">Đăng Bài</NavLink>
            )}
          </Nav>

          <Social>
            {!loading &&
              (user ? (
                <>
                  <Greeting>Xin chào, {user.name}</Greeting>
                  <Logout
                    onClick={() => {
                      logout();
                      navigate('/home');
                    }}
                  >
                    ĐĂNG XUẤT
                  </Logout>
                </>
              ) : (
                <NavLink to="/login">ĐĂNG NHẬP</NavLink>
              ))}
          </Social>
        </>
      ) : (
        <>
          <div className="flex flex-row justify-between w-full max-w-[380px] items-center px-[10px]">
            <button onClick={() => setOpenMobileMenu(true)}>
              <IoMenu size={35} color="white" />
            </button>
            <Link to="/home">
              <LogoImg
                src={IconLogo}
                alt="Logo CP Land"
                style={{
                  width: '120px',
                  height: '50px',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
            </Link>
            <IoSearchOutline size={25} color="white" />
          </div>

          {openMobileMenu && (
            <MobileMenu ref={mobileMenuRef}>
              <CloseButton onClick={() => setOpenMobileMenu(false)}>
                ✕
              </CloseButton>
              <NavMobile>
                <NavLink to="/home" onClick={() => setOpenMobileMenu(false)} style={{borderBottom: '1px solid #ccc'}}>
                  TRANG CHỦ
                </NavLink>
                <NavLink to="/introduce" onClick={() => setOpenMobileMenu(false)} style={{borderBottom: '1px solid #ccc'}}>
                  GIỚI THIỆU
                </NavLink>
                <NavLink to="/du-an" onClick={() => setOpenMobileMenu(false)} style={{borderBottom: '1px solid #ccc'}}>
                  DỰ ÁN
                </NavLink>
                <NavLink to="/news-feeds" onClick={() => setOpenMobileMenu(false)} style={{borderBottom: '1px solid #ccc'}}>
                  TIN TỨC
                </NavLink>
                <NavLink to="/lien-he" onClick={() => setOpenMobileMenu(false)}>
                  LIÊN HỆ
                </NavLink>              
              </NavMobile>
            </MobileMenu>
          )}
        </>
      )}
    </Background>
  );
};

export default Navigation;

/** Styled Components **/
const Background = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
  background-color: #005a97;
  height: 65px;
  z-index: 2;
`;

const LogoImg = styled.img`
  width: 200px;
  height: 100px;
  position: absolute;
  top: 13%;
  left: 3rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 25px;
  align-items: center;
  a {
    color: white;
    font-weight: bold;
    text-decoration: none;
    &:hover {
      opacity: 0.8;
    }
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
`;

const AdminMenu = styled.div`
  position: relative;
  display: inline-block;
`;

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
`;

const Submenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 160px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
`;

// Mobile sidebar
const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 75%;
  max-width: 300px;
  height: 100vh;
  background: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #615f5f;
  cursor: pointer;
`;

const NavMobile = styled.nav`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  a {
    color: #615f5f;
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.75rem 0;
    &:hover {
      opacity: 0.8;
    }
  }
`;
