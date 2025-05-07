import { styled } from "styled-components";

export const Background = styled.div`
    
`
export const SliderWrapper = styled.div`
  width: 100%;
  height: 500px;
  overflow: hidden;
  position: relative;
  margin: auto;

  button {
    display: none;
  }

  &:hover button {
    display: block;
  }
`
export const Slides = styled.div<{ index: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${props => -props.index * 100}%);
`
export const Slide = styled.div<{ url: string }>`
  flex: 0 0 100%;
  height: 100%;
  background-image: url(${props => props.url});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`
export const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: red;
  font-size: 50px;
  cursor: pointer;  
`
export const Dots = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`
export const Dot = styled.button<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.8);
  background: ${({ active }) =>
    active ? 'rgba(255,255,255,1)' : 'transparent'};
  padding: 0;
  cursor: pointer;
`
export const Title = styled.h1`
  text-align: center;
  color: black;
`