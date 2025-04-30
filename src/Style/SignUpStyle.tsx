import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

export const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`
export const zoomIn   = keyframes`
   from { transform: scale(0.9); opacity: 0; } 
   to { transform: scale(1); opacity: 1; }
`
export const zoomOut  = keyframes`
   from { transform: scale(1);   opacity: 1; } 
   to { transform: scale(0.9); opacity: 0; }
`
export const Background = styled.div <{ closing?: boolean }>`
   position: fixed;
   top: 0; left: 0;
   width: 100vw;
   height: 100vh;
   background: rgba(0, 0, 0, 0.5);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;
   animation: ${({ closing }) => closing ? fadeOut : fadeIn} 2s ease forwards;
`
export const ModalContainer = styled.div <{ closing?: boolean }> `
   background: #295a9e;
   border-radius: 4px;
   position: relative;
   width: 600px;
   height: 230px;
   max-width: 90%;
   padding: 25px;
   box-shadow: 0 4px 12px rgba(0,0,0,0.3);
   color: #fff;
   animation: ${({ closing }) => closing ? zoomOut : zoomIn} 2s ease-out forwards;
`
export const CloseButton = styled.div`
   position: absolute;
   top: 1rem;
   right: 1rem;
   background: #ccc;
   border: none;
   border-radius: 50%;
   width: 32px;
   height: 32px;
   display: flex;
   align-items: center;
   justify-content: center;
   color: #000; 
   font-size: 1.2rem;
   cursor: pointer;
   transition: background 0,5, color 0,5s;

   &:hover {
      background: #000;
      color: #fff;
   }
`
export const Form = styled.form`
   display: flex;
   flex-direction: row;
   gap: 5px;
`
export const Title = styled.h2`
   border-bottom: 1px solid white;
`
export const Title2 = styled.p`
   padding-top: 10px;
`
export const Input = styled.input`
   width: 180px;
   height: 35px;
   padding: 5px;
   font-size: 16px;
`
export const Button = styled.button`
   width: 180px;
   background: #F48120;
   color: white;
   border: none;
   font-weight: bold;
   font-size: 16px;

   &:hover {
      box-shadow: inset 0 0 0 100px rgba(0, 0, 0, 0.2);
   }
`