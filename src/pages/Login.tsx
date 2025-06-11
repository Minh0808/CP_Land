// src/pages/Login.tsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login as apiLogin } from '../API/api';
import { AuthContext } from '../Contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);

  const { user, login } = useContext(AuthContext);
  const navigate        = useNavigate();

  // Nếu đã login rồi thì chuyển về home
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }

    try {
      // 1) Gọi helper apiLogin, nó unwrap data và trả về { jwt, user }
      const { token, user } = await apiLogin(username, password);

      // 2) Cập nhật context + lưu token
      login(token);
      console.log('[Login] Logged in:', user, token);

      // 3) Điều hướng về Home
      navigate('/home');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.message ||
        (err.response?.data?.message as string) ||
        'Đăng nhập thất bại, vui lòng thử lại.'
      );
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Label>
          Tên đăng nhập
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
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
  );
};

export default Login;

/* Styled Components */

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

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
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 500;
`;

const Input = styled.input`
  margin-top: 4px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

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
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
`;
