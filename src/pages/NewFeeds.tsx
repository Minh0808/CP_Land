// src/pages/NewFeeds.tsx
import React, { useState, useEffect } from "react";
import {
  ArrowButton,
  Background,
  MainCard,
  MainColumn,
  PageButton,
  Pagination,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarList,
  Wrapper
} from "../Style/NewFeedsStyle";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchNewFeeds, NewfeedsAD } from '../API/api';

const ITEMS_PER_PAGE = 10;

const NewFeeds: React.FC = () => {
  const [news, setNews] = useState<NewfeedsAD[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNewFeeds()
      .then(setNews)
      .catch(err => console.error('Error fetching admin news:', err));
  }, []);

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const mainNews = news.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const sideNews = news.slice(0, 8);

  return (
    <Background>
      <Wrapper>
        {/* Column chính */}
        <MainColumn>
          {mainNews.map(item => {
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

          {/* Phân trang */}
          <Pagination>
            {currentPage > 1 && (
              <ArrowButton onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                <FaChevronLeft />
              </ArrowButton>
            )}

            {Array.from({ length: totalPages }, (_, i) => (
              <PageButton
                key={i + 1}
                $active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}

            {currentPage < totalPages && (
              <ArrowButton onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
                <FaChevronRight />
              </ArrowButton>
            )}
          </Pagination>
        </MainColumn>

        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>TIN TỨC MỚI</SidebarHeader>
          <SidebarList>
            {sideNews.map(item => {
              const thumb = item.media[0]?.url;
              return (
                <SidebarItem
                  key={item.id}
                  href={`/tin-tuc/${item.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {thumb && <img src={thumb} alt={item.title} />}
                  <span>{item.title}</span>
                </SidebarItem>
              );
            })}
          </SidebarList>
        </Sidebar>
      </Wrapper>
    </Background>
  );
};

export default NewFeeds;
