// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import {
  Background,
  SliderWrapper,
  Slides,
  Slide,
  Dots,
  Dot,
  NavButton,
  Title
} from '../Style/HomeStyle';

// Kiểu dữ liệu slide lấy từ API
interface SlideData {
  id: number;
  image_url: string;
  title: string;
  price: string;
  details: string;
  sort_order: number;
}

const PrevButton = styled(NavButton)`left: 10px;`;
const NextButton = styled(NavButton)`right: 10px;`;

const Home: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Fetch ban đầu và polling mỗi 10s
    const fetchSlides = async () => {
      try {
        const { data } = await axios.get<SlideData[]>('/api/slides');
        setSlides(data);
      } catch (err) {
        console.error('Lỗi khi fetch slides:', err);
      }
    };
    fetchSlides();
    const timer = setInterval(fetchSlides, 10000);
    return () => clearInterval(timer);
  }, []);

  // Nếu chưa có slide thì hiện loading
//   if (slides.length === 0) {
//     return <Background>Đang tải dữ liệu…</Background>;
//   }

  // Prev / Next
  const prev = () => setCurrent(i => Math.max(i - 1, 0));
  const next = () =>
    setCurrent(i => Math.min(i + 1, slides.length - 1));

  return (
    <Background>
      <SliderWrapper>
        <Slides index={current}>
          {slides.map(s => (
            <Slide key={s.id} url={s.image_url} />
          ))}
        </Slides>

        <PrevButton onClick={prev} disabled={current === 0}>
          <FaChevronLeft />
        </PrevButton>
        <NextButton
          onClick={next}
          disabled={current === slides.length - 1}
        >
          <FaChevronRight />
        </NextButton>

        <Dots>
          {slides.map((_, idx) => (
            <Dot
              key={idx}
              active={idx === current}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </Dots>
      </SliderWrapper>
      <Title>DỰ ÁN ĐANG MỞ BÁN</Title>
      <SliderWrapper>
         <Slides index={current}>
            {slides.map(s => (
               <Slide key={s.id} url={s.image_url} />
            ))}
        </Slides>
        <PrevButton onClick={prev} disabled={current === 0}>
          <FaChevronLeft />
        </PrevButton>
        <NextButton
          onClick={next}
          disabled={current === slides.length - 1}
        >
          <FaChevronRight />
        </NextButton>
      </SliderWrapper>
      
    </Background>
  );
};

export default Home;
