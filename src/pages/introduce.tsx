import React from "react"
import styled from "styled-components"
import LogoInforGT from "../assets/image/gt-cl-01.png"
import {timelineData} from "../types/interface"


const Introduce: React.FC = () => {
   return(
      <Background>
         <Title>GIỚI THIỆU VỀ CHÚNG TÔI</Title>
         <Text>
            Công ty Cổ phần Bất động sản  CP Land là công ty chuyên hoạt động trong lĩnh vực bất động sản,
            tập trung vào mua bán đất nền thổ cư tại khu vực ven các khu công nghiệp thuộc huyện Lục Nam,
            tỉnh Bắc Giang.
         </Text>
         <Text>
            Với lợi thế am hiểu thị trường địa phương, CP Land mang đến cho khách hàng những lô đất có tiềm năng sinh lời cao,
            pháp lý rõ ràng và vị trí thuận tiện. Các lô đất này có diện tích từ 100m² đến 180m²,
            phù hợp cho việc đầu tư, kinh doanh hoặc xây dựng phòng trọ.
         </Text>
         <Text>
            Công ty hướng đến việc hỗ trợ nhà đầu tư, người mua ở thực dễ dàng tiếp cận các sản phẩm đất nền chất lượng,
            đồng thời góp phần phát triển đô thị và nâng cao giá trị khu vực ven công nghiệp tại Bắc Giang.
         </Text>
         <Infor>
            <LogoInfor/>
            <Text>CP Land cam kết cung cấp đầy đủ các giấy tờ pháp lý, đảm bảo tính minh bạch và tuân thủ pháp luật.</Text>
         </Infor>
         <Title>HÌNH THÀNH VÀ PHÁT TRIỂN</Title>
         <TimelineWrapper>
            <TimelineList>
               {timelineData.map((item, idx) => {
                  const even = idx % 2 === 0
                  return (
                  <TimelineBlock key={idx} $even={even}>
                     <Year $even={even}>{item.year}</Year>
                     <Content>
                        <Img src={item.img} alt={item.title} />
                        <TextBox $even={even}>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                        </TextBox>
                     </Content>
                  </TimelineBlock>
                  )
               })}
            </TimelineList>
         </TimelineWrapper>
      </Background>
   )
}
export default Introduce

const Background = styled.div`
   width: 100%;
   max-width: 1140px;
   padding-top: 50px;
   margin: 0 auto;
`
const Title = styled.h1`
   padding-top: 50px;
   color: #015ea7;
   text-align: center;
   font-size: 30px;
   font-weight: bold;
`
const Text = styled.p`
   padding-top: 15px;
   font-size: 18px;
`
const LogoInfor = styled.div`
   background: url(${LogoInforGT});
   background-position: center;
   background-repeat: no-repeat;
   background-size: cover;
   width: 100%;
   max-width: 686px;
   height: 616px;
   margin: 0 auto;
`
const Infor = styled.div`
   max-width: 1140px;
   padding-top: 20px;
`
const TimelineWrapper = styled.div`
  position: relative;
  padding: 60px 0;
`

const TimelineList = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #015ea7, #d88a33);
    transform: translateX(-50%);
  }
`

type EvenProp = { $even: boolean }

// Đổi tên tránh trùng với interface TimelineItem
const TimelineBlock = styled.div<EvenProp>`
  position: relative;
  margin: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    width: 16px;
    height: 16px;
    background: #d88a33;
    border-radius: 50%;
    transform: translate(-50%, -100%);
    top: 0px;
    z-index: 1;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: ${({ $even }) => ($even ? 'flex-start' : 'flex-end')};

  }
`

const Year = styled.div<EvenProp>`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #015ea7;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: bold;
  /* z-index: 2; */

  @media (min-width: 768px) {
  left: ${({ $even }) =>
    $even
      ? `calc(50% - (360px / 2) - 24px)`   // dịch sang trái một nửa width content + margin
      : `calc(56% + (360px / 2) + 24px)`}; // dịch sang phải tương tự
  transform: translateX(-50%);
}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`

const Img = styled.img`
  width: 300px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`

const TextBox = styled.div<EvenProp>`
  max-width: 360px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-top: 16px;

  @media (min-width: 768px) {
    margin: 0 ${({ $even }) => ($even ? '0 0 0 24px' : '0 24px 0 0')};
  }

  h3 {
    margin-top: 0;
    color: #015ea7;
    font-size: 20px;
  }
  p {
    margin-bottom: 0;
    color: #333;
    line-height: 1.5;
    font-size: 16px;
  }
`
