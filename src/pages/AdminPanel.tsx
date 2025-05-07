// src/pages/AdminPanel.tsx
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface Panel {
  id: number;
  image_url: string;
  sort_order: number;
}

const AdminPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy base URL từ env hoặc fallback về origin
  const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || window.location.origin;

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      const { data } = await axios.get<Panel[]>(`${API_BASE}/api/panels`);
      setPanels(data);
    } catch (err: any) {
      console.error(err);
      setError('Không tải được panels.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Vui lòng chọn ảnh trước khi upload.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('image', file);

      const res = await axios.post(`${API_BASE}/api/panels`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPanels(prev => [...prev, res.data]);
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Upload thất bại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <h1>Quản trị Panels</h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Button type="submit" disabled={uploading}>
          {uploading ? 'Đang upload...' : 'Tạo panel mới'}
        </Button>
      </Form>

      {error && <Message>{error}</Message>}

      <List>
        {panels.map(p => (
          <Item key={p.id}>
            <img
              src={
                p.image_url.startsWith('http')
                  ? p.image_url
                  : `${API_BASE}${p.image_url}`
              }
              alt={`Panel ${p.id}`}
              width={150}
            />
            <div>Order: {p.sort_order}</div>
          </Item>
        ))}
      </List>
    </Container>
  );
};

export default AdminPanel;

/* Styled Components */

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Item = styled.div`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

const Button = styled.button`
  background: #00539c;
  color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const Message = styled.p`
  color: red;
  margin: 8px 0;
`;
