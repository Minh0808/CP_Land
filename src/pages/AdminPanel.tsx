// src/pages/AdminPanel.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface Panel {
  id: number;
  image_url: string;
  sort_order: number;
}

const isProd = import.meta.env.MODE === 'production';
const API_LOCAL = import.meta.env.VITE_API_URL_LOCAL as string;
const API_SERVER = import.meta.env.VITE_API_URL_SERVER as string;
const API_BASE = isProd ? API_SERVER : API_LOCAL;

const AdminPanel: React.FC = () => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [editing, setEditing] = useState<Partial<Panel> | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // 1) Fetch initial panels
  const loadPanels = () => {
    axios.get<Panel[]>(`${API_BASE}/api/panels`)
      .then(res => {
        setPanels(res.data.sort((a, b) => a.sort_order - b.sort_order));
      })
      .catch(err => console.error('Lỗi fetch panels:', err));
  };

  useEffect(() => {
    loadPanels();
  }, []);

  // 2) Handlers
  const handleEdit = (p: Panel) => {
    setEditing(p);
    setFile(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xác nhận xóa panel này?')) return;
    try {
      await axios.delete(`${API_BASE}/api/panels/${id}`);
      setEditing(null);
      loadPanels();
    } catch (err) {
      console.error('Lỗi xóa panel:', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const { name, value } = e.target;
    setEditing({ ...editing, [name]: Number(value) });
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSave = async () => {
    if (!editing) return;
    const form = new FormData();
    form.append('sort_order', String(editing.sort_order ?? 0));
    if (file) form.append('image', file);

    try {
      if (editing.id) {
        await axios.put(
          `${API_BASE}/api/panels/${editing.id}`,
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await axios.post(
          `${API_BASE}/api/panels`,
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }
      setEditing(null);
      loadPanels();
    } catch (err) {
      console.error('Lỗi lưu panel:', err);
    }
  };

  // 3) Render UI
  return (
    <Container>
      <h1>Quản lý Panels</h1>
      <Button onClick={() => setEditing({ sort_order: 0 })}>
        + Thêm panel mới
      </Button>

      <List>
        {panels.map(p => (
          <Item key={p.id}>
            <img
              src={p.image_url.startsWith('http') ? p.image_url : `${API_BASE}${p.image_url}`}
              alt={`Panel ${p.id}`}
              width={120}
            />
            <div>Order: {p.sort_order}</div>
            <Actions>
              <button onClick={() => handleEdit(p)}>Sửa</button>
              <button onClick={() => handleDelete(p.id)}>Xóa</button>
            </Actions>
          </Item>
        ))}
      </List>

      {editing && (
        <Modal>
          <h2>{editing.id ? 'Sửa' : 'Thêm'} panel</h2>
          <Form>
            <label>
              Ảnh
              <input type="file" accept="image/*" onChange={handleFile} />
            </label>
            <label>
              Thứ tự
              <input
                type="number"
                name="sort_order"
                value={editing.sort_order ?? 0}
                onChange={handleChange}
              />
            </label>
            <Button onClick={handleSave}>Lưu</Button>
            <Button alt onClick={() => setEditing(null)}>
              Hủy
            </Button>
          </Form>
        </Modal>
      )}
    </Container>
  );
};

export default AdminPanel;

/* Styled Components */
const Container = styled.div`padding: 20px;`;
const Button = styled.button<{ alt?: boolean }>`
  background: ${({ alt }) => (alt ? '#ccc' : '#00539c')};
  color: white;
  padding: 8px 12px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
`;
const List = styled.div`display: flex; flex-wrap: wrap; gap: 12px;`;
const Item = styled.div`
  border: 1px solid #ddd;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Actions = styled.div`
  margin-left: auto;
  button { margin-left: 4px; }
`;
const Modal = styled.div`
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: white; padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
`;
const Form = styled.div`
  display: flex; flex-direction: column; gap: 12px;
  label { display: flex; flex-direction: column; font-weight: 500; }
`;
