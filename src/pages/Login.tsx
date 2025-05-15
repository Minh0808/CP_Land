// src/pages/Login.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

// 1) Xác định API_BASE dựa vào env
const API_BASE = import.meta.env.VITE_API_URL as string
axios.defaults.baseURL = `${API_BASE}/api`

// 3) Nếu đã có token lưu trước đó, gán luôn header Authorization
const tokenInStorage = localStorage.getItem('token')
if (tokenInStorage) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${tokenInStorage}`
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Nếu user đã login (có token), tự động chuyển về home
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // Gọi POST /api/auth/login
      const res = await axios.post<{ token: string }>(
        '/auth/login',
        { email, password }
      )

      const { token } = res.data

      // 1) Lưu token vào localStorage
      localStorage.setItem('token', token)

      // 2) Gán header Authorization cho axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // 3) Điều hướng về trang chủ
      navigate('/home')
    } catch (err: any) {
      console.error(err)
      setError(
        err.response?.data?.message
          || 'Đăng nhập thất bại, vui lòng thử lại.'
      )
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Label>
          Email
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Label>
        <Label>
          Mật khẩu
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Label>
        <SubmitButton type="submit">Đăng nhập</SubmitButton>
      </Form>
    </Container>
  )
}

export default Login

/* Styled Components */

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`

const Form = styled.form`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  h2 {
    margin: 0;
    text-align: center;
  }
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 500;
`

const Input = styled.input`
  margin-top: 4px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const SubmitButton = styled.button`
  padding: 10px;
  background: #00539c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
`
