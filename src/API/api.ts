// src/API/api.ts
import axios from 'axios'

// Đọc biến môi trường từ Vite
const isDev   = import.meta.env.DEV
const API_URL = import.meta.env.VITE_API_URL

// Trong dev: gọi thẳng API_URL; production: gọi relative
const baseURL = isDev ? `${API_URL}/` : '/'

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

// --- Interface chung --- //

export interface RssItem {
  title:   string
  link:    string
  pubDate: string
  image:   string
  summary: string
}

export interface Panel {
  id:         string
  image_url:  string
  sort_order: number
}

export interface SignupDTO {
   name:      string
  email:     string
  phone:     string
  createdAt: string
}

export interface PostDTO {
  id:           string
  title:        string
  description:  string
  propertyType: string
  price:        number
  area:         number
  address:      any
  images:       string[]
  createdAt:    string
  updatedAt?:   string
}

export interface ChatResponse {
  reply: string
}

export interface UserDTO {
  id:    string
  name:  string
  email: string
  phone: string
  role:  string
}

// Wrapper chung của API
interface Wrapped<T> {
  status:     boolean
  message:    string
  data?:      T
  statusCode: number
}

// --- AUTH --- //

interface LoginResponse {
  token: string
  user:  UserDTO
}

/**
 * Đăng nhập → trả về { token, user }
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await api.post<Wrapped<LoginResponse>>(
    '/auth/login',
    { username, password }
  )
  if (!res.data.data) {
    throw new Error(res.data.message || 'Login thất bại')
  }
  return res.data.data
}

/**
 * Lấy profile hiện tại (GET /auth/me)
 */
export async function getMe(): Promise<UserDTO> {
  const res = await api.get<Wrapped<UserDTO>>('/auth/me')
  if (!res.data.data) {
    throw new Error(res.data.message || 'Chưa xác thực')
  }
  return res.data.data
}

// --- RSS HOT REAL --- //

/**
 * Lấy RSS “hot-real”
 */
export async function fetchHotReal(): Promise<RssItem[]> {
  const res = await api.get<Wrapped<RssItem[]>>('/rss/hot-real')
  return res.data.data || []
}

// --- PANELS CRUD --- //

/**
 * Payload cho create/update Panel:  
 *  • FormData  (upload file)  
 *  • JSON { image_url, sort_order }  
 */
export type PanelPayload =
  | FormData
  | { image_url: string; sort_order?: number }

/**
 * Lấy danh sách panels
 */
export async function fetchPanels(): Promise<Panel[]> {
  const res = await api.get<Wrapped<Panel[]>>('/panels')
  return res.data.data || []
}

/**
 * Tạo panel mới
 */
export async function createPanel(
  payload: PanelPayload
): Promise<Panel> {
  let res
  if (payload instanceof FormData) {
    res = await api.post<Wrapped<Panel>>(
      '/panels',
      payload,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  } else {
    res = await api.post<Wrapped<Panel>>(
      '/panels',
      payload
    )
  }
  if (!res.data.data) {
    throw new Error(res.data.message || 'Tạo panel thất bại')
  }
  return res.data.data
}

/**
 * Cập nhật panel
 */
export async function updatePanel(
  id: string,
  payload: PanelPayload
): Promise<Panel> {
  let res
  if (payload instanceof FormData) {
    res = await api.put<Wrapped<Panel>>(
      `/panels/${id}`,
      payload,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  } else {
    res = await api.put<Wrapped<Panel>>(
      `/panels/${id}`,
      payload
    )
  }
  if (!res.data.data) {
    throw new Error(res.data.message || 'Cập nhật panel thất bại')
  }
  return res.data.data
}

/**
 * Xóa panel
 */
export async function deletePanel(id: string): Promise<void> {
  const res = await api.delete<Wrapped<null>>(`/panels/${id}`)
  if (!res.data.status) {
    throw new Error(res.data.message || 'Xóa panel thất bại')
  }
}

// --- SIGNUP --- //

/**
 * Đăng ký (chỉ email + phone)
 */
export async function signup(
   name: string,
  email: string,
  phone: string
): Promise<SignupDTO> {
  const res = await api.post<Wrapped<SignupDTO>>('/api/signup', {name, email, phone })
  if (!res.data.data) {
    throw new Error(res.data.message || 'Signup thất bại')
  }
  return res.data.data
}

// --- POSTS --- //

/**
 * Lấy danh sách bài đăng
 */
export async function fetchPosts(): Promise<PostDTO[]> {
  const res = await api.get<Wrapped<PostDTO[]>>('/posts')
  return res.data.data || []
}

/**
 * Lấy chi tiết 1 bài theo ID
 */
export async function fetchPostById(id: string): Promise<PostDTO> {
  const res = await api.get<Wrapped<PostDTO>>(`/posts/${id}`)
  if (!res.data.data) {
    throw new Error(res.data.message || 'Không tìm thấy')
  }
  return res.data.data
}

/**
 * Tạo bài đăng mới
 */
export async function createPost(
  payload: Omit<PostDTO, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PostDTO> {
  const res = await api.post<Wrapped<PostDTO>>('/posts', payload)
  if (!res.data.data) {
    throw new Error(res.data.message || 'Tạo bài đăng thất bại')
  }
  return res.data.data
}

// --- CHAT --- //

/**
 * Gửi tin nhắn chat
 */
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const res = await api.post<ChatResponse>('/chatbox', { message })
  return res.data
}
