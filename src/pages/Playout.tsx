// src/components/Playout.tsx
import React, { useState } from "react"
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

import ChatBox from '../Component/Chatbox'
import Navigation from '../Component/navigation'
import { AiOutlineGlobal, AiOutlineMail } from "react-icons/ai"
import { PiVibrateLight } from "react-icons/pi"
import { MdDocumentScanner, MdMapsHomeWork, MdOutlineFax } from "react-icons/md"
import { LiaMapMarkedAltSolid } from "react-icons/lia"
// import NavigationMobile from "../Component/navigationMobile"



const Playout: React.FC = () => {
   const [open, setOpen] = useState(false)
   const [chatOpen, setChatOpen] = useState(false)
   
   
  return (
    <Background>
      <Navigation />

      <Main>
        <Outlet />
      </Main>

      <Footer>
        <LogoFooter src={Logo} alt="Logo CP Land Footer" />
        <InforFooter>
          <InforItem>
            <MdMapsHomeWork color="white" size={25}/><p>Công ty cổ phần CP-Land</p>
         </InforItem>
          <InforItem>
            <LiaMapMarkedAltSolid color="white" size={25}/>Địa chỉ: Thôn Đống Vừng, Yên Sơn, Lục Nam, Bắc Giang
         </InforItem>
          <InforItem>
            <MdDocumentScanner color="white" size={25}/>MST: xxxxxxxx
         </InforItem>
        </InforFooter>
        <InforFooter>
          <InforItem>
            <PiVibrateLight color="white" size={25}/>tel: xxxxx
         </InforItem>
          <InforItem>
            <MdOutlineFax color="white" size={25}/>Fax: xxx
         </InforItem>
          <InforItem>
            <AiOutlineGlobal color="white" size={25}/>Wedsite: CP-Land.com.vn
         </InforItem>
          <InforItem>
            <AiOutlineMail color="white" size={25}/>Email: xxx
         </InforItem>
        </InforFooter>
      </Footer>
      <ModalGroup>
         <Modal onClick={() => setOpen(true)}>Đăng Ký Nhận Bảng Giá</Modal>
         <ModalChatbox onClick={() => setChatOpen(true)}/>
         {open && <ModalSignUp onClose={() => setOpen(false)} />}
         {chatOpen && <ChatBox onClose={() => setChatOpen(false)} />}
      </ModalGroup>
    </Background>
  )
}

export default Playout
