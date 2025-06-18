/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaThumbsUp, FaInfo, FaCogs, FaDollarSign } from 'react-icons/fa';
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
  MainCard,
  MainColumn,
  NewsGrid,
  NewsSection,
  SectionTitle,
  SideCard,
  SideColumn,
  Attraction,
  AttractionInfor,
  TitleInfor,
  Icon,
  AttracTiontitle,
  TextInfo,
  ColumnTitle,
  GridSideColumn,
} from '../Style/HomeStyle';
import { NewsItem, PanelData } from '../types/interface';
import { api, fetchHotReal, fetchPanels } from '../API/api';
import PostList from '../Component/PostNew';

const Home: React.FC = () => {
  const [panels, setPanels]     = useState<PanelData[]>([]);
  const [panelIndex, setPanelIndex] = useState(0);

  const [news, setNews]         = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const scrollToPanel = () => panelRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Fetch panels
  const loadPanels = async () => {
    try {
      const data = await fetchPanels();
      setPanels(data.sort((a, b) => a.sort_order - b.sort_order));
    } catch (err) {
      console.error('Lỗi fetch panels:', err);
    }
  }
  useEffect(() => {
    loadPanels();
  }, []);

  // Auto-cycle panels every 5s
  useEffect(() => {
    if (!panels.length) return;
    const iv = setInterval(() => {
      setPanelIndex(i => (i < panels.length - 1 ? i + 1 : 0));
    }, 5000);
    return () => clearInterval(iv);
  }, [panels]);


  // Fetch RSS hot-real
  const fetchNews = async () => {
    try{
      const data = await fetchHotReal();
      setNews(data);
      setLoadingNews(false);
    } catch (err) {
      console.error('Lỗi fetch news:', err);
    }
  }
  useEffect(() => {
    fetchNews();
  }, []);

  // Pagination / slicing
  const mainItems = news.slice(0, 2);
  const sideItems = news.slice(2);

  // Panel controls
  const prevPanel = () => setPanelIndex(i => Math.max(i - 1, 0));
  const nextPanel = () => setPanelIndex(i => Math.min(i + 1, panels.length - 1));

  return (
    <Background>
      {/* Panels carousel */}
      <SliderWrapper ref={panelRef}>
        <Slides $index={panelIndex}>
          {panels.map(p => (
            <Slide key={p.id} $url={p.image_url} />
          ))}
        </Slides>
        <PrevButton onClick={prevPanel}><FaChevronLeft/></PrevButton>
        <NextButton onClick={nextPanel}><FaChevronRight/></NextButton>
        <Dots>
          {panels.map((_, idx) => (
            <Dot key={idx} $active={idx === panelIndex} onClick={() => setPanelIndex(idx)} />
          ))}
        </Dots>
      </SliderWrapper>

      {/* Slides (projects) */}
      <Title>DỰ ÁN ĐANG MỞ BÁN</Title>
      <CardCarousel>
        <PostList />
      </CardCarousel>

      {/* News */}
      <NewsSection>
        <SectionTitle>TIN TỨC NỔI BẬT</SectionTitle>
        {loadingNews ? (
          <p>Đang tải tin tức…</p>
        ) : (
          <NewsGrid>
            <div>
              <ColumnTitle>DỰ ÁN HOT</ColumnTitle>
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
            </div>
            <GridSideColumn>
              <ColumnTitle>ĐẤT NỀN</ColumnTitle>
              <SideColumn>
                {sideItems.map((n, i) => (
                  <SideCard key={i} href={n.link} target="_blank" rel="noreferrer">
                    {n.image && <img src={n.image} alt={n.title} />}
                    <div>
                      <h4>{n.title}</h4>
                      <p>{n.summary}</p>
                    </div>
                  </SideCard>
                ))}
              </SideColumn>
            </GridSideColumn>
          </NewsGrid>
        )}
      </NewsSection>

      {/* Why choose us */}
      <SectionTitle>TẠI SAO LỰA CHỌN CHÚNG TÔI</SectionTitle>
      <Attraction>
        {[
          { icon: <FaInfo />,      title: 'THÔNG TIN CHÍNH THỐNG', infos: ['Cập nhật trực tiếp từ chủ đầu tư', 'Mới nhất', 'Chính xác nhất'] },
          { icon: <FaThumbsUp />,  title: 'ĐỐI TÁC UY TÍN',        infos: ['Pháp lý rõ ràng', 'Chính sách tốt', 'Bảo vệ quyền lợi'] },
          { icon: <FaCogs />,      title: 'GIẢI PHÁP ĐỒNG BỘ',      infos: ['Tư vấn A→Z', 'Tư vấn nội thất', 'Tư vấn pháp lý'] },
          { icon: <FaDollarSign />, title: 'SINH LỜI TỐI ĐA',       infos: ['Đầu tư hiệu quả', 'Gia tăng giá trị', 'Đa dạng sản phẩm'] },
        ].map((block, idx) => (
          <AttractionInfor key={idx}>
            <Icon onClick={scrollToPanel}>{block.icon}</Icon>
            <AttracTiontitle>{block.title}</AttracTiontitle>
            <TitleInfor>
              {block.infos.map((t, i) => <TextInfo key={i}>{t}</TextInfo>)}
            </TitleInfor>
          </AttractionInfor>
        ))}
      </Attraction>
    </Background>
  );
};

export default Home;
