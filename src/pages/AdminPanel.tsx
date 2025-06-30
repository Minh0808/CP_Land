// src/pages/AdminPanel.tsx
import React, { useEffect, useState, ChangeEvent, useContext } from 'react';
import styled from 'styled-components';
import { fetchPanels, createPanel, updatePanel, deletePanel } from '../API/api';
import type { Panel } from '../API/api';
import { AuthContext } from '../Contexts/AuthContext';

const AdminPanel: React.FC = () => {
   const { user } = useContext(AuthContext);
   const [panels, setPanels] = useState<Panel[]>([]);
   const [editing, setEditing] = useState<Partial<Panel> | null>(null);
   const [file, setFile] = useState<File | null>(null);
   const [loading, setLoading] = useState(false);

   // 1) Load panels
   const loadPanels = async () => {
      const data = await fetchPanels();
      setPanels(data);
   };
   // console.log('data', panels);

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
      setEditing((prev) => ({ ...prev!, [name]: Number(value) }));
   };

   const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
      setFile(e.target.files?.[0] ?? null);
   };

   const handleSave = async () => {
      if (!editing) return;
      const payload = new FormData();
      payload.append('file', file!); // ← phải là 'file'
      payload.append('sort_order', String(editing.sort_order));
      setLoading(true);
      try{
         if (editing.id) {
            await updatePanel(editing.id, payload);
         } else {
            await createPanel(payload);
         }
         setFile(null);
         setEditing(null);
         await loadPanels();
         console.log('payload', payload);
      }catch (err) {
         console.error('Lỗi cập nhật panel:', err);
      }finally {
         setLoading(false);
      }
   };

   // 3) quyền admin
   if (user?.role !== 'admin') {
      return <p>Chỉ có admin mới được truy cập trang này.</p>;
   }

   // 4) Render
   return (
      <Container>
         <h1 style={{ fontWeight: 'bold', fontSize: '32px', paddingBottom: '50px' }}>
            Quản lý Panels
         </h1>

         <List>
            {panels.map((p) => (
               <Item key={p.id}>
                  {p.images.length > 0 && (
                     <img src={p.images[0].url} alt={`Panel ${p.id}`} width={120} />
                  )}
                  <div>Order: {p.sort_order}</div>
                  <Actions>
                     <button id="edit" onClick={() => handleEdit(p)}>
                        Sửa
                     </button>
                     <button id="delete" onClick={() => handleDelete(p.id)}>
                        Xóa
                     </button>
                  </Actions>
               </Item>
            ))}
         </List>

         <Button id="add" onClick={() => setEditing({ sort_order: 0 })}>
            Thêm panel mới
         </Button>

         {editing && (
            <Modal onClick={() => setEditing(null)}>
               <Dialog onClick={(e) => e.stopPropagation()}>
                  <h2 style={{ fontWeight: 'bold', fontSize: '28px' }}>{editing.id ? 'Sửa' : 'Thêm'} panel</h2>
                  <Form>
                     <label>Upload ảnh</label>
                     <FileWrapper>
                        <FileButton htmlFor="panel-file">Chọn ảnh</FileButton>
                        <HiddenInput id="panel-file" accept="image/*" onChange={handleFile} />
                     </FileWrapper>

                     {file && (
                        <PreviewContainer>
                           <PreviewImg src={URL.createObjectURL(file)} alt="preview" />
                        </PreviewContainer>
                     )}

                     <label>
                        Thứ tự
                        <input
                           type="number"
                           name="sort_order"
                           value={editing.sort_order ?? 0}
                           onChange={handleChange}
                        />
                     </label>

                     <div className="flex flex-row justify-between">
                        <Button onClick={handleSave} disabled={loading}>{loading ? 'Đang lưu' : 'Lưu'}</Button>
                        <Button $alt onClick={() => setEditing(null)}>
                           Hủy
                        </Button>
                     </div>
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
   padding-top: 50px;
   text-align: center;
   button {
      margin: 30px;
      border-radius: 5px;
      font-size: 16px;
   }
   #add {
      background-color: #00539c;
      width: 150px;
      color: white;
      position: absolute;
      left: 42.5%;
   }
`;
const Button = styled.button<{ $alt?: boolean }>`
   background: ${({ $alt }) => ($alt ? '#ccc' : '#00539c')};
   width: 70px;
   height: 35px;
   display: flex;
   align-items: center;
   justify-content: center;
   color: white;
   padding: 8px 12px;
   border: none;
   cursor: pointer;
`;
const List = styled.div`
   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   width: 100%;
   height: 100px;
   gap: 12px;
`;
const Item = styled.div`
   border: 1px solid #ddd;
   padding: 8px;
   display: flex;
   align-items: center;
   gap: 8px;
`;
const Actions = styled.div`
   margin-left: auto;
   display: flex;
   gap: 5px;
   button {
      width: 80px;
      height: 30px;
      cursor: pointer;
   }
   #edit {
      background-color: #019e2b;
      color: white;
      margin: 0;
      width: 50px;
   }
   #delete {
      background-color: #ff0000;
      color: white;
      margin: 0;
      width: 50px;
   }
`;
const Modal = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: rgba(0, 0, 0, 0.3);
   display: flex;
   align-items: center;
   justify-content: center;
`;
const Dialog = styled.div`
   background: white;
   padding: 20px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
   border-radius: 4px;
`;
const Form = styled.div`
   display: flex;
   flex-direction: column;
   width: 300px;
   gap: 12px;
   label {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-weight: 500;
   }
   input {
      border: 1px solid #ccc;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
   }
`;
const FileWrapper = styled.div`
   position: relative;
   width: fit-content;
`;

const HiddenInput = styled.input.attrs({ type: 'file' })`
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   opacity: 0;
   cursor: pointer;
`;

const FileButton = styled.label`
   display: inline-block;
   padding: 8px 16px;
   background-color: #00539c;
   color: white;
   border-radius: 4px;
   cursor: pointer;
   font-size: 14px;

   &:hover {
      background-color: #004080;
   }
`;
const PreviewContainer = styled.div`
   margin-top: 12px;
`;

const PreviewImg = styled.img`
   max-width: 200px;
   max-height: 200px;
   border-radius: 4px;
   object-fit: cover;
`;
