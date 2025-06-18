// src/pages/SuKien.tsx
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SliderWrapper, Slides, Slide, PrevButton, NextButton, Dots, Dot } from '../Style/HomeStyle';
import { PanelData } from '../types/interface';
import { api, signup } from '../API/api';

// Container chính bọc toàn bộ phần nội dung trang Sự kiện
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

// Tiêu đề trang
const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
`;

// Phần giới thiệu dự án
const Intro = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 36px;
  color: #333;
`;

// Khối form đăng ký
const FormWrapper = styled.div`
  border: 1px solid #ddd;
  padding: 24px;
  border-radius: 8px;
  background-color: #fafafa;
`;

// Style nhãn và input
const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  label {
    font-weight: 500;
    margin-bottom: 8px;
  }

  input {
    padding: 10px 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
    }
  }
`;

// Style nút submit
const Button = styled.button<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#aaa' : '#007bff')};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#aaa' : '#0056b3')};
  }
`;

// Thông báo trạng thái (ví dụ: thành công / lỗi)
const Message = styled.p<{ success?: boolean }>`
  margin-top: 16px;
  color: ${({ success }) => (success ? 'green' : 'red')};
  font-weight: 500;
`;

interface FormData {
  fullName: string;
  phone:    string;
  email:    string;
}

const SuKien: React.FC = () => {
  const [panelIndex, setPanelIndex] = useState(0);
  const [panels, setPanels]         = useState<PanelData[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // State giữ giá trị form
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone:    '',
    email:    '',
  });

  // State để disable nút khi đang gửi, và hiển thị message kết quả
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage]           = useState<string>('');
  const [isSuccess, setIsSuccess]       = useState<boolean | null>(null);

  // Xử lý khi input thay đổi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsSuccess(null);

    try {
      // Gọi API signup với name, email, phone
      await signup(formData.fullName, formData.email, formData.phone);

      setMessage('Đăng ký tham dự thành công! Bạn sẽ nhận ưu đãi giảm giá 10% + quà tặng.');
      setIsSuccess(true);
      setFormData({ fullName: '', phone: '', email: '' });
    } catch (error) {
      console.error(error);
      setMessage('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch panels
  useEffect(() => {
    api.get<{ data: PanelData[] }>('/panels')
      .then((res) => {
        const arr = res.data.data || [];
        setPanels(arr.sort((a, b) => a.sort_order - b.sort_order));
      })
      .catch(console.error);
  }, []);

  // Auto-cycle panels every 5s
  useEffect(() => {
    if (!panels.length) return;
    const iv = setInterval(() => {
      setPanelIndex((i) => (i < panels.length - 1 ? i + 1 : 0));
    }, 5000);
    return () => clearInterval(iv);
  }, [panels]);

  const prevPanel = () => setPanelIndex((i) => Math.max(i - 1, 0));
  const nextPanel = () => setPanelIndex((i) => Math.min(i + 1, panels.length - 1));

  return (
    <Container>
      <Title>Sự kiện: Dự án Mở Bán Sắp Tới</Title>

      <Intro>
        <p>
          Chào mừng Quý khách đến với sự kiện ra mắt dự án “Green Residence” – khu căn hộ
          thông minh, hiện đại bậc nhất khu Đông Bắc Hà Nội. Dự án sẽ chính thức mở bán vào
          ngày <strong>15/07/2025</strong>. Đây là cơ hội duy nhất để Quý khách có được căn hộ
          vị trí đẹp, view thoáng, tiện ích 5 sao, kết nối thuận tiện với trung tâm thành
          phố.
        </p>
        <p>
          Khi đăng ký tham dự sớm, Quý khách sẽ nhận ngay{' '}
          <strong>ưu đãi giảm giá 10%</strong> cho gói sản phẩm căn hộ, cùng{' '}
          <strong>bộ quà tặng giá trị lên đến 5 triệu đồng</strong> (voucher nội thất, phiếu
          mua sắm, …). Số lượng có hạn – hãy nhanh tay đăng ký để giữ chỗ và sở hữu mức ưu đãi
          tốt nhất!
        </p>
      </Intro>

      <SliderWrapper ref={panelRef}>
        <Slides $index={panelIndex}>
          {panels.map((p) => (
            <Slide key={p.id} $url={p.image_url} />
          ))}
        </Slides>
        <PrevButton onClick={prevPanel}>
          <FaChevronLeft />
        </PrevButton>
        <NextButton onClick={nextPanel}>
          <FaChevronRight />
        </NextButton>
        <Dots>
          {panels.map((_, idx) => (
            <Dot key={idx} $active={idx === panelIndex} onClick={() => setPanelIndex(idx)} />
          ))}
        </Dots>
      </SliderWrapper>

      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="fullName">Họ và Tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập địa chỉ email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Đăng Ký Tham Dự'}
          </Button>

          {message && <Message success={isSuccess === true}>{message}</Message>}
        </form>
      </FormWrapper>
    </Container>
  );
};

export default SuKien;
