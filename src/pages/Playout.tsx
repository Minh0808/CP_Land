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
   ModalGroup,
} from "../Style/PlayoutStyle"

// import ChatBox from '../Component/Chatbox'
import Navigation from '../Component/navigation'
import { AiOutlineGlobal, AiOutlineMail } from "react-icons/ai"
import { PiVibrateLight } from "react-icons/pi"
import { MdMapsHomeWork } from "react-icons/md"
import { LiaMapMarkedAltSolid } from "react-icons/lia"

const Playout: React.FC = () => {
   const [open, setOpen] = useState(false)
   // const [chatOpen, setChatOpen] = useState(false)
   
   
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
            <MdMapsHomeWork color="white" size={25}/><span>Công ty cổ phần CP-Land</span>
         </InforItem>
          <InforItem>
            <LiaMapMarkedAltSolid color="white" size={25}/>Địa chỉ: Thôn: Đống Vừng, Xã: Bắc Lũng, Tỉnh: Bắc Ninh
         </InforItem>
        </InforFooter>
        <InforFooter>
          <InforItem>
            <PiVibrateLight color="white" size={25}/>SĐT: 0339957868
         </InforItem>
          <InforItem>
            <AiOutlineGlobal color="white" size={25}/>Wedsite: cpland.net
         </InforItem>
          <InforItem>
            <AiOutlineMail color="white" size={25}/>Email: cpland.thongtin@gmail.com
         </InforItem>
        </InforFooter>
      </Footer>
      <ModalGroup>
         <Modal onClick={() => setOpen(true)}>Đăng Ký Nhận Bảng Giá</Modal>
         {/* <ModalChatbox onClick={() => setChatOpen(true)}/> */}
         {open && <ModalSignUp onClose={() => setOpen(false)} />}
         {/* {chatOpen && <ChatBox onClose={() => setChatOpen(false)} />} */}
      </ModalGroup>
    </Background>
  )
}

export default Playout
