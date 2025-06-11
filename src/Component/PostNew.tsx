// src/Component/PostList.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../API/api";
import { Link } from "react-router-dom";

interface PostRow {
  id:           string;
  title:        string;
  description:  string;
  propertyType: string;
  price:        number;
  area:         number;
  address: {
    provinceCode: string;
    provinceName: string;
    districtCode: string;
    districtName: string;
    wardCode:     string;
    wardName:     string;
    street:       string;
  };
  images:       string[];    // luôn là mảng URL (relative or absolute)
  createdAt:    string;
}

const PostList: React.FC = () => {
  const [posts, setPosts]     = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    api.get<PostRow[]>("/posts")
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi fetch posts:", err);
        setError("Không thể tải danh sách bài đăng.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container>
        <Message>Đang tải bài đăng…</Message>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <MessageError>{error}</MessageError>
      </Container>
    );
  }

  if (posts.length === 0) {
    return (
      <Container>
        <Message>Chưa có bài đăng nào.</Message>
      </Container>
    );
  }

  return (
    <Container>
      <Grid>
        {posts.map(post => {
          const thumbUrl = post.images[0] || "";

          return (
            <Card key={post.id}>
              <Link to={`/post/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {thumbUrl ? (
                  <Image src={thumbUrl} alt={post.title} />
                ) : (
                  <Placeholder>No Image</Placeholder>
                )}
                <CardBody>
                  <Title>{post.title}</Title>
                  <Meta>
                    <span>Giá: {post.price.toLocaleString()} ₫</span>
                    <span>Diện tích: {post.area} m²</span>
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
                      year:  "numeric"
                    })}
                  </DateStr>
                </CardBody>
              </Link>
            </Card>
          );
        })}
      </Grid>
    </Container>
  );
};

export default PostList;

/* ===== Styled Components ===== */

const Container = styled.div`
  margin-top: 100px;
  padding: 16px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const Message = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

const MessageError = styled(Message)`
  color: red;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: border-color 0.15s ease-in-out, transform 0.15s;
  &:hover {
    border-color: #ff6600;
    transform: translateY(-3px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #f2f2f2;
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
  color: #333;
`;

const Meta = styled.div`
  font-size: 14px;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Address = styled.p`
  font-size: 14px;
  color: #555;
  margin: 4px 0;
`;

const DateStr = styled.p`
  font-size: 12px;
  color: #888;
  margin-top: auto;
  text-align: right;
`;
