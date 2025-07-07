// src/Component/PostList.tsx

import { forwardRef, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { fetchPosts, PostDTO } from '../API/api';
import { Link } from 'react-router-dom';

export interface PostListProps {
   horizontal?: boolean;
   filterKeyword?: string;
   filterPropertyType?: string;
   filterPriceMin?: number;
   filterPriceMax?: number;
   sortOrder?: 'price-asc' | 'price-desc';
   filterProvinceCode?: string;
   filterDistrictCode?: string;
   filterWardCode?: string;
}

const PostList = forwardRef<HTMLDivElement, PostListProps>(({ horizontal, ...props }, ref) => {
   const [posts, setPosts] = useState<PostDTO[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      fetchPosts()
         .then((data) => setPosts(data))
         .catch((err) => {
            console.error('Lỗi fetch posts:', err);
            setError('Không thể tải danh sách bài đăng.');
         })
         .finally(() => {
            setLoading(false);
         });
   }, []);

   // helper bỏ dấu
   function stripAccent(str: string) {
      return str
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '')
         .replace(/đ/g, 'd')
         .replace(/Đ/g, 'D');
   }

   const visiblePosts = useMemo(() => {
      return posts
         .filter((post) => {
            // 1) chuẩn hóa keyword
            const rawKw = (props.filterKeyword || '').trim().toLowerCase();
            let kw = stripAccent(rawKw);
            // biến khoảng trắng thành dấu -
            kw = kw.replace(/\s+/g, '-');

            // 2) chuẩn hóa title và address
            const titleNorm = stripAccent(post.title.toLowerCase());
            const inTitle = titleNorm.includes(stripAccent(rawKw));

            const streetNorm = stripAccent(post.address.street?.toLowerCase() || '');
            const districtNorm = stripAccent(post.address.districtName?.toLowerCase() || '');
            const provinceNorm = stripAccent(post.address.provinceName?.toLowerCase() || '');
            const inAddress =
               streetNorm.includes(stripAccent(rawKw)) ||
               districtNorm.includes(stripAccent(rawKw)) ||
               provinceNorm.includes(stripAccent(rawKw));

            // 3) chuẩn hóa slug của propertyType
            const slug = stripAccent(post.propertyType.toLowerCase());
            const inTypeSlug = slug.includes(kw);

            // 4) các filter còn lại
            const typeOK =
               !props.filterPropertyType || post.propertyType === props.filterPropertyType;

            const priceOK =
               (!props.filterPriceMin || post.price >= props.filterPriceMin) &&
               (!props.filterPriceMax || post.price <= props.filterPriceMax);
            const provOK =
               !props.filterProvinceCode || post.address.provinceCode === props.filterProvinceCode;
            const distOK =
               !props.filterDistrictCode || post.address.districtCode === props.filterDistrictCode;
            const wardOK = !props.filterWardCode || post.address.wardCode === props.filterWardCode;

            return (
               (rawKw === '' || inTitle || inAddress || inTypeSlug) &&
               typeOK &&
               priceOK &&
               provOK &&
               distOK &&
               wardOK
            );
         })
         .sort((a, b) => {
            if (props.sortOrder === 'price-asc') return a.price - b.price;
            if (props.sortOrder === 'price-desc') return b.price - a.price;
            return 0;
         });
   }, [
      posts,
      props.filterKeyword,
      props.filterPropertyType,
      props.filterPriceMin,
      props.filterPriceMax,
      props.sortOrder,
      props.filterProvinceCode,
      props.filterDistrictCode,
      props.filterWardCode,
   ]);

   if (loading) {
      return (
         <Container $horizontal={horizontal} ref={ref}>
            <Message>Loading...</Message>
         </Container>
      );
   }

   if (error) {
      return (
         <Container $horizontal={horizontal} ref={ref}>
            <MessageError>{error}</MessageError>
         </Container>
      );
   }

   if (visiblePosts.length === 0) {
      return (
         <Container $horizontal={horizontal} ref={ref}>
            <Message>Không tìm thấy kết quả.</Message>
         </Container>
      );
   }

   return (
      <Container $horizontal={horizontal} ref={ref}>
         {visiblePosts.map((post) => {
            const img = post.images?.[0];
            const thumbUrl = img ? img.url : '';

            return (
               <Card key={post.id}>
                  <Link
                     to={`/du-an/${post.id}`}
                     className="xs: w-[100%]"
                     style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                     }}
                  >
                     {thumbUrl ? (
                        <Image src={thumbUrl} alt={post.title} />
                     ) : (
                        <Placeholder>No Image</Placeholder>
                     )}
                     <CardBody>
                        <Title>{post.title}</Title>
                        {/* <div>{post.propertyType}</div> */}
                        <Meta>
                           <span>
                              Giá từ: <PriceValue>{post.price.toLocaleString()}</PriceValue> vn₫
                           </span>
                           {/* <span id="area">Diện tích: {post.area} m²</span> */}
                        </Meta>
                        {/* <Address>
                           {post.address.street && `${post.address.street}, `}
                           {post.address.wardName}, {post.address.districtName},{' '}
                           {post.address.provinceName}
                        </Address> */}
                        {/* <DateStr>
                           Đăng ngày:{' '}
                           {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                           })}
                        </DateStr> */}
                     </CardBody>
                  </Link>
               </Card>
            );
         })}
      </Container>
   );
});

export default PostList;

/* =================== Styled Components =================== */

export const Container = styled.div<{ $horizontal?: boolean }>`
   max-width: ${({ $horizontal }) => ($horizontal ? '100%' : '1000px')};
   margin: ${({ $horizontal }) => ($horizontal ? '0' : '0 auto')};
   display: ${({ $horizontal }) => ($horizontal ? 'flex' : 'grid')};
   gap: 24px;
   /* hidden native scrollbar */
   ${({ $horizontal }) =>
    $horizontal
      ? `
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;

    & > * {
      flex: 0 0 auto;
      scroll-snap-align: start;
      width: 280px;
    }
  `
      : `
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  `}


  /* Trên mobile (max-width: 768px) luôn hiện 2 cột */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 16px;
    margin: 0 auto;
  }
`;

const Message = styled.p`
   text-align: center;
   font-size: 18px;
   color: #555;
`;

const MessageError = styled(Message)`
   color: red;
`;

const Card = styled.div`
   background: #fff;
   border: 1px solid #c4c4c4;
   border-bottom: 2px solid #c4c4c4;
   border-radius: 5px;
   box-shadow: 2px 0 5px #c4c4c4;
   padding: 10px;
   cursor: pointer;
   width: 270px;
   padding: 10px;
   max-height: 310px;
   transition:
   border-color 0.15s ease-in-out,
   transform 0.15s;

   &:hover {
      border-bottom: 2px solid #ff6600;
   }

   @media (max-width: 768px) {
      width: 165px;
      max-height: 300px;
   }
`;

const Image = styled.img`
   width: 100%;
   height: 150px;
   object-fit: cover;
   background-color: #f2f2f2;

   @media (max-width: 768px) {
      max-height: 110px;
   }
`;

const Placeholder = styled.div`
   width: 100%;
   height: 180px;
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: #e0e0e0;
   color: #888;
   font-size: 14px;

   @media (max-width: 768px) {
      display: none;
   }
`;

const CardBody = styled.div`
   padding-top: 12px;
   display: flex;
   flex-direction: column;
   align-items: center;
`;

const Title = styled.h3`
   font-size: 14px;
   font-weight: bold;
   margin: 0 0 8px;
   color: #23527c;
   overflow-wrap: break-word;

   @media (max-width: 768px) {
      font-size: 13px;
   }
`;

const Meta = styled.div`
   font-size: 14px;
   color: #555;
   display: flex;
   justify-content: space-between;
   margin-bottom: 8px;

   @media (max-width: 768px) {
      span#area {
         display: none;
      }
   }
`;

// const Address = styled.p`
//    font-size: 14px;
//    color: #555;
//    margin: 4px 0;

//    @media (max-width: 768px) {
//       display: none;
//    }
// `;

// const DateStr = styled.p`
//    font-size: 12px;
//    color: #888;
//    margin-top: auto;
//    text-align: right;

//    @media (max-width: 768px) {
//       display: none;
//    }
// `;
const PriceValue = styled.span`
   color: #ff6600;
   font-weight: bold;
   font-size: 24px;

   @media (max-width: 768px) {
      font-size: 18px;
   }
`;
