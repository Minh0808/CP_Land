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
  SideColumn,
  SideCard,
  Attraction,
  AttractionInfor,
  Icon,
  AttracTiontitle,
  TitleInfor,
  TextInfo
} from '../Style/HomeStyle';
import PostList from '../Component/PostNew';
import { fetchPanels } from '../API/api';
import { fetchNewFeeds, NewfeedsAD } from '../API/api';
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

  // — Tin tức Admin (thay vì RSS) —
  const [news, setNews] = useState<NewfeedsAD[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchNewFeeds();
        setNews(data);
      } catch (err) {
        console.error('Lỗi fetch admin news:', err);
      } finally {
        setLoadingNews(false);
      }
    })();
  }, []);

  // Phân chia chính – phụ
  const mainItems = news.slice(0, 2);
  const sideItems = news.slice(2);

  // — Projects carousel (unchanged) —
  const projectsRef = useRef<HTMLDivElement>(null);
  const VISIBLE = 4;
  const [projectPage, setProjectPage] = useState(0);

  useEffect(() => {
    const c = projectsRef.current;
    if (!c) return;
    const cards = Array.from(c.children) as HTMLElement[];
    cards[projectPage * VISIBLE]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, [projectPage]);

  const nextProject = () => {
    const c = projectsRef.current;
    if (!c) return;
    const max = Math.ceil(c.children.length / VISIBLE) - 1;
    setProjectPage(p => (p < max ? p + 1 : 0));
  };
  const prevProject = () => {
    const c = projectsRef.current;
    if (!c) return;
    const max = Math.ceil(c.children.length / VISIBLE) - 1;
    setProjectPage(p => (p > 0 ? p - 1 : max));
  };

  // Scroll to panels
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollToPanel = () =>
    panelRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Background>
      {/* Slider panels */}
      <SliderWrapper ref={panelRef}>
        <Slides $index={panelIndex}>
          {panels.map(p => (
            <Slide key={p.id} $url={p.images[0].url} />
          ))}
        </Slides>
        <PrevButton onClick={prevPanel}><FaChevronLeft/></PrevButton>
        <NextButton onClick={nextPanel}><FaChevronRight/></NextButton>
        <Dots>
          {panels.map((_, i) => (
            <Dot key={i} $active={i===panelIndex} onClick={()=>setPanelIndex(i)}/>
          ))}
        </Dots>
      </SliderWrapper>

      {/* Projects carousel */}
      <Title>DỰ ÁN ĐANG MỞ BÁN</Title>
      <CardCarousel>
        <PrevButton onClick={prevProject}><FaChevronLeft/></PrevButton>
        <PostList horizontal ref={projectsRef} />
        <NextButton onClick={nextProject}><FaChevronRight/></NextButton>
      </CardCarousel>

      {/* News Admin */}
      <NewsSection>
        <SectionTitle>TIN TỨC NỔI BẬT</SectionTitle>
        {loadingNews ? (
          <p>Đang tải tin tức…</p>
        ) : (
          <NewsGrid>
            <div>
              <MainColumn>
                {mainItems.map((item) => {
                  const thumb = item.media[0]?.url;
                  return (
                    <MainCard
                      key={item.id}
                      href={`/tin-tuc/${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {thumb && <img src={thumb} alt={item.title} />}
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.excerpt}</p>
                      </div>
                    </MainCard>
                  );
                })}
              </MainColumn>
            </div>
            <GridSideColumn>
              <SideColumn>
                {sideItems.map((item) => {
                  const thumb = item.media[0]?.url;
                  return (
                    <SideCard
                      key={item.id}
                      href={`/tin-tuc/${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {thumb && <img src={thumb} alt={item.title} />}
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.excerpt}</p>
                      </div>
                    </SideCard>
                  );
                })}
              </SideColumn>
            </GridSideColumn>
          </NewsGrid>
        )}
      </NewsSection>

      {/* Why choose us */}
      <SectionTitle>TẠI SAO LỰA CHỌN CHÚNG TÔI</SectionTitle>
      <Attraction>
        {[
          { icon:<FaInfo/>,       title:'THÔNG TIN CHÍNH THỐNG', infos:['Cập nhật trực tiếp','Mới nhất','Chính xác nhất'] },
          { icon:<FaThumbsUp/>,   title:'ĐỐI TÁC UY TÍN',        infos:['Pháp lý rõ ràng','Chính sách tốt','Bảo vệ quyền lợi'] },
          { icon:<FaCogs/>,       title:'GIẢI PHÁP ĐỒNG BỘ',      infos:['Tư vấn A→Z','Tư vấn nội thất','Tư vấn pháp lý'] },
          { icon:<FaDollarSign/>, title:'SINH LỜI TỐI ĐA',        infos:['Đầu tư hiệu quả','Gia tăng giá trị','Đa dạng sản phẩm'] },
        ].map((block, i) => (
          <AttractionInfor key={i}>
            <Icon onClick={scrollToPanel}>{block.icon}</Icon>
            <AttracTiontitle>{block.title}</AttracTiontitle>
            <TitleInfor>
              {block.infos.map((txt,j)=><TextInfo key={j}>{txt}</TextInfo>)}
            </TitleInfor>
          </AttractionInfor>
        ))}
      </Attraction>
    </Background>
  );
};

export default Home;
