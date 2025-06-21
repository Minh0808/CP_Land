// src/Component/PostList.tsx

import { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";
import { fetchPosts, PostDTO } from "../API/api";
import { Link } from "react-router-dom";

export interface PostListProps {
  /** Nếu true thì hiển thị carousel ngang, ngược lại grid dọc */
  horizontal?: boolean;
}

const PostList = forwardRef<HTMLDivElement, PostListProps>(({ horizontal }, ref) => {
  const [posts, setPosts]     = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data))
      .catch((err) => {
        console.error("Lỗi fetch posts:", err);
        setError("Không thể tải danh sách bài đăng.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container horizontal={horizontal} ref={ref}>
        <Message>Loading...</Message>
      </Container>
    );
  }

  if (error) {
    return (
      <Container horizontal={horizontal} ref={ref}>
        <MessageError>{error}</MessageError>
      </Container>
    );
  }

  if (posts.length === 0) {
    return (
      <Container horizontal={horizontal} ref={ref}>
        <Message>Chưa có bài đăng nào.</Message>
      </Container>
    );
  }

  return (
    <Container horizontal={horizontal} ref={ref}>
      {posts.map((post) => {
        const img = post.images?.[0];
        const thumbUrl = img
          ? img.data.startsWith("data:")
            ? img.data
            : `data:${img.contentType};base64,${img.data}`
          : "";

        return (
          <Card key={post.id}>
            <Link to={`/api/post/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              {thumbUrl
                ? <Image src={thumbUrl} alt={post.title} />
                : <Placeholder>No Image</Placeholder>
              }
              <CardBody>
                <Title>{post.title}</Title>
                <Meta>
                  <span>Giá từ: <PriceValue>{post.price.toLocaleString()}</PriceValue> ₫</span>
                  <span id="area">Diện tích: {post.area} m²</span>
                </Meta>
                <Address>
                  {post.address.street && `${post.address.street}, `}
                  {post.address.wardName}, {post.address.districtName}, {post.address.provinceName}
                </Address>
                <DateStr>
                  Đăng ngày:{" "}
                  {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                    day:   "2-digit",
                    month: "2-digit",
                    year:  "numeric",
                  })}
                </DateStr>
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

export const Container = styled.div<{ horizontal?: boolean }>`
  padding: 16px;
  max-width: ${({ horizontal }) => (horizontal ? "100%" : "1000px")};
  margin: ${({ horizontal }) => (horizontal ? "0" : "0 auto")};

  display: ${({ horizontal }) => (horizontal ? "flex" : "grid")};
  gap: 24px;

  @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      justify-content: center;
      justify-items: center;
    }
  /* hidden native scrollbar */
  ${({ horizontal }) =>
    horizontal
      ? `
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    
    /* Ẩn scrollbar */
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;

    & > * {
      flex: 0 0 auto;            /* không co dãn, không thu nhỏ */
      scroll-snap-align: start;  /* mỗi item sẽ snap */
      width: 280px;              /* hoặc min-width tuỳ bạn */
    }
  `
      : `
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  `}
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
  border: 2px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 2px 0 5px #c4c4c4;
  cursor: pointer;
  width: 300px;
  transition: border-color 0.15s ease-in-out, transform 0.15s;

  &:hover {
    border-bottom: 2px solid #ff6600;
  }

  @media (max-width: 768px) {
    width: 170px;
    height: 275px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #f2f2f2;

  @media (max-width: 768px) {
    height: 120px;
    padding: 5px;
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
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.h3`
  font-size: 18px;
  margin: 0 0 8px;
  color: #23527c;
  text-align: center;

  @media (max-width: 768px) {
    font-weight: bold;
    
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

const Address = styled.p`
  font-size: 14px;
  color: #555;
  margin: 4px 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DateStr = styled.p`
  font-size: 12px;
  color: #888;
  margin-top: auto;
  text-align: right;

  @media (max-width: 768px) {
    display: none;
  }
`;
const PriceValue = styled.span`
  color: #ff6600;
  font-weight: bold;
  font-size: 20px;
`;