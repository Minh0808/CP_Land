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
   MainCard,
   MainColumn,
   NewsGrid,
   NewsSection,
   SectionTitle,
   SideCard,
   SideColumn,
} from '../Style/HomeStyle'
import { AdminNewsItem, NewsItem, PanelData, SlideData } from '../types/interface'

const isProd = import.meta.env.MODE === 'production'
const API_BASE = isProd
   ? (import.meta.env.VITE_API_URL_SERVER as string)
   : (import.meta.env.VITE_API_URL_LOCAL as string)

const Home: React.FC = () => {
   const [panels, setPanels] = useState<PanelData[]>([])
   const [panelIndex, setPanelIndex] = useState(0)
   const [slides, setSlides] = useState<SlideData[]>([])
   const [slideIndex, setSlideIndex] = useState(0)
   const [news, setNews] = useState<NewsItem[]>([]);
   const [newsRss, setNewsRss]     = useState<NewsItem[]>([]);
   const [newsCustom, setNewsCustom] = useState<AdminNewsItem[]>([]);

   useEffect(() => {
      axios.get<PanelData[]>('/api/panels')
         .then(res => {
         setPanels(res.data.sort((a, b) => a.sort_order - b.sort_order))
         setPanelIndex(0)
         })
         .catch(console.error)
   }, [])

   useEffect(() => {
      if (!panels.length) return
      const iv = setInterval(() => {
         setPanelIndex(i => (i < panels.length - 1 ? i + 1 : 0))
      }, 5000)
      return () => clearInterval(iv)
   }, [panels.length])

   useEffect(() => {
      axios.get<SlideData[]>('/api/slides')
         .then(res => {
         setSlides(res.data.sort((a, b) => a.sort_order - b.sort_order))
         setSlideIndex(0)
         })
         .catch(console.error)
   }, [])

   useEffect(() => {
      axios.get<NewsItem[]>('/api/rss/hot-real')
         .then(res => setNews(res.data))
         .catch(console.error);
   }, []);
   const mainItems = news.slice(0, 2);
   const sideItems = news.slice(2);

   useEffect(() => {
      axios.get<NewsItem[]>('/api/rss/hot-real')
         .then(res => setNewsRss(res.data))
         .catch(console.error);

      axios.get<AdminNewsItem[]>('/api/admin/news')
         .then(res => setNewsCustom(res.data))
         .catch(console.error);
   }, []);

   const prevPanel = () => setPanelIndex(i => Math.max(i - 1, 0))
   const nextPanel = () => setPanelIndex(i => Math.min(i + 1, panels.length - 1))

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
         <NewsSection>
            <SectionTitle>TIN TỨC NỔI BẬT</SectionTitle>
            <NewsGrid>
               <MainColumn>
                  {mainItems.map((n, i) => (
                     <MainCard key={i} href={n.link} target="_blank" rel="noreferrer">
                        {n.image && <img src={n.image} alt={n.title} />}
                        <div>
                           <h3>{n.title}</h3>
                           <p>{n.summary}</p>
                        </div>
                     </MainCard>
                  ))}
               </MainColumn>
               <SideColumn>
                  {sideItems.map((n, i) => (
                     <SideCard key={i} href={n.link} target="_blank" rel="noreferrer">
                        {n.image && <img src={n.image} alt={n.title} />}
                        <div>
                           <h4>{n.title}</h4>
                        </div>
                     </SideCard>
                  ))}
               </SideColumn>
            </NewsGrid>
         </NewsSection>
      </Background>
   )
}

export default Home
