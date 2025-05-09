// src/pages/Home.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
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
  NavButton
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

const isProd = import.meta.env.MODE === 'production'
const API_BASE = isProd
  ? (import.meta.env.VITE_API_URL_SERVER as string)
  : (import.meta.env.VITE_API_URL_LOCAL as string)

const socket = io('/', { transports: ['websocket'] })

const Home: React.FC = () => {
  // panels
  const [panels, setPanels] = useState<PanelData[]>([])
  const [panelIndex, setPanelIndex] = useState(0)

  // slides
  const [slides, setSlides] = useState<SlideData[]>([])
  const [slideIndex, setSlideIndex] = useState(0)

  // --- panels: fetch + realtime ---
  useEffect(() => {
    axios.get<PanelData[]>('/api/panels')
      .then(r => {
        setPanels(r.data)
        setPanelIndex(0)
      })
      .catch(console.error)

    socket.on('panel:added', p =>
      setPanels(prev => [...prev, p].sort((a, b) => a.sort_order - b.sort_order))
    )
    socket.on('panel:updated', upd =>
      setPanels(prev =>
        prev
          .map(p => p.id === upd.id ? upd : p)
          .sort((a, b) => a.sort_order - b.sort_order)
      )
    )
    socket.on('panel:deleted', ({ id }: { id: number }) =>
      setPanels(prev => prev.filter(p => p.id !== id))
    )

    return () => {
      socket.off('panel:added')
      socket.off('panel:updated')
      socket.off('panel:deleted')
    }
  }, [])

  // Auto‑play panels every 5s
  useEffect(() => {
    if (!panels.length) return
    const id = setInterval(() => {
      setPanelIndex(i => i < panels.length - 1 ? i + 1 : 0)
    }, 5000)
    return () => clearInterval(id)
  }, [panels.length])

  // --- slides: fetch + realtime ---
  useEffect(() => {
    axios.get<SlideData[]>('/api/slides')
      .then(r => {
        setSlides(r.data)
        setSlideIndex(0)
      })
      .catch(console.error)

    socket.on('slide:added', s =>
      setSlides(prev => [...prev, s].sort((a, b) => a.sort_order - b.sort_order))
    )
    socket.on('slide:updated', upd =>
      setSlides(prev =>
        prev
          .map(s => s.id === upd.id ? upd : s)
          .sort((a, b) => a.sort_order - b.sort_order)
      )
    )
    socket.on('slide:deleted', ({ id }: { id: number }) =>
      setSlides(prev => prev.filter(s => s.id !== id))
    )

    return () => {
      socket.off('slide:added')
      socket.off('slide:updated')
      socket.off('slide:deleted')
    }
  }, [])

  const prevPanel = () => setPanelIndex(i => Math.max(i - 1, 0))
  const nextPanel = () => setPanelIndex(i => Math.min(i + 1, panels.length - 1))

  const visibleCount = 4;  
  const pageCount = Math.ceil(slides.length / visibleCount);
  const prevSlide = () => setSlideIndex(i => (i - 1 + pageCount) % pageCount);
  const nextSlide = () => setSlideIndex(i => (i + 1) % pageCount);
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
        <PrevButton onClick={prevPanel}>
          <FaChevronLeft />
        </PrevButton>
        <NextButton onClick={nextPanel}>
          <FaChevronRight />
        </NextButton>
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
              <ImageBox $url={s.image_url.startsWith('http') ? s.image_url : `${API_BASE}${s.image_url}`} />
              <TitleText>{s.title}</TitleText>
              <Text>Giá từ: <Span>{s.price}</Span></Text>
            </Card>
          ))}
        </CardSlider>
        <PrevButton onClick={prevSlide}>
          <FaChevronLeft />
        </PrevButton>
        <NextButton onClick={nextSlide}>
          <FaChevronRight />
        </NextButton>
      </CardCarousel>
    </Background>
  )
}

export default Home
