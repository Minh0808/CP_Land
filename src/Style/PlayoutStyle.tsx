import {styled, createGlobalStyle } from "styled-components";


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
`
export const Navigation = styled.div`
   width: 100%;
   position: fixed;
   top: 0;
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0 20px;
   background-color: #005a97;
   height: 65px;
   flex-shrink: 0;
   z-index: 2;
`

export const LogoImg = styled.img`
   width: 200px;
   height: 100px;
   position: absolute;
   top: 10px;
   left: 2rem;
   z-index: 10;
`
export const Nav = styled.nav`
   display: flex;
   gap: 25px;
   align-items: center;
   
   a {
      color: white;
      font-weight: bold;
      &:hover {
         opacity: 0.8;
      }
   }
`
export const Social = styled.div`
   display: flex;
   gap: 10px;
   align-items: center;
`
export const Main = styled.main`
   flex: 1;
   overflow-y: auto;
   background: #f5f5f5;
`
export const Modal = styled.div`
   position: fixed;
   bottom: 0;
   flex-shrink: 0;
   width: 300px;
   height: 50px;
   margin-left: 50px;
   background: #005a97;
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
export const AdminMenu = styled.div`
  position: relative;
  display: inline-block;
`
export const MenuButton = styled.button`
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
export const Submenu = styled.div`
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
export const LogoFooter = styled.img`
   width: 250px;
   height: 150px;
   padding-top: 20px;
`
export const Footer = styled.div`
   background-color: #005a97;
   display: flex;
   flex-direction: row;
   justify-content: space-evenly;
   padding-bottom: 50px;   
`
export const InforFooter = styled.div`
   
`
export const InforItem = styled.p`
   padding-top: 20px;
   color: white;
   font-size: 18px;
`

export const Logout = styled.button`
   background: none;
   border: none;
   color: white;
   font-size: 16px;
   font-weight: bold;
   font-family: 'Times New Roman', Times, serif;
   cursor: pointer;
`
