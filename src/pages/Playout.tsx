// src/components/Playout.tsx
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import {
   FaEnvelope,
   FaFacebookF,
   FaInstagram,
   FaTwitter
} from 'react-icons/fa'
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import Logo from "../assets/Logo.png"
import ModalSignUp from '../Component/Signup'
import {
   AdminMenu,
   Background,
   Footer,
   InforFooter,
   InforItem,
   LogoFooter,
   LogoImg,
   Logout,
   Main,
   MenuButton,
   Modal,
   Nav,
   Navigation,
   Social,
   Submenu,
} from "../Style/PlayoutStyle"
import ModalQC, { Img, Title } from '../Component/Modal'
import DHVPanel from '../../public/image/dhv.webp'
import LogoDHV from '../../public/image/logo.webp'

interface User {
  id: number
  name: string
  role: 'admin' | 'user'
}

const Playout: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [openAdminMenu, setOpenAdminMenu] = useState(false)
  const adminRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(true)

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
         openAdminMenu &&
         adminRef.current &&
         !adminRef.current.contains(event.target as Node)
         ) {
         setOpenAdminMenu(false)
         }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
         document.removeEventListener("mousedown", handleClickOutside)
      }
   }, [openAdminMenu])

   useEffect(() => {
      const token = localStorage.getItem('token')

      // Nếu không có token, setUser null và không gọi API
      if (!token) {
         setUser(null)
         return
      }

      // Ngược lại, gán header và gọi API
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      axios.get<User>('/auth/me')
         .then(res => setUser(res.data))
         .catch(err => {
            // bắt lỗi khác 401
            if (err.response?.status !== 401) {
            console.error('Fetch profile error:', err)
            }
            setUser(null)
         })
   }, [location])

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
          <NavLink to="/home" style={{ textDecoration: 'none' }}>TRANG CHỦ</NavLink>
          <NavLink to="/introduce" style={{ textDecoration: 'none' }}>GIỚI THIỆU</NavLink>
          <NavLink to="/project" style={{ textDecoration: 'none' }}>DỰ ÁN</NavLink>
          <NavLink to="/news-feeds" style={{ textDecoration: 'none' }}>TIN TỨC</NavLink>
          <NavLink to="/contact" style={{ textDecoration: 'none' }}>LIÊN HỆ</NavLink>

          {user && user.role === 'admin' && (
            <AdminMenu ref={adminRef}>
              <MenuButton onClick={() => setOpenAdminMenu(o => !o)}>
                ADMIN ▾
              </MenuButton>
              {openAdminMenu && (
                <Submenu>
                  <NavLink to="/panels" onClick={() => setOpenAdminMenu(false)}>Thêm Panel</NavLink>
                  <NavLink to="/slides" onClick={() => setOpenAdminMenu(false)}>Thêm Slide</NavLink>
                  <NavLink to="/admin/posts" onClick={() => setOpenAdminMenu(false)}>Đăng Bài</NavLink>
                </Submenu>
              )}
            </AdminMenu>
          )}
          {user && user.role === 'user' && (
            <NavLink to="/new" style={{ textDecoration: 'none' }}>Đăng Bài</NavLink>
          )}
        </Nav>

        <Social>
          {user ? (
            <>
              <span style={{ color: 'white', marginRight: 12 }}>
                Xin chào, {user.name}
              </span>
              <Logout onClick={handleLogout}>ĐĂNG XUẤT</Logout>
            </>
          ) : (
            <NavLink to="/login" style={{ textDecoration: 'none', color: 'white', fontFamily: 'Times New Roman', fontWeight: 'bold' }}>ĐĂNG NHẬP</NavLink>
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

      <Footer>
        <LogoFooter src={Logo} alt="Logo CP Land Footer" />
        <InforFooter>
          <InforItem>Công ty cổ phần CP-Land</InforItem>
          <InforItem>Địa chỉ: Thôn Đống Vừng, Yên Sơn, Lục Nam, Bắc Giang</InforItem>
          <InforItem>MST: xxxxxxxx</InforItem>
          <InforItem>Nơi cấp: xxxxxxx</InforItem>
        </InforFooter>
        <InforFooter>
          <InforItem>tel: xxxxx</InforItem>
          <InforItem>Fax: xxx</InforItem>
          <InforItem>Wedsite: CP-Land.com.vn</InforItem>
          <InforItem>Email: xxx</InforItem>
        </InforFooter>
      </Footer>

      <Modal onClick={() => setOpen(true)}>Đăng Ký Nhận Bảng Giá</Modal>
      {open && <ModalSignUp onClose={() => setOpen(false)} />}

      <ModalQC isOpen={isModalOpen && !user} onClose={() => setIsModalOpen(false)}>
        <Title>
          <div className="marquee">
            <img src={LogoDHV} alt="Logo DHV" />
            <span>Chào mừng 30 năm thành lập trường ĐH Hùng Vương!</span>
          </div>
        </Title>
        <Img src={DHVPanel} alt="Panel DHV" />
      </ModalQC>
    </Background>
  )
}

export default Playout
