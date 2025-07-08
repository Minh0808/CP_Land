import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Searchbar from '../Component/SearchBar';
import PostList from '../Component/PostNew';
import { useNavigate } from 'react-router-dom';
import { SearchbarQuery } from '../types/interface';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { fetchNewFeeds, NewfeedsAD } from '../API/api';

const Project: React.FC = () => {
   const [news, setNews] = useState<NewfeedsAD[]>([]);
   const sideNews = news.slice(0, 8);
   const [filter, setFilter] = useState<SearchbarQuery>({
      keyword: '',
      propertyType: '',
      sortOrder: 'price-asc',
      provinceCode: '',
      districtCode: '',
      wardCode: '',
   });
   const navigate = useNavigate();

   const handleBack = () => {
      navigate('/du-an');
      window.location.reload();
   };

   useEffect(() => {
      fetchNewFeeds()
         .then(setNews)
         .catch((err) => console.error('Error fetching admin news:', err));
   }, []);
   return (
      <Wraper>
         <Searchbar onSearch={(q) => setFilter(q)} />
         <BackList>
            <IoArrowBackCircleSharp
               onClick={handleBack}
               style={{
                  color: 'blue',
                  fontSize: '32px',
               }}
            />
         </BackList>

         <ProjectBody>
            <PostList
               filterKeyword={filter.keyword}
               filterPropertyType={filter.propertyType}
               filterProvinceCode={filter.provinceCode} // ← phải có
               filterDistrictCode={filter.districtCode} // ← phải có
               filterWardCode={filter.wardCode}
               sortOrder={filter.sortOrder}
            />

            <Sidebar>
               <SidebarHeader>TIN TỨC MỚI</SidebarHeader>
               <SidebarList>
                  {sideNews.map((item) => {
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
         </ProjectBody>
      </Wraper>
   );
};
export default Project;

const Wraper = styled.div`
   margin-top: 100px;
   width: 100%;
   height: 100%;

   @media (max-width: 768px) {
      margin-top: 50px;
   }
`;

const ProjectBody = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   max-width: 90%;
   margin: 0 auto;
   padding-bottom: 50px;

   @media (max-width: 768px) {
      flex-direction: column;
   }
`;

const Sidebar = styled.aside`
   width: 300px;
   height: 615px;
   display: flex;
   flex-direction: column;
   background: #fff;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
   border-radius: 4px;
   overflow: hidden;
   @media (max-width: 768px) {
      display: none;
   }
`;
const SidebarHeader = styled.div`
   background: #f7931e;
   color: #fff;
   font-weight: bold;
   text-align: center;
   padding: 12px 0;
`;
const SidebarList = styled.div`
   display: flex;
   flex-direction: column;
`;
const SidebarItem = styled.a`
   display: flex;
   align-items: center;
   gap: 12px;
   padding: 8px 10px;
   text-decoration: none;
   color: #333;
   border-bottom: 1px solid #eee;

   &:last-child {
      border-bottom: none;
   }

   img {
      flex: 0 0 60px;
      height: 40px;
      object-fit: cover;
      border-radius: 2px;
   }

   span {
      flex: 1;
      font-size: 14px;
      line-height: 1.3;
      font-weight: bold;
      color: #015ea7;
   }

   &:hover {
      background: #f5f5f5;
   }
`;

const BackList = styled.div`
   width: 100%;
   margin-left: 70px;
   margin-top: 20px;
   cursor: pointer;
   padding-bottom: 10px;

   @media (max-width: 768px) {
      margin-left: 15px;
   }
`;