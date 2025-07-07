// src/pages/NewFeedsDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNewFeedById, NewfeedsAD } from '../API/api';
import styled from 'styled-components';

const Container = styled.div`
   max-width: 90%;
   margin: 2rem auto;
   padding-top: 50px;
`;

const Title = styled.h1`
   font-size: 36px;
   margin-bottom: 0.5rem;
   color: #015ea7;
   font-weight: bold;
   @media (max-width: 768px) {
      font-size: 22px;
   }
`;

const Excerpt = styled.p`
   font-style: italic;
   font-weight: bold;
   font-size: 22px;
   color: #666;
   margin-bottom: 1.5rem;
   @media (max-width: 768px) {
      font-size: 16px;
   }
`;

const Content = styled.div`
   line-height: 1.6;
   margin-bottom: 2rem;

   img,
   video,
   iframe {
      max-width: 100%;
      margin: 1rem 0;
   }
`;

// const MediaGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(240px,1fr));
//   gap: 16px;
//   margin-top: 2rem;
// `;

// const MediaCard = styled.div`
//   overflow: hidden;
//   border: 1px solid #ddd;
//   border-radius: 4px;

//   img, video, iframe {
//     width: 100%;
//     display: block;
//   }
// `;

const NewFeedsDetail: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const [feed, setFeed] = useState<NewfeedsAD | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!id) return;
      fetchNewFeedById(id)
         .then((f) => setFeed(f))
         .catch((err) => {
            console.error(err);
            setError('Không tìm thấy bài viết.');
         })
         .finally(() => setLoading(false));
   }, [id]);

   if (loading) return <Container>Đang tải…</Container>;
   if (error) return <Container>{error}</Container>;
   if (!feed) return <Container>Bài viết không tồn tại.</Container>;

   // Lọc riêng media để show grid
   //   const extraMedia: MediaItem[] = feed.media.filter(() => {
   //     // nếu embed hoặc video, mình có thể show lại
   //     return true;
   //   });

   return (
      <Container>
         <Title>{feed.title}</Title>
         <Excerpt
         >
            {feed.excerpt}
         </Excerpt>

         <Content dangerouslySetInnerHTML={{ __html: feed.content }} />

         {/* {extraMedia.length > 0 && (
        <>
          <h3>Thư viện</h3>
          <MediaGrid>
            {extraMedia.map(m => (
              <MediaCard key={m.key}>
                {m.type === 'image' && <img src={m.url} alt="" />}
                {m.type === 'video' && (
                  // nếu là embed iframe, bạn có thể render <iframe> luôn
                  m.url.startsWith('http') && m.url.includes('youtube')
                    ? <iframe
                        src={m.url}
                        frameBorder={0}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    : <video src={m.url} controls />
                )}
              </MediaCard>
            ))}
          </MediaGrid>
        </>
      )} */}
      </Container>
   );
};

export default NewFeedsDetail;
