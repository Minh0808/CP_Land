// src/pages/NewFeedsList.tsx
import React, { useEffect, useState } from 'react';
import { fetchNewFeeds, NewfeedsAD } from '../API/api';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// mở rộng interface DTO

const Grid = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
   gap: 24px;
   padding: 24px;
`;

const Card = styled.div`
   background: #fff;
   border: 1px solid #ddd;
   border-radius: 6px;
   overflow: hidden;
   display: flex;
   flex-direction: column;
   transition: box-shadow 0.2s;
   &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   }
`;

const Thumb = styled.img`
   width: 100%;
   height: 180px;
   object-fit: cover;
`;

const Body = styled.div`
   padding: 16px;
   flex: 1;
   display: flex;
   flex-direction: column;
`;

const Title = styled.h3`
   font-size: 18px;
   margin: 0 0 8px;
   color: #23527c;
`;

const Excerpt = styled.p`
   flex: 1;
   font-size: 14px;
   color: #444;
   margin-bottom: 12px;
   overflow: hidden;
`;

const Meta = styled.div`
   font-size: 12px;
   color: #888;
   display: flex;
   justify-content: space-between;
`;

const NewFeedsList: React.FC = () => {
   const [feeds, setFeeds] = useState<NewfeedsAD[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchNewFeeds()
         .then((data) => setFeeds(data))
         .catch((err) => console.error(err))
         .finally(() => setLoading(false));
   }, []);

   if (loading) return <p style={{ textAlign: 'center' }}>Đang tải …</p>;
   if (feeds.length === 0) return <p style={{ textAlign: 'center' }}>Chưa có tin nào.</p>;

   return (
      <Grid>
         {feeds.map((feed) => {
            // lấy thumbnail đầu tiên nếu có
            const thumb = feed.media.find((m) => m.type === 'image')?.url;

            // format ngày
            const dateStr = new Date(feed.publishedAt!) // <-- non-null assertion
               .toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
               });

            return (
               <Link
                  key={feed.id}
                  to={`/tin-tuc/${feed.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
               >
                  <Card>
                     {thumb && <Thumb src={thumb} alt={feed.title} />}
                     <Body>
                        <Title>{feed.title}</Title>
                        <Excerpt>{feed.excerpt}</Excerpt>
                        <Meta>
                           {feed.category && <span>{feed.category}</span>}
                           <span>{dateStr}</span>
                        </Meta>
                     </Body>
                  </Card>
               </Link>
            );
         })}
      </Grid>
   );
};

export default NewFeedsList;
