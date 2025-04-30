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
   position: relative;
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0 20px;
   background-color: #3b81a3;
   height: 65px;
   flex-shrink: 0;
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
`
export const Main = styled.main`
   flex: 1;
   overflow-y: auto;
   padding: 20px;
   background: #f5f5f5;
`
export const Modal = styled.div`
   flex-shrink: 0;
   width: 300px;
   height: 50px;
   margin-left: 50px;
   background: #3b81a3;
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