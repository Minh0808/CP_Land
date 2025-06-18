/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ChatBox.tsx
import React, { useState, useEffect, useRef, Key, ReactNode } from 'react'
import { sendChatMessage } from '../API/api'
import styled from 'styled-components'

type Message = {
  id: Key
  sender: 'user' | 'bot'
  text: ReactNode
  suggestion?: boolean
}

interface Props { onClose(): void }

const ChatBox: React.FC<Props> = ({ onClose }) => {
  const [msgs, setMsgs]       = useState<Message[]>([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef               = useRef<HTMLDivElement>(null)
  const wrapperRef            = useRef<HTMLDivElement>(null)

  const REAL_ESTATE_KEYWORDS = [
    'nhà', 'bán', 'thuê', 'dự án', 'giá',
    'chung cư', 'đất', 'văn phòng'
  ]

  const push = (m: Omit<Message,'id'>) =>
    setMsgs(v => [...v, { id: v.length + 1, ...m }])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleClickOutside(e: MouseEvent) {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  useEffect(() => {
    push({ sender: 'bot', text: 'CP-Land xin chào!' })
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs])

  function isRealEstateQuery(raw: string) {
    const low = raw.toLowerCase()
    return REAL_ESTATE_KEYWORDS.some(kw => low.includes(kw))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const raw = input.trim()
    if (!raw) return

    // 1) luôn đẩy tin user lên trước
    push({ sender: 'user', text: raw })
    setInput('')

    // 2) nếu là BĐS thì chỉ gợi ý, không gọi API
    if (isRealEstateQuery(raw)) {
      push({
        sender: 'bot',
        suggestion: true,
        text: (
          <>
            Có vẻ bạn quan tâm BĐS – xem ngay{' '}
            <a href="https://cp-land.com.vn" target="_blank" rel="noopener noreferrer">
              CP-Land
            </a>
          </>
        )
      })
      return
    }

    // 3) ngược lại gọi API chat
    setLoading(true)
    try {
      const { reply } = await sendChatMessage(raw)
      push({ sender: 'bot', text: reply })
    } catch (err: any) {
      console.error(err)
      push({
        sender: 'bot',
        text:
          err.type === 'RATE_LIMIT'
            ? err.message
            : 'Lỗi kết nối. Vui lòng thử lại sau.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Background ref={wrapperRef}>
      <ChatBody ref={bodyRef}>
        {msgs.map(m => (
          <div
            key={m.id}
            className={`msg ${m.sender} ${m.suggestion ? 'suggestion' : ''}`}
          >
            <span className="bubble">{m.text}</span>
          </div>
        ))}
        {loading && (
          <div className="msg bot"><span className="bubble">Đang trả lời…</span></div>
        )}
      </ChatBody>

      {/* Dùng form để cả Enter và click “Gửi” */}
      <ChatForm onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>Gửi</button>
      </ChatForm>
    </Background>
  )
}

export default ChatBox

const Background = styled.div`
  position: fixed; bottom: 100px; right: 24px; z-index: 1000;
  width: 400px; height: 600px; max-height: 500px;
  background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 8px; display: flex; flex-direction: column;
  padding: 10px; justify-content: space-between;
`
const ChatBody = styled.div`
  flex:1; padding:15px; overflow-y:auto;
  scrollbar-width:none; -ms-overflow-style:none;
  &::-webkit-scrollbar { display:none; }
  .msg { margin-bottom: 8px; }
  .bubble {
    display:inline-block; padding:8px 12px;
    border-radius:16px; max-width:100%;
  }
  .user { display:flex; justify-content:flex-end; }
  .user .bubble { background:#dcf8c6; }
  .bot  .bubble { background:#eee; }
  .suggestion .bubble { border:1px dashed #00539c; }
  a { color:#00539c; text-decoration:underline; }
`
const ChatForm = styled.form`
  display:flex; gap:8px;
  input { flex:1; padding:8px; }
  button {
    padding:0 16px;
    background:#00539c; color:#fff;
    border:none; border-radius:4px;
  }
`
