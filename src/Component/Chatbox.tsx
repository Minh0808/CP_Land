// src/components/ChatBox.tsx
import React, { useState, useEffect, useRef, Key, ReactNode } from 'react'
import { sendChatMessage } from '../API/api'   // <-- import service API
import { styled } from 'styled-components'

type Message = {
  id: Key | null | undefined
  sender: 'user' | 'bot'
  text: ReactNode
  suggestion?: boolean
}

interface Props { onClose(): void }

const ChatBox: React.FC<Props> = ({ onClose }) => {
  const [msgs, setMsgs] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  
  const push = (m: Omit<Message,'id'>) =>
   setMsgs(v => [...v, { id: v.length + 1, ...m }])
  
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])
  // Khởi tạo message chào mừng
  useEffect(() => {
    push({ sender: 'bot', text: 'CP-Land xin chào!' })
  }, [])

  // Tự scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [msgs])

  // Khi người dùng nhấn Enter hoặc bấm Gửi
  const onEnter = async () => {
    const raw = input.trim()
    if (!raw) return

    // 1) Đẩy tin nhắn user lên chat
    push({ sender: 'user', text: raw })
    setInput('')
    setLoading(true)

    // 2) Gọi API lấy câu trả lời
   try {
      const { reply } = await sendChatMessage(raw);
      push({ sender: 'bot', text: reply });
      } catch (err: any) {
      console.error(err);
      if (err.type === 'RATE_LIMIT') {
         push({ sender: 'bot', text: err.message });
      } else {
         push({ sender: 'bot', text: 'Lỗi kết nối. Vui lòng thử lại sau.' });
      }
      } finally {
      setLoading(false);
      }
  }

   return (
      <Background ref={wrapperRef}>
         <ChatBody ref={bodyRef}>
            {msgs.map(m => (
               <div key={m.id} className={`msg ${m.sender}`}>
                  <span className="bubble">{m.text}</span>
               </div>
            ))}
            {loading && (
               <div className="msg bot">
                  <span className="bubble">Đang trả lời...</span>
               </div>
            )}
         </ChatBody>

         <ChatInput>
            <input
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && onEnter()}
               placeholder="Nhập tin nhắn..."
               disabled={loading}
            />
            <button onClick={onEnter} disabled={loading || !input.trim()}>
               Gửi
            </button>
         </ChatInput>
      </Background>
   )
}

export default ChatBox

const Background = styled.div<{ closing?: boolean }>`
  position: fixed;
  bottom: 100px;
  right: 24px;
  z-index: 1000;
  width: 400px;
  height: 600px;
  max-height: 500px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  opacity: ${p => (p.closing ? 0 : 1)};
  transition: opacity 0.3s;
  padding: 10px;
  justify-content: space-between;
`
const ChatInput = styled.div`
   position: relative;
   display: flex;
   gap: 8px;

   input {
      flex: 1;
      padding: 8px;
   }
   button {
      padding: 8px 16px;
   }
`
const ChatBody = styled.div`
   flex: 1;
   padding: 15px;
   overflow-y: auto;
   /* Ẩn scrollbar trên Firefox */
   scrollbar-width: none;
   -ms-overflow-style: none;
   /* Ẩn scrollbar trên WebKit (Chrome, Safari) */
   &::-webkit-scrollbar {
      display: none;
   }
`