/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { sendMessage } from '../API/api';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [message, setMessage] = useState('');

   const handlerSend = async () => {
      if (!name || !email || !phone || !message) {
         alert('Vui lòng nhập đầy đủ thông tin');
         return;
      }
      try {
         await sendMessage(name, email, phone, message);
         alert('Gửi liên hệ thành công');
         setName('');
         setEmail('');
         setPhone('');
         setMessage('');
      } catch (err: any) {
         alert(err.message || 'Gửi liên hệ thất bại');
      }
   };

   return (
      <div className="flex flex-col justify-center items-center mt-[50px] gap-[20px] mb-[50px]">
         <h1 style={{fontWeight: 'bold'}} className="text-[#015ea7] text-[26px]">THÔNG TIN LIÊN HỆ</h1>

         <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3514.72963322204!2d106.330019!3d21.2690489!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31356f006a83946b%3A0x5bc3b8091918dca0!2zQ1AgTEFORCDEkOG6pFQgVEjhu5QgQ8avIFZFTiBLQ04!5e1!3m2!1svi!2s!4v1750680719332!5m2!1svi!2s"
            className="w-[80%] h-[500px]"
            allowFullScreen
            loading="lazy"
         />

         <div className='flex flex-row w-[80%] gap-[20px] mt-[20px]'>
            <div style={{fontWeight: 'bold'}} className="flex-1 flex flex-col gap-[10px] text-[18px]">
               <p className="font-medium">Công ty cổ phần CP-Land</p>
               <p>
                  Địa chỉ: Thôn Đống Vừng, Yên Sơn, Lục Nam, Bắc Giang
               </p>
               <Link to="https://cpland.net" className='text-[#015ea7]'>Wedsite: cpland.net</Link>
               <p>SĐT: 0987453131</p>
               <p>Email: cpland.thongtin@gmail.com</p>
            </div>

            <form
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
                  style={{ border: '1px solid #716f6f', borderRadius: '3px', padding: '2px 10px'}}
               />
               <input
                  type="email"
                  placeholder="Địa chỉ email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: '1px solid #716f6f', borderRadius: '3px', padding: '2px 10px'}}
                  required
               />
               <input
                  type="tel"
                  placeholder="Số điện thoại của bạn"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ border: '1px solid #716f6f', borderRadius: '3px', padding: '2px 10px'}}
                  required
               />
               <textarea
                  placeholder="Vui lòng nhập nội dung"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ border: '1px solid #716f6f', borderRadius: '3px', padding: '2px 10px'}}
                  required
               />
               <button
                  type="submit"
                  style={{background: 'blue', width: '20%', padding: '5px 0', color: 'white', borderRadius: '5px', cursor: 'pointer', position: 'relative', left: '40%'}}
               >
                  GỬI ĐI
               </button>
            </form>
         </div>
      </div>
   );
};

export default Contact;
