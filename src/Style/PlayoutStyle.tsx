import styled, {createGlobalStyle } from "styled-components";
import IconChatbox from '../assets/image/Chatbos.png'

export const GlobalStyle = createGlobalStyle`

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Times New Roman', Times, serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
    font-size: 16px;
  }
`
export const Background = styled.div`
   display: flex;
   flex-direction: column;
   min-height: 100vh;
   margin-top: 65px;
`


export const Main = styled.main`
   flex: 1;
   overflow-y: auto;
   background: #f5f5f5;
`
export const Modal = styled.div`
   position: fixed;
   bottom: 0px;
   left: auto;
   right: 50px;
   flex-shrink: 0;
   width: 300px;
   height: 50px;
   margin-left: 50px;
   background: #b38055;
   color: white;
   display: flex;
   align-items: center;
   justify-content: center;
   border-top-left-radius: 8px;
   border-top-right-radius: 8px;
   font-size: 18px;
   font-weight: bold;
   cursor: pointer
`
export const ModalChatbox = styled.div`
   position: fixed;
   bottom: 80px;
   left: auto;
   right: 50px;
   flex-shrink: 0;
   width: 50px;
   height: 50px;
   margin-left: 50px;
   color: white;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 100%;
   font-size: 18px;
   font-weight: bold;
   cursor: pointer;
   background: url(${IconChatbox});
   background-size: cover;
   background-position: center;
   background-repeat: no-repeat;
`
export const LogoFooter = styled.img`
   width: 250px;
   height: 150px;
   margin-top: 50px;
`
export const Footer = styled.div`
   background-color: #b38055;
   display: flex;
   flex-direction: row;
   justify-content: center;
   padding-bottom: 50px;
   gap: 100px;   
`
export const InforFooter = styled.div`
   
`
export const InforItem = styled.p`
   padding-top: 20px;
   color: white;
   font-size: 18px;
   display: flex;
   align-items: center;
   gap: 5px;
`

export const ModalGroup = styled.div`
   
`