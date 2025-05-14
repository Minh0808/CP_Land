// src/components/ModalQC.tsx
import { FC, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { ModalProps } from 'types/interface'

// 1. Keyframes marquee (chạy ngang) và gradient (shimmer)
const marquee = keyframes`
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`

const gradient = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

// 2. Overlay full‐screen
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`

// 3. Nội dung modal với nền trắng
const Content = styled.div`
  /* background: #fff; */
  border-radius: 8px;
  padding: 24px;
  max-width: 650px;
  width: 90%;
  position: relative;
`

// 5. Tiêu đề chạy marquee + gradient
export const Title = styled.h2`
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  margin: 0 0 1rem;
  background-color: white;
  
  /* wrapper chứa img + span sẽ chạy marquee */
  & .marquee {
    display: inline-block;
    animation: ${marquee} 12s linear infinite;
  }

  /* Logo căn giữa cùng dòng */
  & .marquee img {
    vertical-align: middle;
    margin-right: 0.75rem;
    height: 48px;
  }

  /* Text gradient + shimmer */
  & .marquee span {
    display: inline-block;
    vertical-align: middle;
    font-size: 1.6rem;
    font-weight: 700;
    background: linear-gradient(-45deg, #ff6a00, #ee0979, #00f260, #0575e6);
    background-size: 300% 300%;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: ${gradient} 6s ease infinite;
    text-shadow: 0 0 8px rgba(255,255,255,0.6);
  }
`

// 6. Ảnh chính poster
export const Img = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto 1rem;
  border-radius: 4px;
`

// 7. Component ModalQC
const ModalQC: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // khóa scroll page khi modal mở
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <Content onClick={e => e.stopPropagation()}>
        {children}
      </Content>
    </Overlay>,
    document.body
  )
}

export default ModalQC
