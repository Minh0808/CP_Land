export interface PanelData {
   id: number
   image_url: string
   sort_order: number
}

export interface SlideData {
   id: number
   image_url: string
   title: string
   price: string
   details: string
   sort_order: number
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  image: string;
}

export interface AdminNewsItem {
  id: number;
  title: string;
  link: string;
  image_url: string | null;  // nếu không bắt buộc
  summary:   string | null;  // nếu không bắt buộc
  created_at: string;        // hoặc Date, tuỳ bạn parse thế nào
}