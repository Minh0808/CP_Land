// src/pages/CreateNewFeeds.tsx
import React, { useState, useEffect } from 'react';
import QuillEditor from '../Component/QuillEditor';
import {
   createNewfeedsAD,
   updateNewFeedAD,
   deleteNewFeedAD,
   uploadImage,
   fetchNewFeedById,
   fetchNewFeeds,
   deleteImage,
} from '../API/api';
import { NewfeedsAD, MediaItem } from '../API/api';

const CreateNewFeeds: React.FC = () => {
   // ID đang sửa (null = tạo mới)
   const [editingId, setEditingId] = useState<string | null>(null);

   // Form state
   const [title, setTitle] = useState('');
   const [excerpt, setExcerpt] = useState('');
   const [html, setHtml] = useState('');
   const [loading, setLoading] = useState(false);

   // Danh sách Tin tức
   const [list, setList] = useState<NewfeedsAD[]>([]);
   const [listLoading, setListLoading] = useState(true);

   // Lưu media ban đầu (để giữ lại ảnh cũ và xóa file thừa)
   const [originalMedia, setOriginalMedia] = useState<MediaItem[]>([]);

   // Khi editingId thay đổi: load data nếu có, hoặc reset form
   useEffect(() => {
      if (!editingId) {
         setTitle('');
         setExcerpt('');
         setHtml('');
         setOriginalMedia([]);
         return;
      }
      fetchNewFeedById(editingId)
         .then((f) => {
            setTitle(f.title ?? '');
            setExcerpt(f.excerpt ?? '');
            setHtml(f.content ?? '');
            setOriginalMedia(f.media);
         })
         .catch(() => {
            alert('Không tải được bài viết để sửa');
            setEditingId(null);
         });
   }, [editingId]);

   // Load danh sách
   const loadList = async () => {
      setListLoading(true);
      try {
         const data = await fetchNewFeeds();
         setList(data);
      } catch {
         alert('Không tải được danh sách');
      } finally {
         setListLoading(false);
      }
   };
   useEffect(() => {
      loadList();
   }, []);

   // Xử lý lưu (tạo mới hoặc cập nhật)
   const handleSave = async () => {
      if (!title.trim() || !html.trim()) {
         alert('Tiêu đề và nội dung không được để trống');
         return;
      }
      setLoading(true);

      // 1) Parse HTML
      const container = document.createElement('div');
      container.innerHTML = html;

      // 2) Tách ảnh cũ (src không bắt đầu data:)
      const oldImgEls = Array.from(container.querySelectorAll<HTMLImageElement>('img')).filter(
         (el) => !el.src.startsWith('data:')
      );

      // 3) Gom lại MediaItem cũ còn giữ
      const keepOldMedia = oldImgEls
         .map((el) => originalMedia.find((m) => m.url === el.src))
         .filter((m): m is MediaItem => !!m);

      // 4) Xóa những key cũ không còn giữ
      const keepKeys = keepOldMedia.map((m) => m.key);
      const toDeleteKeys = originalMedia.map((m) => m.key).filter((k) => !keepKeys.includes(k));
      if (toDeleteKeys.length) {
         try {
            await deleteImage(toDeleteKeys);
         } catch (err) {
            console.error('❌ Lỗi xóa media cũ:', err);
         }
      }

      // 5) Tìm data-URI cần upload
      const imgEls = Array.from(container.querySelectorAll<HTMLImageElement>('img')).filter((el) =>
         el.src.startsWith('data:')
      );
      const vidEls = Array.from(container.querySelectorAll<HTMLVideoElement>('video')).filter(
         (el) => el.src.startsWith('data:')
      );
      const iframeEls = Array.from(
         container.querySelectorAll<HTMLIFrameElement>('iframe.ql-video')
      );

      // 6) Prepare interimMedia cho iframe
      const interimMedia: MediaItem[] = iframeEls.map((el, i) => ({
         key: `embed-${Date.now()}-${i}`,
         url: el.src,
         type: 'video',
      }));

      // 7) Upload data-URI mới
      const uploadElem = async (
         src: string,
         idx: number,
         type: 'image' | 'video'
      ): Promise<MediaItem> => {
         const resp = await fetch(src);
         const blob = await resp.blob();
         const ext = blob.type.split('/')[1] || `${idx}`;
         const file = new File([blob], `upload-${Date.now()}-${idx}.${ext}`, { type: blob.type });
         const { key, url } = await uploadImage(file);
         return { key, url, type };
      };
      const uploads = await Promise.all([
         ...imgEls.map((el, i) => uploadElem(el.src, i, 'image')),
         ...vidEls.map((el, i) => uploadElem(el.src, imgEls.length + i, 'video')),
      ]);

      // 8) Thay src thành URL mới
      uploads.forEach(({ url }, i) => {
         const el = [...imgEls, ...vidEls][i] as HTMLImageElement | HTMLVideoElement;
         el.src = url;
      });
      const finalContent = container.innerHTML;

      // ―――――――――――――――――――――――
      // 9) Build finalMedia theo thứ tự DOM
      const uploadsMap = new Map(uploads.map((u) => [u.url, u]));
      const oldMap = new Map(keepOldMedia.map((m) => [m.url, m]));
      const iframeMap = new Map(interimMedia.map((m) => [m.url, m]));

      const finalMedia: MediaItem[] = [];
      Array.from(container.querySelectorAll('img, video, iframe.ql-video')).forEach((node) => {
         const src = (node as HTMLImageElement | HTMLVideoElement | HTMLIFrameElement).src;
         if (uploadsMap.has(src)) {
            finalMedia.push(uploadsMap.get(src)!);
         } else if (oldMap.has(src)) {
            finalMedia.push(oldMap.get(src)!);
         } else if (iframeMap.has(src)) {
            finalMedia.push(iframeMap.get(src)!);
         }
      });
      // ―――――――――――――――――――――――

      // 10) Gọi API
      try {
         if (editingId) {
            await updateNewFeedAD(editingId, {
               title,
               excerpt,
               content: finalContent,
               media: finalMedia,
            });
            alert('Cập nhật thành công!');
         } else {
            await createNewfeedsAD(finalContent, finalMedia, title, excerpt);
            alert('Tạo mới thành công!');
         }
         setEditingId(null);
         await loadList();
      } catch {
         alert('Lỗi khi lưu bài viết');
      } finally {
         setLoading(false);
      }
   };

   // Xóa một tin
   const handleDelete = async (id: string) => {
      if (!window.confirm('Bạn chắc chắn muốn xóa bài này?')) return;
      setLoading(true);
      try {
         const feed = await fetchNewFeedById(id);
         const keys = feed.media.map((m) => m.key);

         if (id.length && keys.length) {
            await deleteNewFeedAD(id);
            await deleteImage(keys);
         }
         alert('Xóa thành công!');
         if (editingId === id) setEditingId(null);
         await loadList();
      } catch (err: any) {
         console.error(err);
         alert(err.message || 'Xóa thất bại');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div style={{ maxWidth: '80%', margin: '2rem auto', padding: '0 1rem' }}>
         <h1 style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#015ea7' }}>
            {editingId ? 'Cập nhật bài viết' : 'Tạo bài đăng tin tức'}
         </h1>

         {/* Form tạo/sửa */}
         <div style={{ margin: '1rem 0' }}>
            <label style={{ fontWeight: 'bold' }}>Tiêu đề:</label>
            <input
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: 4,
                  border: '1px solid #ccc',
                  borderRadius: 4,
               }}
            />
         </div>
         <div style={{ margin: '1rem 0' }}>
            <label style={{ fontWeight: 'bold' }}>Đoạn tóm tắt:</label>
            <textarea
               value={excerpt}
               onChange={(e) => setExcerpt(e.target.value)}
               rows={3}
               style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: 4,
                  border: '1px solid #ccc',
                  borderRadius: 4,
               }}
            />
         </div>
         <QuillEditor value={html} onChange={setHtml} placeholder="Nhập nội dung bài viết..." />

         <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
            <button
               onClick={handleSave}
               disabled={loading}
               style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#0062cb',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  cursor: loading ? 'not-allowed' : 'pointer',
               }}
            >
               {loading ? 'Đang lưu…' : editingId ? 'Cập nhật' : 'Tạo mới'}
            </button>
            {editingId && (
               <button
                  onClick={() => setEditingId(null)}
                  disabled={loading}
                  style={{
                     display: 'flex',
                     alignItems: 'center',
                     background: '#6c757d',
                     color: '#fff',
                     padding: '0.75rem 1.5rem',
                     border: 'none',
                     borderRadius: 4,
                     height: 40,
                     cursor: loading ? 'not-allowed' : 'pointer',
                  }}
               >
                  Hủy
               </button>
            )}
         </div>

         {/* Danh sách Tin tức */}
         <h2
            style={{
               marginTop: 40,
               fontSize: 32,
               fontWeight: 'bold',
               color: '#015ea7',
               paddingBottom: 20,
               textAlign: 'center',
            }}
         >
            Danh sách Tin Tức
         </h2>
         {listLoading ? (
            <p>Đang tải danh sách…</p>
         ) : list.length === 0 ? (
            <p>Chưa có tin nào.</p>
         ) : (
            <div
               style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
                  gap: 16,
               }}
            >
               {list.map((f) => {
                  const thumb = f.media[0]?.url;
                  return (
                     <div
                        key={f.id}
                        style={{
                           border: '1px solid #ddd',
                           borderRadius: 6,
                           overflow: 'hidden',
                           background: '#fff',
                           display: 'flex',
                           flexDirection: 'column',
                           justifyContent: 'space-between',
                           maxHeight: '100%',
                        }}
                     >
                        {thumb && (
                           <img
                              src={thumb}
                              alt=""
                              style={{
                                 width: '100%',
                                 height: 120,
                                 objectFit: 'cover',
                                 padding: '10px 10px 0 10px',
                              }}
                           />
                        )}
                        <div style={{ padding: 10 }}>
                           <h3 style={{ margin: '0 0 8px', fontSize: 14, color: '#015ea7' }}>
                              {f.title}
                           </h3>
                           <p
                              style={{
                                 fontSize: 12,
                                 color: '#555',
                                 height: 40,
                                 overflow: 'hidden',
                              }}
                           >
                              {f.excerpt}
                           </p>
                           <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                              <button
                                 onClick={() => setEditingId(f.id)}
                                 style={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    background: '#ffc107',
                                    border: 'none',
                                    color: '#000',
                                    padding: '0.5rem',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    height: 35,
                                    alignItems: 'center',
                                 }}
                              >
                                 Sửa
                              </button>
                              <button
                                 onClick={() => handleDelete(f.id)}
                                 style={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    background: '#dc3545',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '0.5rem',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    height: 35,
                                    alignItems: 'center',
                                 }}
                              >
                                 Xóa
                              </button>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default CreateNewFeeds;
