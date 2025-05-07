// src/pages/AdminSlides.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface Slide {
  id: number;
  image_url: string;
  title: string;
  price: string;
  details: string;
  sort_order: number;
}

const AdminSlides: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editing, setEditing] = useState<Partial<Slide> | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data } = await axios.get<Slide[]>('/api/slides');
    setSlides(data);
  };

  const handleEdit = (s: Slide) => {
    setEditing(s);
    setFile(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xác nhận xóa slide này?')) return;
    await axios.delete(`/api/slides/${id}`);
    fetchSlides();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSave = async () => {
    const form = new FormData();
    if (editing?.title) form.append('title', editing.title);
    if (editing?.price) form.append('price', editing.price);
    if (editing?.details) form.append('details', editing.details);
    form.append('sort_order', (editing?.sort_order ?? 0).toString());
    if (file) form.append('image', file);
    
    if (editing?.id) {
      await axios.put(`/api/slides/${editing.id}`, form);
    } else {
      await axios.post('/api/slides', form);
    }
    setEditing(null);
    fetchSlides();
  };

  return (
    <Container>
      <h1>Quản lý Slides</h1>
      <Button onClick={() => setEditing({ title: '', price: '', details: '', sort_order: 0 })}>
        + Thêm slide mới
      </Button>

      <List>
        {slides.map(s => (
          <Item key={s.id}>
            <img src={s.image_url} alt="" width={120} />
            <div>
              <strong>{s.title}</strong><br/>
              Giá: {s.price}
            </div>
            <Actions>
              <button onClick={() => handleEdit(s)}>Sửa</button>
              <button onClick={() => handleDelete(s.id)}>Xóa</button>
            </Actions>
          </Item>
        ))}
      </List>

      {editing && (
        <Modal>
          <h2>{editing.id ? 'Sửa' : 'Thêm'} slide</h2>
          <Form>
            <label>Tiêu đề
              <input name="title" value={editing.title} onChange={handleChange} />
            </label>
            <label>Giá
              <input name="price" value={editing.price} onChange={handleChange} />
            </label>
            <label>Ảnh
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
            <label>Thứ tự
              <input type="number" name="sort_order" value={editing.sort_order} onChange={handleChange} />
            </label>
            <Button onClick={handleSave}>Lưu</Button>
            <Button alt onClick={() => setEditing(null)}>Hủy</Button>
          </Form>
        </Modal>
      )}
    </Container>
  );
};

/* Styled */
const Container = styled.div`padding: 20px;`;
const Button = styled.button<{ alt?: boolean }>`
  background: ${({ alt }) => (alt ? '#ccc' : '#00539c')};
  color: white; padding: 8px 12px; margin: 8px;
  border: none; cursor: pointer;
`;
const List = styled.div`display: flex; flex-wrap: wrap; gap: 12px;`;
const Item = styled.div`
  border: 1px solid #ddd; padding: 8px; display: flex; align-items: center; gap: 8px;
`;
const Actions = styled.div`margin-left: auto; button { margin-left: 4px; }`;
const Modal = styled.div`
  position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
  background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.3);
`;
const Form = styled.div`
  display: flex; flex-direction: column; gap: 12px;
  label { display: flex; flex-direction: column; font-weight: 500; }
`;
export default AdminSlides