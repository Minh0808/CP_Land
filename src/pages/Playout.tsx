import React, { useState } from "react"
import Logo from "../assets/Logo.png"
import {Background, LogoImg, Main, Modal, Nav, Navigation, Social, } from "../Style/PlayoutStyle"
import { Link, Outlet } from "react-router-dom"
import {
   FaFacebookF,
   FaInstagram,
   FaTwitter,
   FaEnvelope
 } from 'react-icons/fa'
 import ModalSignUp from '../Modal/Signup';

const Playout: React.FC = () => {
   const [open, setOpen] = useState(false);
   return(
      <Background>
         <Navigation>
            <Link to = "/home">
               <LogoImg src={Logo} alt="Logo CP Land" />
            </Link>
            
            <Nav>
               <Link to = "/home" style={{ textDecoration: 'none' }}>TRANG CHỦ</Link>
               <Link to ="/" style={{ textDecoration: 'none' }}>GIỚI THIỆU</Link>
               <Link to ="" style={{ textDecoration: 'none' }}>DỰ ÁN</Link>
               <Link to ="" style={{ textDecoration: 'none' }}>TIN TỨC</Link>
               <Link to ="" style={{ textDecoration: 'none' }}>LIÊN HỆ</Link>
            </Nav>
            <Social>
               <Link to = "/" ><FaFacebookF color="white" size={20}/></Link>
               <Link to ="/" ><FaInstagram color="white" size={20}/></Link>
               <Link to ="" ><FaTwitter color="white" size={20}/></Link>
               <Link to ="" ><FaEnvelope color="white" size={20}/></Link>
            </Social>
         </Navigation>
         <Main>
            <Outlet />
         </Main>
         <Modal onClick={() => setOpen(true)}>Đăng Ký Nhận Bảng Giá</Modal>
         {open && (
            <ModalSignUp
               onClose={() => setOpen(false)}
            />
         )}
      </Background>
   )
}
export default Playout