// src/pages/AdminPanel.tsx
import React, { useEffect, useState, ChangeEvent, useContext } from 'react';
import styled from 'styled-components';
import {
  fetchPanels,
  createPanel,
  updatePanel,
  deletePanel,
} from '../API/api';
import type { Panel } from '../API/api';
import { AuthContext } from '../Contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [panels, setPanels]   = useState<Panel[]>([]);
  const [editing, setEditing] = useState<Partial<Panel> | null>(null);
  const [file, setFile]       = useState<File | null>(null);

  // 1) Load panels
  const loadPanels = async () => {
    try {
      const data = await fetchPanels();
      setPanels(data.sort((a, b) => a.sort_order - b.sort_order));
    } catch (err) {
      console.error('Lỗi fetch panels:', err);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') loadPanels();
  }, [user]);

  // 2) Handlers
  const handleEdit = (p: Panel) => {
    setEditing(p);
    setFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xác nhận xóa panel này?')) return;
    try {
      await deletePanel(id);
      setEditing(null);
      await loadPanels();
    } catch (err) {
      console.error('Lỗi xóa panel:', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const { name, value } = e.target;
    setEditing(prev => ({ ...prev!, [name]: Number(value) }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      let panel: Panel;
      if (file) {
        // upload file
        const form = new FormData();
        form.append('file', file);
        form.append('sort_order', String(editing.sort_order || 0));
        if (editing.id) {
          panel = await updatePanel(editing.id, form);
        } else {
          panel = await createPanel(form);
        }
      } else {
        // sử dụng URL
        const payload = {
          image_url:  editing.image_url!,
          sort_order: editing.sort_order,
        };
        if (editing.id) {
          panel = await updatePanel(editing.id, payload);
        } else {
          panel = await createPanel(payload);
        }
      }
      // xong, refresh
      setEditing(null);
      setFile(null);
      await loadPanels();
    } catch (err: any) {
      console.error('Lỗi lưu panel:', err);
      alert(err.message || 'Lưu panel thất bại');
    }
  };

  // 3) quyền admin
  if (user?.role !== 'admin') {
    return <p>Chỉ có admin mới được truy cập trang này.</p>;
  }

  return (
    <Container>
      <h1>Quản lý Panels</h1>
      <Button onClick={() => setEditing({ sort_order: 0 })}>
        + Thêm panel mới
      </Button>

      <List>
        {panels.map(p => (
          <Item key={p.id}>
            <img src={p.image_url} alt={`Panel ${p.id}`} width={120} />
            <div>Order: {p.sort_order}</div>
            <Actions>
              <button onClick={() => handleEdit(p)}>Sửa</button>
              <button onClick={() => handleDelete(p.id)}>Xóa</button>
            </Actions>
          </Item>
        ))}
      </List>

      {editing && (
        <Modal onClick={() => setEditing(null)}>
          <Dialog onClick={e => e.stopPropagation()}>
            <h2>{editing.id ? 'Sửa' : 'Thêm'} panel</h2>
            <Form>
              <label>
                Upload ảnh
                <input type="file" accept="image/*" onChange={handleFile} />
              </label>
              <label>
                Hoặc nhập URL ảnh
                <input
                  type="text"
                  name="image_url"
                  value={editing.image_url || ''}
                  onChange={e =>
                    setEditing(prev => ({ ...prev!, image_url: e.target.value }))
                  }
                />
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
              <Button alt onClick={() => setEditing(null)}>Hủy</Button>
            </Form>
          </Dialog>
        </Modal>
      )}
    </Container>
  );
};

export default AdminPanel;

/** Styled Components **/
const Container = styled.div`
  padding-top: 100px;
  text-align: center;
  button { margin: 30px; border-radius: 5px; font-size: 16px; }
`;
const Button = styled.button<{ alt?: boolean }>`
  background: ${({ alt }) => (alt ? '#ccc' : '#00539c')};
  color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
`;
const List = styled.div`
  display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;
`;
const Item = styled.div`
  border: 1px solid #ddd; padding: 8px;
  display: flex; align-items: center; gap: 8px;
`;
const Actions = styled.div`
  margin-left: auto; display: flex; gap: 5px;
  button { width: 80px; height: 30px; cursor: pointer; }
`;
const Modal = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
`;
const Dialog = styled.div`
  background: white; padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  border-radius: 4px;
`;
const Form = styled.div`
  display: flex; flex-direction: column; gap: 12px;
  label { display: flex; flex-direction: column; font-weight: 500; }
`;
