
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="section" id="section_39835305">
      <div className="bg section-bg fill bg-fill bg-loaded" />

      <div className="section-content relative">
        <div className="row" id="row-337203231">
          <div className="col small-12 large-12">
            <div className="flex-row">
              <div className="tittle-home">
                <h3>THÔNG TIN LIÊN HỆ</h3>
              </div>

              <div className="row" id="row-1904552347">
                <div className="col small-12 large-12">
                  <div className="col-inner">
                    <p>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7449.622346658035!2d105.8069!3d21.000205!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x14e5c3fdbe0c0ce7!2zQ8O0bmcgVHkgQ1BEViAmIMSQ4buLYSDhu5BjIMSQ4bqldCBYYW5oIE1p4buBbiBC4bqvYw!5e0!3m2!1svi!2sus!4v1552734639196"
                        width="80%"
                        height={450}
                        frameBorder={0}
                        style={{ border: 0 }}
                        allowFullScreen
                      />
                    </p>
                  </div>
                </div>
              </div>
              {/* Kết thúc khối bản đồ */}

              {/* Bắt đầu khối thông tin công ty và form liên hệ */}
              <div className="row" id="row-786693700">
                {/* Cột thông tin công ty */}
                <div className="col medium-6 small-12 large-6">
                  <div className="col-inner">
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
                <div className="col medium-6 small-12 large-6">
                  <div className="col-inner">
                    <div
                      role="form"
                      className="wpcf7"
                      id="wpcf7-f5-p230-o1"
                      lang="vi"
                      dir="ltr"
                    >
                      <div className="screen-reader-response" />
                      <form
                        action="/lien-he/#wpcf7-f5-p230-o1"
                        method="post"
                        className="wpcf7-form"
                        noValidate
                      >
                        <div style={{ display: 'none' }}>
                          <input type="hidden" name="_wpcf7" defaultValue={5} />
                          <input
                            type="hidden"
                            name="_wpcf7_version"
                            defaultValue="5.1.1"
                          />
                          <input
                            type="hidden"
                            name="_wpcf7_locale"
                            defaultValue="vi"
                          />
                          <input
                            type="hidden"
                            name="_wpcf7_unit_tag"
                            defaultValue="wpcf7-f5-p230-o1"
                          />
                          <input
                            type="hidden"
                            name="_wpcf7_container_post"
                            defaultValue={230}
                          />
                          <input
                            type="hidden"
                            name="g-recaptcha-response"
                            defaultValue=""
                          />
                        </div>

                        <p>
                          <label>
                            <span className="wpcf7-form-control-wrap your-name">
                              <input
                                type="text"
                                name="your-name"
                                defaultValue=""
                                size={40}
                                className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                                aria-required="true"
                                aria-invalid="false"
                                placeholder="Họ tên của bạn"
                              />
                            </span>
                          </label>
                        </p>

                        <p>
                          <label>
                            <span className="wpcf7-form-control-wrap your-email">
                              <input
                                type="email"
                                name="your-email"
                                defaultValue=""
                                size={40}
                                className="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-required wpcf7-validates-as-email"
                                aria-required="true"
                                aria-invalid="false"
                                placeholder="Địa chỉ email của bạn"
                              />
                            </span>
                          </label>
                          <br />
                          <label>
                            <span className="wpcf7-form-control-wrap your-phone">
                              <input
                                type="tel"
                                name="your-phone"
                                defaultValue=""
                                size={40}
                                className="wpcf7-form-control wpcf7-text wpcf7-tel wpcf7-validates-as-required wpcf7-validates-as-tel"
                                aria-required="true"
                                aria-invalid="false"
                                placeholder="Số điện thoại của bạn"
                              />
                            </span>
                          </label>
                        </p>

                        <p>
                          <label>
                            <span className="wpcf7-form-control-wrap your-message">
                              <textarea
                                name="your-message"
                                cols={40}
                                rows={10}
                                className="wpcf7-form-control wpcf7-textarea"
                                aria-invalid="false"
                                placeholder="Vui lòng nhập nội dung"
                                defaultValue={''}
                              />
                            </span>
                          </label>
                        </p>

                        <p>
                          <input
                            type="submit"
                            defaultValue="Gửi đi"
                            className="wpcf7-form-control wpcf7-submit"
                          />
                          <span className="ajax-loader" />
                        </p>

                        <div className="wpcf7-response-output wpcf7-display-none" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #section_39835305 {
              padding-top: 30px;
              padding-bottom: 30px;
            }
          `,
        }}
      />
    </section>
  );
};

export default Contact;
