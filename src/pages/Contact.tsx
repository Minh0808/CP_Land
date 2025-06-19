
import React from 'react';

const Contact: React.FC = () => {
  return (
   <section className='flex flex-col justify-between gap-[50px] w-[100%]' style={{ marginTop: '50px', marginBottom: '50px' }}>
            <div className="pt-[100px] mb-5">
                     <h3 className='text-center text-[#015ea7] font-bold text-3xl'>THÔNG TIN LIÊN HỆ</h3>
                  </div>
                  <div className='flex justify-center'>
                     <p>
                           <iframe
                              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7449.622346658035!2d105.8069!3d21.000205!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x14e5c3fdbe0c0ce7!2zQ8O0bmcgVHkgQ1BEViAmIMSQ4buLYSDhu5BjIMSQ4bqldCBYYW5oIE1p4buBbiBC4bqvYw!5e0!3m2!1svi!2sus!4v1552734639196"
                              width="1300px"
                              height={600}
                              
                              style={{ border: 0, display: 'flex', justifyContent: 'center' }}
                              allowFullScreen
                           />
                        </p>
                  </div>
            <div className='flex flex-row justify-center gap-[10px] leading-loose' style={{ maxWidth: '80%', margin: 'auto' }}>
                     {/* Cột thông tin công ty */}
                     <div>
                        <div style={{ fontSize: '18px' }}>
                        <p>Công ty cổ phần dịch vụ và địa ốc Đất Xanh Miền Bắc</p>
                        <p>
                           Địa chỉ: Tầng 18, Toà nhà Center Building, Số 1 Nguyễn Huy
                           Tưởng,
                           <br />
                           Quận Thanh Xuân, Hà Nội
                        </p>
                        <p>MST: 0104794967 – Ngày cấp: 7/7/2010</p>
                        <p>Nơi cấp: Sở Kế hoạch và Đầu tư Thành phố Hà Nội</p>
                        <p>&nbsp;</p>
                        </div>
                     </div>

                     {/* Cột form liên hệ */}
                     
                        <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 px-4 mb-6">
                           <form className="flex flex-col gap-2 w-[480px]">
                              {/* Họ tên của bạn */}
                              <div>
                                 <input
                                 type="text"
                                 name="your-name"
                                 placeholder="Họ tên của bạn"
                                 className="w-full border border-gray-300  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 required
                                 style={{padding: '2px 10px'}}
                                 />
                              </div>

                              {/* Địa chỉ email của bạn */}
                              <div>
                                 <input
                                 type="email"
                                 name="your-email"
                                 placeholder="Địa chỉ email của bạn"
                                 className="w-full border border-gray-300  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 required
                                 style={{padding: '2px 10px'}}
                                 />
                              </div>

                              {/* Số điện thoại của bạn */}
                              <div>
                                 <input
                                 type="tel"
                                 name="your-phone"
                                 placeholder="Số điện thoại của bạn"
                                 className="w-full border border-gray-300  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 required
                                 style={{padding: '2px 10px'}}
                                 />
                              </div>

                              {/* Nội dung */}
                              <div>
                                 <textarea
                                 name="your-message"
                                 rows={6}
                                 placeholder="Vui lòng nhập nội dung"
                                 className="w-full border border-gray-300  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 required
                                 style={{padding: '2px 10px'}}
                                 />
                              </div>

                              {/* Nút Gửi đi */}
                              <div>
                                 <button
                                 type="submit"
                                 className="inline-block bg-blue-800 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
                                 style={{padding: '4px 14px'}}
                                 >
                                 GỬI ĐI
                                 </button>
                              </div>
                           </form>
                           </div>
                  </div>
      </section>     
  );
};

export default Contact;
