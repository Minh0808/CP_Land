import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled-components gọn nhẹ
const Container = styled.div`
  padding: 24px;
`;
const Title = styled.h1`
  margin-bottom: 16px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  input, textarea {
    padding: 8px;
    font-size: 1rem;
    width: 100%;
  }
  button {
    width: 120px;
    padding: 8px;
    cursor: pointer;
  }
`;
const List = styled.ul`
  list-style: none;
  padding: 0;
`;
const Item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
`;
const Info = styled.div`
  flex: 1;
  & > a {
    font-weight: bold;
    text-decoration: none;
  }
  & > p {
    margin: 4px 0;
    font-size: 0.9rem;
  }
`;
const DeleteBtn = styled.button`
  background: crimson;
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
`;

interface AdminNewsItem {
  id: number;
  title: string;
  link: string;
  image_url: string | null;
  summary: string | null;
}

const AdminNews: React.FC = () => {
  const [list, setList] = useState<AdminNewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');

  // 1) load danh sách
  const fetchList = () => {
    axios.get<AdminNewsItem[]>('/api/admin/news')
      .then(res => setList(res.data))
      .catch(console.error);
  };
  useEffect(fetchList, []);

  // 2) handle thêm
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('/api/admin/news', {
      title, link, image_url: imageUrl, summary
    })
    .then(() => {
      setTitle(''); setLink(''); setImageUrl(''); setSummary('');
      fetchList();
    })
    .catch(console.error);
  };

  // 3) xóa
  const onDelete = (id: number) => {
    if (!window.confirm('Xác nhận xóa tin này?')) return;
    axios.delete(`/api/admin/news/${id}`)
      .then(fetchList)
      .catch(console.error);
  };

  return (
    <Container>
      <Title>Quản lý Custom News</Title>

      <Form onSubmit={onSubmit}>
        <input
          placeholder="Tiêu đề"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Link (URL)"
          value={link}
          onChange={e => setLink(e.target.value)}
          required
        />
        <input
          placeholder="Image URL (tùy chọn)"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />
        <textarea
          placeholder="Summary (tùy chọn)"
          rows={3}
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
        <button type="submit">Thêm mới</button>
      </Form>

      <List>
        {list.map(item => (
          <Item key={item.id}>
            <Info>
              <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
              {item.summary && <p>{item.summary}</p>}
            </Info>
            <DeleteBtn onClick={() => onDelete(item.id)}>Xóa</DeleteBtn>
          </Item>
        ))}
      </List>
    </Container>
  );
};

export default AdminNews;
