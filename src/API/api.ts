import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL?.endsWith('/')
   ? import.meta.env.VITE_API_URL
   : `${import.meta.env.VITE_API_URL}/`;

export const api = axios.create({
   baseURL,
   withCredentials: true,
});

// --- Interface chung --- //

export interface RssItem {
   title: string;
   link: string;
   pubDate: string;
   image: string;
   summary: string;
}

export interface imagesUpload {
   url: string;
   key: string;
   contentType: string;
}
export interface Panel {
   id: string;
   images: imagesUpload[];
   sort_order: number;
}

export interface SignupDTO {
   email: string;
   phone: string;
}

export interface useMessDTO {
   name: string;
   email: string;
   phone: string;
   messager: string;
   createdAt: string;
}

export interface IImage {
   url: string;
   key: string;
   contentType: string;
}
export interface AddressDTO {
   provinceCode: string;
   provinceName: string;
   districtCode: string;
   districtName: string;
   wardCode: string;
   wardName: string;
   street: string;
}
export interface PostDTO {
   id: string;
   title: string;
   description: string;
   propertyType: string;
   price: number;
   area: number;
   address: AddressDTO;
   images: IImage[];
   createdAt: string;
   updatedAt?: string;
}

export interface ChatResponse {
   reply: string;
}

export interface UserDTO {
   id: string;
   name: string;
   email: string;
   phone: string;
   role: string;
}

// Wrapper chung của API
interface Wrapped<T> {
   status: boolean;
   message: string;
   data?: T;
   statusCode: number;
}

// --- AUTH --- //

interface LoginResponse {
   token: string;
   user: UserDTO;
}

export interface PostPayload {
   title: string;
   description?: string;
   propertyType: string;
   price: number;
   area: number;
   address: AddressDTO;
   images: { url: string; key: string; contentType: string }[];
}

export interface UploadResult {
   url: string;
   key: string;
   contentType: string;
}
/**
 * Đăng nhập → trả về { token, user }
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
   const res = await api.post<Wrapped<LoginResponse>>('/auth/login', { username, password });
   if (!res.data.data) {
      throw new Error(res.data.message || 'Login thất bại');
   }
   return res.data.data;
}

/**
 * Lấy profile hiện tại (GET /auth/me)
 */
export async function getMe(): Promise<UserDTO> {
   const res = await api.get<Wrapped<UserDTO>>('/auth/me');
   if (!res.data.data) {
      throw new Error(res.data.message || 'Chưa xác thực');
   }
   return res.data.data;
}

// --- RSS HOT REAL --- //

/**
 * Lấy RSS “hot-real”
 */
export async function fetchHotReal(): Promise<RssItem[]> {
   const res = await api.get<Wrapped<RssItem[]>>('/rss/hot-real');
   return res.data.data || [];
}

// --- PANELS CRUD --- //

/**
 * Lấy danh sách panels
 */
// API/api.ts
export async function fetchPanels(): Promise<Panel[]> {
   const res = await api.get<Panel[]>('/panels');
   return res.data;
}

export async function fetchPanelById(id: string): Promise<Panel> {
   const res = await api.get<Wrapped<Panel>>(`/panels/${id}`);
   if (!res.data.data) {
      throw new Error(res.data.message || 'Không tìm thấy');
   }
   return res.data.data;
}

/**
 * Tạo panel mới
 */
// client/api.ts
export async function createPanel(payload: FormData): Promise<Panel> {
   // trước:
   // const res = await api.post<Wrapped<Panel>>('/panels', payload);

   // sửa thành:
   const res = await api.post<Panel>('/panels', payload);

   // server trả thẳng Panel (newPanelDTO) nên:
   return res.data;
}

/**
 * Cập nhật panel
 */
export async function updatePanel(id: string, payload: FormData): Promise<Panel> {
   const res = await api.put<Wrapped<Panel>>(`/panels/${id}`, payload);
   if (!res.data.data) {
      throw new Error(res.data.message || 'Cập nhật panel thất bại');
   }
   return res.data.data;
}

/**
 * Xóa panel
 */
export async function deletePanel(id: string): Promise<void> {
   const res = await api.delete<{ id: string }>(`/panels/${id}`);
   if (!res.data.id) {
      throw new Error('Xóa panel thất bại');
   }
}

// --- SIGNUP --- //

/**
 * Đăng ký (chỉ email + phone)
 */
export async function signup(data: SignupDTO) {
   const res = await api.post<Wrapped<SignupDTO>>('/api/signup', data);
   if (!res.data) {
      throw new Error(res.data || 'Signup thất bại');
   }
   return res.data;
}

export async function sendMessage(
   name: string,
   email: string,
   phone: string,
   messager: string
): Promise<useMessDTO> {
   const res = await api.post<Wrapped<useMessDTO>>('/api/messager', {
      name,
      email,
      phone,
      messager,
   });
   if (!res.data.data) {
      throw new Error(res.data.message || 'Gửi liên hệ thất bại');
   }
   return res.data.data;
}

// --- POSTS --- //

/**
 * Lấy danh sách bài đăng
 */
export async function fetchPosts(): Promise<PostDTO[]> {
   const res = await api.get<Wrapped<PostDTO[]>>('/api/posts');
   return res.data.data || [];
}

/**
 * Lấy chi tiết 1 bài theo ID
 */
export async function fetchPostById(id: string): Promise<PostDTO> {
   const res = await api.get<Wrapped<PostDTO>>(`/api/posts/${id}`);
   if (!res.data.data) {
      throw new Error(res.data.message || 'Không tìm thấy');
   }
   return res.data.data;
}

/**
 * Tạo bài đăng mới
 */
export async function createPost(payload: PostPayload): Promise<PostDTO> {
   const res = await api.post<Wrapped<PostDTO>>('/api/posts', payload);
   if (!res.data.data) {
      throw new Error(res.data.message || 'Tạo bài đăng thất bại');
   }
   return res.data.data;
}

// --- CHAT --- //

/**
 * Gửi tin nhắn chat
 */
export async function sendChatMessage(message: string): Promise<ChatResponse> {
   // 1) Khai báo đúng generic Wrapped<ChatResponse>
   const res = await api.post<Wrapped<ChatResponse>>('/chatbox', { message });

   // 2) Check wrapper.data
   if (!res.data.data) {
      // res.data.message là thông báo từ server
      throw new Error(res.data.message || 'Chat thất bại');
   }

   // 3) Trả về phần chat payload
   return res.data.data;
}

export async function editPost(id: string, payload: Partial<PostPayload>): Promise<PostDTO> {
   const res = await api.put<Wrapped<PostDTO>>(`/api/posts/${id}`, payload);
   if (!res.data.data) {
      throw new Error(res.data.message || 'Cập nhật bài đăng thất bại');
   }
   return res.data.data;
}

export async function deletePost(id: string): Promise<void> {
   const res = await api.delete<Wrapped<null>>(`/api/posts/${id}`);
   if (!res.data.status) {
      throw new Error(res.data.message || 'Xóa bài đăng thất bại');
   }
}

export async function uploadImage(file: File): Promise<UploadResult> {
   const form = new FormData();
   form.append('file', file);

   // Gọi mà không unwrap wrapper
   const res = await api.post<{ url: string; key: string }>('/api/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
   });

   // Lấy thẳng res.data.url
   if (!res.data.url || !res.data.key) {
      throw new Error('Upload thất bại: server không trả về đủ thông tin');
   }

   return {
      url: res.data.url,
      key: res.data.key,
      contentType: file.type,
   };
}

// Gửi DELETE có body payload với axios:
// export const deleteImage = async (keys: string[]): Promise<void> => {
//    const res = await api.delete<Wrapped<null>>(`/api/upload`, {
//       data: { fileKeys: keys },
//    });

//    if (!res.data.status) {
//       throw new Error(res.data.message || 'Xóa file thất bại');
//    }
// };
export const deleteImage = async (keys: string[]): Promise<void> => {
  const res = await api.delete(`/api/upload`, {
    data: { fileKeys: keys },
  });
  // nếu HTTP status không thuộc 2xx thì coi như lỗi
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Xóa file thất bại (HTTP ${res.status})`);
  }
}

/**
 * Gọi hàm này khi bạn đã có sẵn
 *   - content: string (HTML đã replace URL)
 *   - media: MediaItem[] (mảng metadata)
 */
export interface MediaItem {
   key: string;
   url: string;
   type: 'image' | 'video';
}

export interface NewfeedsAD {
   id: string;
   content: string;
   media: MediaItem[];
   title: string;
   excerpt: string;
   publishedAt?: string;
   category?: string;
}

export async function createNewfeedsAD(
   content: string,
   media: MediaItem[],
   title?: string,
   excerpt?: string,
   publishedAt?: string,
   category?: string
): Promise<NewfeedsAD> {
   const form = new FormData();
   form.append('content', content);
   form.append('media', JSON.stringify(media));
   if (title) form.append('title', title);
   if (excerpt) form.append('excerpt', excerpt);
   if (publishedAt) form.append('publishedAt', publishedAt);
   if (category) form.append('category', category);

   // 1) Gọi với generic Wrapped<NewfeedsAD>
   const res = await api.post<NewfeedsAD>('/api/newFeeds-admin', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
   });

   // 2) Nếu backend báo lỗi thì ném ra
   if (!res.data || !res.data) {
      throw new Error(res.data || 'Create NewFeed thất bại');
   }

   // 3) Trả về phần data
   return res.data;
}

// Lấy tất cả
export async function fetchNewFeeds(): Promise<NewfeedsAD[]> {
  const res = await api.get<NewfeedsAD[]>('/api/rss-news');
  if (!res.data || !res.data) {
    throw new Error(res.data || 'Không tải được danh sách NewFeeds');
  }
  return res.data;
}

// Lấy chi tiết theo ID
export async function fetchNewFeedById(id: string): Promise<NewfeedsAD> {
  const res = await api.get<NewfeedsAD>(`/api/rss-news/${id}`);
  if (!res.data || !res.data) {
    throw new Error(res.data || 'Không tìm thấy bài viết');
  }
  return res.data;
}

export async function updateNewFeedAD(
  id: string,
  payload: Partial<{
    content: string;
    media: MediaItem[];
    title?: string;
    excerpt?: string;
    publishedAt?: string;
    category?: string;
  }>
): Promise<NewfeedsAD> {
  // nếu dùng FormData (multipart)
  const form = new FormData();
  if (payload.content)     form.append('content', payload.content);
  if (payload.media)       form.append('media', JSON.stringify(payload.media));
  if (payload.title)       form.append('title', payload.title);
  if (payload.excerpt)     form.append('excerpt', payload.excerpt);
  if (payload.publishedAt) form.append('publishedAt', payload.publishedAt);
  if (payload.category)    form.append('category', payload.category);

  const res = await api.put<NewfeedsAD>(
    `/api/newFeeds-admin/${id}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  if (!res.data || !res.data) {
    throw new Error(res.data || 'Cập nhật NewFeed thất bại');
  }
  return res.data;
}

/**
 * Xóa một NewFeed
 */
export async function deleteNewFeedAD(id: string): Promise<void> {
  const res = await api.delete<null>(`/api/newFeeds-admin/${id}`);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Xóa thất bại (HTTP ${res.status})`);
  }
}
