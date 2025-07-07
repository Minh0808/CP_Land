// src/components/PostDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPostById } from '../API/api';
import { PostDTO, IImage } from '../API/api';

export const propertyTypeMap: Record<string, string> = {
   'biet-thu': 'Biệt thự',
   'can-ho/chung-cu': 'Căn hộ - Chung cư',
   'nha-pho': 'Nhà phố',
   'dat-nen': 'Đất nền',
   'van-phong/mat-bang': 'Văn phòng – Mặt bằng',
   // … thêm các loại khác …
};

const PostDetail: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const [post, setPost] = useState<PostDTO | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [mainIndex, setMainIndex] = useState(0);

   useEffect(() => {
      if (!id) {
         setError('ID không hợp lệ');
         setLoading(false);
         return;
      }
      (async () => {
         try {
            setLoading(true);
            const data = await fetchPostById(id);
            setPost(data);
         } catch (err: any) {
            setError(err.message || 'Không tìm thấy bài viết');
         } finally {
            setLoading(false);
         }
      })();
   }, [id]);

   if (loading) return <Message>Đang tải...</Message>;
   if (error)   return <MessageError>{error}</MessageError>;
   if (!post)  return <MessageError>Không có dữ liệu để hiển thị</MessageError>;

   const images: IImage[] = post.images;
   const type = propertyTypeMap[post.propertyType] || post.propertyType;

   return (
      <Container>
         <BackLink to="/du-an">← Quay về danh sách</BackLink>

         <Title>{post.title}</Title>

         <PostDetailbody>
            <Section>
               {images.length === 0 ? (
                  <MessagePlain>Chưa có hình ảnh.</MessagePlain>
               ) : (
                  <GalleryWrapper>
                     <MainViewport>
                        <MainTrack $index={mainIndex}>
                           {images.map((img) => (
                              <MainSlide key={img.url} src={img.url} alt={`ảnh ${mainIndex}`} />
                           ))}
                        </MainTrack>
                     </MainViewport>
                     <Thumbs>
                        {images.map((img, idx) => (
                           <ThumbItem
                              key={idx}
                              $active={idx === mainIndex}
                              onClick={() => setMainIndex(idx)}
                           >
                              <ThumbImg src={img.url} alt={`thumb ${idx}`} />
                           </ThumbItem>
                        ))}
                     </Thumbs>
                  </GalleryWrapper>
               )}
            </Section>
            <InfoDetail>
               <Meta>
                  <span>
                     Giá: <PriceValue>{post.price.toLocaleString()}</PriceValue> vn₫
                  </span>{' '}|
                  <span>Diện tích: {post.area} m²</span> |{' '}
                  <span>Loại: {type}</span>
               </Meta>

               <Info>
                  <strong>Địa chỉ:</strong>{' '}
                  {post.address.street && `${post.address.street}, `}
                  {post.address.wardName}, {post.address.districtName}, {post.address.provinceName}
               </Info>

               <Info>
                  <strong>Ngày đăng:</strong>{' '}
                  {new Date(post.createdAt).toLocaleString('vi-VN', {
                     day: '2-digit', month: '2-digit', year: 'numeric',
                     hour: '2-digit', minute: '2-digit',
                  })}
               </Info>

               <Section>
                  <SectionTitle>Mô tả:</SectionTitle>
                  {post.description ? (
                     <Description>{post.description}</Description>
                  ) : (
                     <Description><i>(Chưa có mô tả chi tiết.)</i></Description>
                  )}
               </Section>
            </InfoDetail>
         </PostDetailbody>
      </Container>
   );
};

export default PostDetail;

/* =========== Styled Components =========== */
const Container = styled.div`
   max-width: 90%; margin: 40px auto; padding: 0 16px 40px;
   @media (max-width: 768px) { max-width: 100%; }
`;
const PostDetailbody = styled.div`
   display: flex; flex-direction: row; gap: 20px; margin-top: 50px; padding-bottom: 24px;
   @media (max-width: 768px) { flex-direction: column; }
`;
const InfoDetail = styled.div`
   width: 500px; display: flex; flex-direction: column; align-items: flex-start;
   overflow: hidden; word-wrap: break-word;
   @media (max-width: 768px) { width: 100%; }
`;
const BackLink = styled(Link)`
   display: inline-block; margin: 16px 0; color: #00539c; text-decoration: none;
   &:hover { text-decoration: underline; }
`;
const Message = styled.p` text-align: center; font-size: 16px; color: #555; `;
const MessageError = styled(Message)` color: red; `;
const MessagePlain = styled.p` font-size: 14px; color: #777; `;
const Title = styled.h2`
   margin: 16px 0 8px; color: #00539c; text-align: center; font-size: 32px; font-weight: bold;
   @media (max-width: 768px) { font-size: 22px; }
`;
const Meta = styled.div`
   display: flex; font-size: 18px; color: #555; margin-bottom: 12px;
   justify-content: flex-end; gap: 10px; align-items: center;
   @media (max-width: 768px) { 
      font-size: 14px; 
      word-wrap: break-word; 
      gap: 5px;
      .span{ white-space: nowrap; } 
   }
`;
const Info = styled.p` font-size: 16px; color: #555; margin: 4px 0; `;
const Section = styled.div`
   @media (max-width: 768px) { width: 100%; }
`;
const SectionTitle = styled.h3`
   font-size: 18px; margin-bottom: 8px; color: #333; font-weight: bold;
`;
const Description = styled.p` 
   font-size: 16px; 
   color: #444; 
   line-height: 1.6; 
   @media (max-width: 768px) { 
      font-size: 14px; 
      word-wrap: break-word;
      width: 100%;
   }
`;

const GalleryWrapper = styled.div`
   display: flex; flex-direction: column; gap: 16px;
`;

/* Main slider */
const MainViewport = styled.div`
   width: 750px; height: 400px; overflow: hidden;
   @media (max-width: 768px) { width: 100%; height: 100%; }
`;
const MainTrack = styled.div<{ $index: number }>`
   display: flex; transition: transform 0.6s ease;
   transform: translateX(${p => `-${p.$index * 750}px`});
   @media (max-width: 768px) { transform: translateX(${p => `-${p.$index * 100}%`}) }
`;
const MainSlide = styled.img`
   width: 750px; height: 400px; object-fit: cover; flex-shrink: 0;
   @media (max-width: 768px) { width: 100%; height: 250px; }
`;

/* Thumbnails */
const Thumbs = styled.div`
   display: flex; gap: 12px; flex-wrap: wrap;
   @media (max-width: 768px) { justify-content: space-between; }
`;
const ThumbItem = styled.div<{ $active: boolean }>`
   width: 150px; height: 100px;
   transition: transform 0.6s, opacity 0.2s ease;
   opacity: ${({ $active }) => ($active ? 1 : 0.5)};
   overflow: hidden; cursor: pointer;
   &:hover { opacity: 1; }
   @media (max-width: 768px) { width: 75px; height: 55px; }
`;
const ThumbImg = styled.img`
   width: 100%; height: 100%; object-fit: cover;
   transform: scaleY(1.1) translateY(0);
   transition: transform 0.4s ease;
   ${ThumbItem}:hover & {
      transform: scaleY(1.1) translateY(-5px);
      transition: transform 0.6s ease;
   }
`;

const PriceValue = styled.span`
   color: #ff6600; font-weight: bold; font-size: 24px;
   @media (max-width: 768px) { font-size: 16px; }
`;
