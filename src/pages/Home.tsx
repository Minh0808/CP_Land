// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaThumbsUp,
  FaInfo,
  FaCogs,
  FaDollarSign
} from 'react-icons/fa';
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
  NewsSection,
  SectionTitle,
  NewsGrid,
  MainColumn,
  MainCard,
  GridSideColumn,
  ColumnTitle,
  SideColumn,
  SideCard,
  Attraction,
  AttractionInfor,
  Icon,
  AttracTiontitle,
  TitleInfor,
  TextInfo
} from '../Style/HomeStyle';
import { NewsItem } from '../types/interface';
import { fetchHotReal, fetchPanels } from '../API/api';
import PostList from '../Component/PostNew';
import type { Panel } from '../API/api';

const Home: React.FC = () => {
  // — Panels carousel (unchanged) —
  const [panels, setPanels] = useState<Panel[]>([]);
  const [panelIndex, setPanelIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPanels();
        setPanels(data);
      } catch (err) {
        console.error('Lỗi fetch panels:', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!panels.length) return;
    const iv = setInterval(() => {
      setPanelIndex(i => (i < panels.length - 1 ? i + 1 : 0));
    }, 5000);
    return () => clearInterval(iv);
  }, [panels]);

  const prevPanel = () => setPanelIndex(i => Math.max(i - 1, 0));
  const nextPanel = () => setPanelIndex(i => Math.min(i + 1, panels.length - 1));

  // — News section (unchanged) —
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHotReal();
        setNews(data);
      } catch (err) {
        console.error('Lỗi fetch news:', err);
      } finally {
        setLoadingNews(false);
      }
    })();
  }, []);
  const mainItems = news.slice(0, 2);
  const sideItems = news.slice(2);

  const projectsRef = useRef<HTMLDivElement>(null);
  const VISIBLE = 4;
  const [projectPage, setProjectPage] = useState(0);

  // Scroll mỗi khi projectPage thay đổi
  useEffect(() => {
    const c = projectsRef.current;
    if (!c) return;
    const cards = Array.from(c.children) as HTMLElement[];
    const idx = projectPage * VISIBLE;
    cards[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, [projectPage]);

  const nextProject = () => {
    const c = projectsRef.current;
    if (!c) return;
    const maxPage = Math.ceil(c.children.length / VISIBLE) - 1;
    setProjectPage(p => (p < maxPage ? p + 1 : 0));
  };
  const prevProject = () => {
    const c = projectsRef.current;
    if (!c) return;
    const maxPage = Math.ceil(c.children.length / VISIBLE) - 1;
    setProjectPage(p => (p > 0 ? p - 1 : maxPage));
  };

  // Scroll từ “Why choose us” lên panels
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollToPanel = () =>
    panelRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Background>
      {/* Panels */}
      <SliderWrapper ref={panelRef}>
        <Slides $index={panelIndex}>
          {panels.map(p => (
            <Slide key={p.id} $url={p.images[0].url} />
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

      {/* Projects */}
      <Title>DỰ ÁN ĐANG MỞ BÁN</Title>
      <CardCarousel>
        <PrevButton onClick={prevProject}>
          <FaChevronLeft />
        </PrevButton>

        <PostList horizontal ref={projectsRef} />

        <NextButton onClick={nextProject}>
          <FaChevronRight />
        </NextButton>
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
                  <MainCard
                    key={i}
                    href={n.link}
                    target="_blank"
                    rel="noreferrer"
                  >
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
                  <SideCard
                    key={i}
                    href={n.link}
                    target="_blank"
                    rel="noreferrer"
                  >
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
          {
            icon: <FaInfo />,
            title: 'THÔNG TIN CHÍNH THỐNG',
            infos: [
              'Cập nhật trực tiếp từ chủ đầu tư',
              'Mới nhất',
              'Chính xác nhất'
            ]
          },
          {
            icon: <FaThumbsUp />,
            title: 'ĐỐI TÁC UY TÍN',
            infos: ['Pháp lý rõ ràng', 'Chính sách tốt', 'Bảo vệ quyền lợi']
          },
          {
            icon: <FaCogs />,
            title: 'GIẢI PHÁP ĐỒNG BỘ',
            infos: [
              'Tư vấn A→Z',
              'Tư vấn nội thất',
              'Tư vấn pháp lý'
            ]
          },
          {
            icon: <FaDollarSign />,
            title: 'SINH LỜI TỐI ĐA',
            infos: [
              'Đầu tư hiệu quả',
              'Gia tăng giá trị',
              'Đa dạng sản phẩm'
            ]
          }
        ].map((block, idx) => (
          <AttractionInfor key={idx}>
            <Icon onClick={scrollToPanel}>{block.icon}</Icon>
            <AttracTiontitle>{block.title}</AttracTiontitle>
            <TitleInfor>
              {block.infos.map((t, i) => (
                <TextInfo key={i}>{t}</TextInfo>
              ))}
            </TitleInfor>
          </AttractionInfor>
        ))}
      </Attraction>
    </Background>
  );
};

export default Home;
