// src/components/PostDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { fetchPostById } from "../API/api";
import { PostDTO, IImage } from "../API/api";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainIndex, setMainIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      setError("ID không hợp lệ");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const data = await fetchPostById(id);
        setPost(data);
      } catch (err: any) {
        setError(err.message || "Không tìm thấy bài viết");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <Message>Đang tải...</Message>;
  }
  if (error) {
    return <MessageError>{error}</MessageError>;
  }
  if (!post) {
    return <MessageError>Không có dữ liệu để hiển thị</MessageError>;
  }

  const images: IImage[] = post.images;
  const mainUrl = images[mainIndex]?.url;

  return (
    <Container>
      <BackLink to="/du-an">← Quay về danh sách</BackLink>

      <Title>{post.title}</Title>
      <Meta>
        <span>Giá: {post.price.toLocaleString()} ₫</span> |{" "}
        <span>Diện tích: {post.area} m²</span> |{" "}
        <span>Loại: {post.propertyType}</span>
      </Meta>

      <Info>
        <strong>Địa chỉ:</strong>{" "}
        {post.address.street && `${post.address.street}, `}
        {post.address.wardName}, {post.address.districtName},{" "}
        {post.address.provinceName}
      </Info>

      <Info>
        <strong>Ngày đăng:</strong>{" "}
        {new Date(post.createdAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Info>

      <Section>
        <SectionTitle>Mô tả</SectionTitle>
        {post.description ? (
          <Description>{post.description}</Description>
        ) : (
          <Description>
            <i>(Chưa có mô tả chi tiết.)</i>
          </Description>
        )}
      </Section>

      <Section>
        <SectionTitle>Hình ảnh</SectionTitle>
        {images.length === 0 ? (
          <MessagePlain>Chưa có hình ảnh.</MessagePlain>
        ) : (
          <GalleryWrapper>
            <MainImageWrapper>
              <MainImage src={mainUrl} alt={`ảnh chính của ${post.title}`} />
            </MainImageWrapper>
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
    </Container>
  );
};

export default PostDetail;

/* Styled Components */
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 16px 40px;
  background: #fdfdfd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin: 16px 0;
  color: #00539c;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 16px;
  color: #555;
`;
const MessageError = styled(Message)`
  color: red;
`;
const MessagePlain = styled.p`
  font-size: 14px;
  color: #777;
`;

const Title = styled.h2`
  margin: 16px 0 8px;
  color: #333;
`;
const Meta = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
`;
const Info = styled.p`
  font-size: 14px;
  color: #555;
  margin: 4px 0;
`;

const Section = styled.div`
  margin-top: 24px;
`;
const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
`;
const Description = styled.p`
  font-size: 15px;
  color: #444;
  line-height: 1.6;
`;

const GalleryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const MainImageWrapper = styled.div`
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
`;
const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const Thumbs = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;
const ThumbItem = styled.div<{ $active: boolean }>`
  width: 100px;
  height: 70px;
  border: 2px solid ${({ $active }) => ($active ? "#ff6600" : "#ddd")};
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover {
    border-color: #ff6600;
  }
`;
const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
