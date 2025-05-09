// src/pages/Home.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import {
  Background,
  SliderWrapper,
  Slides,
  Slide,
  Dots,
  Dot,
  Title,
  PrevButton,
  NextButton,
  CardCarousel,
  CardSlider,
  Card,
  ImageBox,
  Span,
  Text,
  TitleText,
} from '../Style/HomeStyle'

interface PanelData {
  id: number
  image_url: string
  sort_order: number
}

interface SlideData {
  id: number
  image_url: string
  title: string
  price: string
  details: string
  sort_order: number
}

// Nếu dùng proxy của Vite, axios sẽ tự chuyển '/api/...' → backend
// Ngược lại có thể thay thành `${API_BASE}/api/...`
const isProd = import.meta.env.MODE === 'production'
const API_BASE = isProd
  ? (import.meta.env.VITE_API_URL_SERVER as string)
  : (import.meta.env.VITE_API_URL_LOCAL as string)

const Home: React.FC = () => {
  // panels
  const [panels, setPanels] = useState<PanelData[]>([])
  const [panelIndex, setPanelIndex] = useState(0)

  // slides
  const [slides, setSlides] = useState<SlideData[]>([])
  const [slideIndex, setSlideIndex] = useState(0)

  // Fetch panels chỉ 1 lần
  useEffect(() => {
    axios.get<PanelData[]>('/api/panels')
      .then(res => {
        setPanels(res.data.sort((a, b) => a.sort_order - b.sort_order))
        setPanelIndex(0)
      })
      .catch(console.error)
  }, [])

  // Tự động chuyển panels mỗi 5s
  useEffect(() => {
    if (!panels.length) return
    const iv = setInterval(() => {
      setPanelIndex(i => (i < panels.length - 1 ? i + 1 : 0))
    }, 5000)
    return () => clearInterval(iv)
  }, [panels.length])

  // Fetch slides chỉ 1 lần
  useEffect(() => {
    axios.get<SlideData[]>('/api/slides')
      .then(res => {
        setSlides(res.data.sort((a, b) => a.sort_order - b.sort_order))
        setSlideIndex(0)
      })
      .catch(console.error)
  }, [])

  const prevPanel = () => setPanelIndex(i => Math.max(i - 1, 0))
  const nextPanel = () => setPanelIndex(i => Math.min(i + 1, panels.length - 1))

  // Carousel slides dạng pages
  const visibleCount = 4
  const pageCount = Math.ceil(slides.length / visibleCount)
  const prevSlide = () => setSlideIndex(i => (i - 1 + pageCount) % pageCount)
  const nextSlide = () => setSlideIndex(i => (i + 1) % pageCount)

  return (
    <Background>
      <SliderWrapper>
        <Slides $index={panelIndex}>
          {panels.map(p => (
            <Slide
              key={p.id}
              $url={p.image_url.startsWith('http')
                ? p.image_url
                : `${API_BASE}${p.image_url}`}
            />
          ))}
        </Slides>
        <PrevButton onClick={prevPanel}><FaChevronLeft/></PrevButton>
        <NextButton onClick={nextPanel}><FaChevronRight/></NextButton>
        <Dots>
          {panels.map((_, idx) => (
            <Dot
              key={idx}
              $active={idx === panelIndex}
              onClick={() => setPanelIndex(idx)}
            />
          ))}
        </Dots>
      </SliderWrapper>

      <Title>DỰ ÁN ĐANG MỞ BÁN</Title>
      <CardCarousel>
        <CardSlider $index={slideIndex}>
          {slides.map(s => (
            <Card key={s.id}>
              <ImageBox
                $url={s.image_url.startsWith('http')
                  ? s.image_url
                  : `${API_BASE}${s.image_url}`}
              />
              <TitleText>{s.title}</TitleText>
              <Text>Giá từ: <Span>{s.price}</Span></Text>
            </Card>
          ))}
        </CardSlider>
        <PrevButton onClick={prevSlide}><FaChevronLeft/></PrevButton>
        <NextButton onClick={nextSlide}><FaChevronRight/></NextButton>
      </CardCarousel>
    </Background>
  )
}

export default Home
