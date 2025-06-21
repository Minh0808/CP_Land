/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { sendMessage } from '../API/api';

const Contact: React.FC = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [message, setMessage] = useState('');

  const handlerSend = async () => {
    if (!name || !email || !phone || !message) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      await sendMessage(name, email, phone, message);
      alert('Gửi liên hệ thành công');
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (err: any) {
      alert(err.message || 'Gửi liên hệ thất bại');
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto">
      <section className="w-full flex flex-col items-center gap-6">
        {/* Tiêu đề */}
        <h3 className="text-3xl text-center text-[#015ea7] font-bold mb-10">
          THÔNG TIN LIÊN HỆ
        </h3>

        {/* Container chính */}
        <div className="flex flex-col items-center w-full lg:flex-row lg:justify-between lg:items-start lg:space-x-8 gap-6">

          {/* Bên trái: bản đồ + info */}
          <div className="w-full lg:w-1/2 flex flex-col items-center space-y-6 gap-6">
            {/* Wrapper map: width ~91%, mx-auto sẽ căn giữa */}
            <div className="w-[90%] h-[500px] mx-auto px-2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7449.622346658035!2d105.8069!3d21.000205!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x14e5c3fdbe0c0ce7!2zQ8O0bmcgVHkgQ1BEViAmIMSQ4buLYSDhu5BjIMSQ4bqldCBYYW5oIE1p4buBbiBC4bqvYw!5e0!3m2!1svi!2sus!4v1552734639196"
                className="w-full h-full border-0 rounded-lg"
                allowFullScreen
                loading="lazy"
              />
            </div>
            {/* Info công ty */}
            <div className="space-y-2 text-gray-700 text-[18px] text-center lg:text-left w-[90%]">
              <p className="font-medium">
                Công ty cổ phần dịch vụ và địa ốc Đất Xanh Miền Bắc
              </p>
              <p>
                Địa chỉ: Tầng 18, Tòa nhà Center Building, Số 1 Nguyễn Huy Tưởng,<br/>
                Quận Thanh Xuân, Hà Nội
              </p>
              <p>MST: 0104794967 – Ngày cấp: 7/7/2010</p>
              <p>Nơi cấp: Sở Kế hoạch và Đầu tư Thành phố Hà Nội</p>
            </div>
          </div>

          {/* Bên phải: form */}
          <div className="w-[90%] lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
            <form
              onSubmit={e => { e.preventDefault(); handlerSend(); }}
              className="space-y-4 max-w-md w-full flex flex-col gap-2.5  mb-100px"
            >
              <input
                type="text"
                placeholder="Họ tên của bạn"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 p-2.5 lg:px-3 lg:py-2 lg:rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 lg:rounded lg:px-3 lg:py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Số điện thoại của bạn"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border border-gray-300 lg:rounded lg:px-3 lg:py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Vui lòng nhập nội dung"
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full border border-gray-300 lg:rounded lg:px-3 lg:py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-[100px] h-[35px] bg-blue-800 text-white font-semibold lg:rounded py-2 hover:bg-blue-700 transition"
              >
                GỬI ĐI
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
