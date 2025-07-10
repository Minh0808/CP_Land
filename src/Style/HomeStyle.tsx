import styled from 'styled-components';

export const Background = styled.div`
   padding-top: 0px;
`;

export const SliderWrapper = styled.div`
   width: 100%;
   height: 500px;
   overflow: hidden;
   position: relative;
   margin: auto;
   button {
      display: none;
   }

   &:hover button {
      display: flex;
   }

   @media (max-width: 768px) {
      height: 230px;
   }
`;

// Transient prop $index: sẽ không được forward thành attribute
export const Slides = styled.div<{ $index: number }>`
   display: flex;
   height: 100%;
   transition: transform 0.5s ease-in-out;
   transform: translateX(${(p) => -p.$index * 100}%);
`;

// Transient prop $url
export const Slide = styled.div<{ $url: string }>`
   flex: 0 0 100%;
   height: 100%;
   background-image: url(${(p) => p.$url});
   background-size: cover;
   background-position: center;
   background-repeat: no-repeat;
`;

export const NavButton = styled.button`
   position: absolute;
   width: 50px;
   height: 50px;
   top: 50%;
   transform: translateY(-50%);
   background: none;
   border: none;
   color: #6d6c6c;
   font-size: 30px;
   align-items: center;
   justify-content: center;
   z-index: 2;
   cursor: pointer;
`;
export const PrevButton = styled(NavButton)`
   left: 16px;
`;

export const NextButton = styled(NavButton)`
   right: 16px;
`;

export const Dots = styled.div`
   position: absolute;
   bottom: 16px;
   left: 50%;
   transform: translateX(-50%);
   display: flex;
   gap: 8px;
`;

// Transient prop $active
export const Dot = styled.button<{ $active: boolean }>`
   width: 12px;
   height: 12px;
   border-radius: 50%;
   border: 2px solid rgba(255, 255, 255, 0.8);
   background: ${({ $active }) => ($active ? 'rgba(255,255,255,1)' : 'transparent')};
   padding: 0;
   cursor: pointer;
`;
export const CardCarousel = styled.div`
   position: relative;
   overflow-x: hidden;
   overflow-y: visible;
   margin: 20px auto;
   max-width: 82%;
   height: 100%;
   button {
      display: none;
   }

   &:hover button {
      display: block;
   }
   @media (max-width: 768px) {
      max-width: 90%;
      button {
         display: flex;
         justify-content: center;
      }
   }
`;

export const CardSlider = styled.div<{ $index: number }>`
   display: flex;
   transition: transform 0.5s ease;
   transform: translateX(${(p) => -p.$index * 25}%);
   gap: 15px;
   padding: 5px;
`;

export const Card = styled.div`
   flex: 0 0 24%;
   box-sizing: border-box;
   padding: 15px;
   border-radius: 4px;
   background-color: #fff;
   transition:
      border-bottom 0.3s ease,
      transform 0.3s ease,
      box-shadow 0.3s ease;
   height: 250px;
   border: 1px solid #bebdbd;
   box-shadow: 4px 0.5px 4px #8e8e8e;

   &:hover {
      border-bottom: 2px solid #ff7a00;
      transform: translateY(-5px);
   }
`;
export const ImageBox = styled.div<{ $url: string }>`
   width: 100%;
   padding-top: 60%; /* tỉ lệ 3:5, tùy bạn */
   background-image: url(${(p) => p.$url});
   background-size: cover;
   background-position: center;
   background-repeat: no-repeat;
`;
export const TitleText = styled.h3`
   text-align: center;
   padding-bottom: 20px;
`;
export const Text = styled.p`
   text-align: center;
   color: black;
`;
export const Span = styled.span`
   color: #ff7a00;
   font-size: 18px;
   font-weight: bold;
`;
export const Title = styled.h1`
   text-align: center;
   color: #015ea7;
   font-size: 30px;
   font-weight: bold;
   padding-top: 30px;

   @media (max-width: 768px) {
      font-size: 24px;
   }
`;
export const NewsSection = styled.section`
   margin-top: 40px;
   background-color: #dddddd;
`;

export const SectionTitle = styled.h2`
   font-size: 2rem;
   font-weight: bold;
   text-align: center;
   padding: 24px 0;
   color: #015ea7;

   @media (max-width: 768px) {
      font-size: 22px;
   }
`;

export const NewsGrid = styled.div`
   display: grid;
   grid-template-columns: 360px 1fr;
   gap: 20px;
   justify-content: center;
   padding-bottom: 50px;
   max-width: 88%;
   margin: 0 auto;

   @media (max-width: 768px) {
      grid-template-columns: 1fr;
   }
`;

export const MainColumn = styled.div`
   display: flex;
   flex-direction: column;
   gap: 20px;
   color: #015ea7;
   font-size: 16px;
   font-weight: bold;
`;

export const SideColumn = styled.div`
   display: grid;
   grid-template-columns: 430px 430px;
   height: 81%;
   width: 100%;
   gap: 16px;
   color: #015ea7;
   font-size: 25px;
   font-weight: bold;
   @media (max-width: 768px) {
      grid-template-columns: 1fr;
   }
`;

export const MainCard = styled.a`
   display: block;
   background: #fff;
   overflow: hidden;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
   text-decoration: none;
   color: inherit;
   padding: 15px;
   box-sizing: border-box;
   border-bottom: 2px solid transparent;
   transition: border-color 0.2s ease;
   width: 360px;
   max-width: 360px;
   height: 442px;
   max-height: 442px;

   img {
      width: 100%;
      height: auto;
   }
   div {
      /* padding: 12px; */
   }
   h3 {
      margin: 0 0 8px;
      font-size: 1.25rem;
   }
   p {
      color: #555;
      overflow: hidden;
      text-overflow: clip;
   }
   &:hover {
      border-bottom: 2px solid blue;
   }

   @media (max-width: 768px) {
      max-height: 350px;

      img {
         width: 100%;
         height: 200px;
      }
      h3 {
         font-size: 16px;
      }
      p {
         font-size: 14px;
      }
   }
`;
export const SideCard = styled.a`
   display: flex;
   background: #fff;
   overflow: hidden;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
   text-decoration: none;
   color: inherit;
   height: 168px;
   padding: 15px;
   box-sizing: border-box;
   border-right: 2px solid transparent;
   transition: border-color 0.2s ease;

   img {
      width: 120px;
      height: 100%;
      object-fit: cover;
   }

   div {
      padding: 8px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
   }

   h4 {
      margin: 0;
      font-size: 1rem;
      line-height: 1.2;
   }

   &:hover {
      border-right: 2px solid blue;
   }
   p {
      font-size: 14px;
      color: #555;
      overflow: hidden;
   }

   @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      height: auto;
      img {
         width: 100%;
         height: 200px;
      }
      h4 {
         font-size: 12px;
      }
      p {
         font-size: 10px;
      }
   }
`;
export const Attraction = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-evenly;
   margin-bottom: 50px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 30px;
   }
`;
export const AttractionInfor = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`;
export const Icon = styled.a`
   width: 87px;
   height: 87px;
   border: 3px solid #e8e8e8;
   border-radius: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   margin-bottom: 15px;
   cursor: pointer;
   & > svg {
      color: #888;
      width: 32px;
      height: 32px;
   }

   &:hover {
      background-color: #005a97;
      border: none;
      & > svg {
         color: white;
      }
   }
`;
export const TitleInfor = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`;
export const AttracTiontitle = styled.h3`
   color: #575656;
   margin-bottom: 20px;
`;
export const TextInfo = styled.p`
   color: #888;
`;
export const ColumnTitle = styled.h3`
   font-size: 20px;
   color: #015ea7;
   margin-bottom: 12px;
   text-transform: uppercase;
   text-align: center;
`;
export const GridSideColumn = styled.div`
   width: 100%;
`;
