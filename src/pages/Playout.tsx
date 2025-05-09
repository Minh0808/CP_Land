// src/components/Playout.tsx
import React, { useEffect, useState } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import Logo from "../assets/Logo.png"
import {
  AdminMenu,
  Background,
  LogoImg,
  Main,
  MenuButton,
  Modal,
  Nav,
  Navigation,
  Social,
  Submenu,
} from "../Style/PlayoutStyle"
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope
} from 'react-icons/fa'
import ModalSignUp from '../Modal/Signup'

interface User {
  id: number
  name: string
  role: 'admin' | 'user'
}

const Playout: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [openAdminMenu, setOpenAdminMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Khi component mount, load profile
  useEffect(() => {
    axios.get<{ authenticated: boolean; user?: User }>('/api/auth/me')
      .then(res => {
        if (res.data.authenticated && res.data.user) {
          setUser(res.data.user)
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        setUser(null)
      })
  }, [location])

  // Logout: xóa token, header, state, và chuyển về /login
  const handleLogout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/home')
  }

  return (
    <Background>
      <Navigation>
        <Link to="/home">
          <LogoImg src={Logo} alt="Logo CP Land" />
        </Link>

        <Nav>
          <NavLink to="/home"      style={{ textDecoration: 'none' }}>TRANG CHỦ</NavLink>
          <NavLink to="/introduce" style={{ textDecoration: 'none' }}>GIỚI THIỆU</NavLink>
          <NavLink to="/project"   style={{ textDecoration: 'none' }}>DỰ ÁN</NavLink>
          <NavLink to="/news"      style={{ textDecoration: 'none' }}>TIN TỨC</NavLink>
          <NavLink to="/contact"   style={{ textDecoration: 'none' }}>LIÊN HỆ</NavLink>

          {user && user.role === 'admin' && (
            <AdminMenu>
              <MenuButton onClick={() => setOpenAdminMenu(o => !o)}>
                Quản lý Admin ▾
              </MenuButton>
              {openAdminMenu && (
                <Submenu>
                  <NavLink to="/admin/panels">Thêm Panel</NavLink>
                  <NavLink to="/admin/slides">Thêm Slide</NavLink>
                  <NavLink to="/admin/posts">Đăng Bài</NavLink>
                </Submenu>
              )}
            </AdminMenu>
          )}
          {user && user.role === 'user' && (
            <NavLink to="/posts/new" style={{ textDecoration: 'none' }}>Đăng Bài</NavLink>
          )}
        </Nav>

        <Social>
          {user ? (
            <>
              <span style={{ color: 'white', marginRight: 12 }}>
                Xin chào, {user.name}
              </span>
              <button onClick={handleLogout}>
                  Đăng Xuất
              </button>
            </>
          ) : (
            <NavLink to="/login" style={{ textDecoration: 'none' }}>ĐĂNG NHẬP</NavLink>
          )}

          <Link to="/"><FaFacebookF color="white" size={20} /></Link>
          <Link to="/"><FaInstagram color="white" size={20} /></Link>
          <Link to="/"><FaTwitter color="white" size={20} /></Link>
          <Link to="/"><FaEnvelope color="white" size={20} /></Link>
        </Social>
      </Navigation>

      <Main>
        <Outlet />
      </Main>

      <Modal onClick={() => setOpen(true)}>Đăng Ký Nhận Bảng Giá</Modal>
      {open && <ModalSignUp onClose={() => setOpen(false)} />}
    </Background>
  )
}

export default Playout
