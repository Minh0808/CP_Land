import React, { FormEvent, useState } from 'react';
import {
  Background,
  Button,
  CloseButton,
  Form,
  Input,
  ModalContainer,
  Title,
  Title2
} from '../Style/SignUpStyle';
import { api } from '../API/api';

interface Props {
  onClose(): void;
}

const CLOSE_DURATION = 2000;

const ModalSignUp: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [closing, setClosing]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, CLOSE_DURATION);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !phone) {
      setError('Vui lòng điền đầy đủ email và số điện thoại.');
      return;
    }

    setLoading(true);
    try {
      // Gửi qua instance axios `api` đã được config baseURL + withCredentials
      const res = await api.post<{ message: string }>('/signup', { email, phone });

      // Thành công
      setSuccess(res.data.message || 'Đăng ký thành công!');
      setEmail('');
      setPhone('');

      // Tự đóng modal sau 1.5s
      setTimeout(handleClose, 1500);
    } catch (err: any) {
      // Axios trả lỗi
      const msg = err.response?.data?.message || err.message || 'Có lỗi xảy ra.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background closing={closing} onClick={handleClose}>
      <ModalContainer
        closing={closing}
        onClick={e => e.stopPropagation()}
      >
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <Title>Đăng ký nhận thông tin chi tiết dự án</Title>
        <Title2>
          Bảng giá bán, hợp đồng mua bán, chính sách cho vay vốn, chương trình
          khuyến mại mới nhất.
        </Title2>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email..."
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <Input
            type="tel"
            placeholder="Số điện thoại..."
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={loading}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'ĐANG GỬI…' : 'ĐĂNG KÝ NGAY'}
          </Button>
        </Form>

        <Title2>
          Quý khách điền đầy đủ thông tin để nhận được thông tin dự án chính
          xác nhất.
        </Title2>

        {error   && <p style={{ color: 'salmon'   }}>{error}</p>}
        {success && <p style={{ color: '#a4edba' }}>{success}</p>}
      </ModalContainer>
    </Background>
  );
};

export default ModalSignUp;
