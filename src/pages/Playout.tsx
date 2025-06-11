// src/components/Playout.tsx
import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Logo from "../assets/Logo.png"
import ModalSignUp from '../Component/Signup'
import {
   Background,
   Footer,
   InforFooter,
   InforItem,
   LogoFooter,
   Main,
   Modal,
   ModalChatbox,
   ModalGroup,
} from "../Style/PlayoutStyle"
import ModalQC, { Img, Title } from '../Component/Modal'
import DHVPanel from '../assets/image/dhv.webp'
import LogoDHV from '../assets/image/logo.webp'
import ChatBox from '../Component/Chatbox'
import Navigation from '../Component/navigation'
import { AiOutlineGlobal, AiOutlineMail } from "react-icons/ai"
import { PiVibrateLight } from "react-icons/pi"
import { MdDocumentScanner, MdMapsHomeWork, MdOutlineFax } from "react-icons/md"
import { LiaMapMarkedAltSolid } from "react-icons/lia"


const Playout: React.FC = () => {
   const [open, setOpen] = useState(false)
   const [isModalOpen, setIsModalOpen] = useState(true)
   const [chatOpen, setChatOpen] = useState(false)
   const [hasToken, setHasToken] = useState<boolean>(false)

   useEffect(() => {
      const token = localStorage.getItem('token')
      setHasToken(!!token)
   }, [])

  return (
    <Background>
      <Navigation/>

      <Main>
        <Outlet />
      </Main>

      <Footer>
        <LogoFooter src={Logo} alt="Logo CP Land Footer" />
        <InforFooter>
          <InforItem>
            <MdMapsHomeWork color="#0b6acb"/>Công ty cổ phần CP-Land
         </InforItem>
          <InforItem>
            <LiaMapMarkedAltSolid color="rgb(2 247 234)"/>Địa chỉ: Thôn Đống Vừng, Yên Sơn, Lục Nam, Bắc Giang
         </InforItem>
          <InforItem>
            <MdDocumentScanner color="#8e0505"/>MST: xxxxxxxx
         </InforItem>
        </InforFooter>
        <InforFooter>
          <InforItem>
            <PiVibrateLight color="#00f260"/>tel: xxxxx
         </InforItem>
          <InforItem>
            <MdOutlineFax color="#003d67"/>Fax: xxx
         </InforItem>
          <InforItem>
            <AiOutlineGlobal color="#d40369"/>Wedsite: CP-Land.com.vn
         </InforItem>
          <InforItem>
            <AiOutlineMail color="rgb(171 3 199)"/>Email: xxx
         </InforItem>
        </InforFooter>
      </Footer>
      <ModalGroup>
         <Modal onClick={() => setOpen(true)}>Đăng Ký Nhận Bảng Giá</Modal>
         <ModalChatbox onClick={() => setChatOpen(true)}/>
         {open && <ModalSignUp onClose={() => setOpen(false)} />}
         {chatOpen && <ChatBox onClose={() => setChatOpen(false)} />}
      </ModalGroup>
      

      <ModalQC isOpen={isModalOpen && !hasToken} onClose={() => setIsModalOpen(false)}>
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
