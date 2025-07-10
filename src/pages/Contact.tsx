/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { sendMessage } from '../API/api';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Contact: React.FC = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [message, setMessage] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const [success, setSuccess] = useState<string | null>(null);

   const handlerSend = async () => {
      if (!name || !email || !phone || !message) {
         alert('Vui lòng nhập đầy đủ thông tin');
         return;
      }
      setSubmitting(true);
      try {
         await sendMessage(name, email, phone, message);
         setSuccess('Gửi liên hệ thành công');
         setName('');
         setEmail('');
         setPhone('');
         setMessage('');
      } catch (err: any) {
         alert(err.message || 'Gửi liên hệ thất bại');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="flex flex-col justify-center items-center mt-[50px] gap-[20px] mb-[50px]">
         <Title style={{ fontWeight: 'bold' }} className="text-[#015ea7] text-[26px]">
            THÔNG TIN LIÊN HỆ
         </Title>

         <Iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3514.72963322204!2d106.330019!3d21.2690489!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31356f006a83946b%3A0x5bc3b8091918dca0!2zQ1AgTEFORCDEkOG6pFQgVEjhu5QgQ8avIFZFTiBLQ04!5e1!3m2!1svi!2s!4v1750680719332!5m2!1svi!2s"
            allowFullScreen
            loading="lazy"
         />

         <ContactBody className="flex flex-row w-[80%] gap-[20px] mt-[20px]">
            <div
               style={{ fontWeight: 'bold' }}
               className="flex-1 flex flex-col gap-[10px] text-[18px]"
            >
               <p className="font-medium">Công ty cổ phần CP-Land</p>
               <p>Địa chỉ: Thôn: Đống Vừng, Xã: Bắc Lũng, Tỉnh: Bắc Ninh</p>
               <Link to="https://cpland.net" className="text-[#015ea7]">
                  Wedsite: cpland.net
               </Link>
               <p>SĐT: 0339957868</p>
               <p>Email: cpland.thongtin@gmail.com</p>
            </div>

            <FormSubmit
               onSubmit={(e) => {
                  e.preventDefault();
                  handlerSend();
               }}
               className="w-[40%] flex flex-col gap-[10px]"
            >
               <input
                  type="text"
                  placeholder="Họ tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ border: '1px solid #716f6f', borderRadius: '3px', padding: '2px 10px' }}
               />
               <input
                  type="email"
                  placeholder="Địa chỉ email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: '1px solid #716f6f', borderRadius: '3px', padding: '2px 10px' }}
                  required
               />
               <input
                  type="tel"
                  placeholder="Số điện thoại của bạn"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ border: '1px solid #716f6f', borderRadius: '3px', padding: '2px 10px' }}
                  required
               />
               <textarea
                  placeholder="Vui lòng nhập nội dung"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ border: '1px solid #716f6f', borderRadius: '3px', padding: '2px 10px' }}
                  required
               />
               <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  {success && <p style={{ color: 'rgb(7 208 68)' }}>{success}</p>}
                  <Button
                     type="submit"
                     disabled={submitting}
                  >
                     {submitting ? 'Đang gửi...' : 'Gửi'}
                  </Button>
               </div>
            </FormSubmit>
         </ContactBody>
      </div>
   );
};

export default Contact;

const Button = styled.button`
   background: blue;
   width: 20%;
   padding: 5px 0;
   color: white;
   border-radius: 5px;
   cursor: pointer;
   position: relative;
   right: 0px;
   &:disabled {
      background-color: #90caf9;
      cursor: not-allowed;
   }
`;

const Title = styled.h1`
   @media (max-width: 768px) {
      font-size: 24px;
   }
`;

const Iframe = styled.iframe`
   width: 80%;
   height: 500px;
   @media (max-width: 768px) {
      width: 90%;
      height: 200px;
   }
`;

const ContactBody = styled.div`
   @media (max-width: 768px) {
      flex-direction: column;
      width: 90%;
   }
`;

const FormSubmit = styled.form`
   @media (max-width: 768px) {
      width: 100%;
   }
`;
