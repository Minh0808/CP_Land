import { ReactNode } from "react"
import Img1 from '../assets/image/1.png'
import Img2 from '../assets/image/2.png'
import Img3 from '../assets/image/3.png'
import Img4 from '../assets/image/4.png'
import Img5 from '../assets/image/5.png'


export interface PanelData {
   id: string
   image_url: string
   sort_order: number
}

export interface User {
  id: number
  name: string
  role: string
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

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface TimelineItem {
  year: string;
  img: string;      // đường dẫn (string)
  title: string;
  text: string;
}

export const timelineData: TimelineItem[] = [
  {
    year: '1',
    img: Img1,
    title: 'Am hiểu sâu thị trường địa phương',
    text: 'CP Land có đội ngũ giàu kinh nghiệm và hiểu rõ quy hoạch,tiềm năng phát triển của khu vực Lục Nam – nơi đang chứng kiến sự mở rộng nhanh chóng của các khu công nghiệp. Nhờ đó, công ty luôn đón đầu xu hướng và lựa chọn những vị trí đất có giá trị tăng trưởng cao.'
  },
  {
    year: '2',
    img: Img2,
    title: 'Danh mục sản phẩm rõ ràng, pháp lý minh bạch',
    text: 'Toàn bộ sản phẩm đất nền do CP Land cung cấp đều có sổ đỏ riêng, quy hoạch ổn định, đảm bảo tính pháp lý rõ ràng, giúp nhà đầu tư và người mua an cư yên tâm tuyệt đối.'
  },
  {
    year: '3',
    img: Img3,
    title: 'Tăng trưởng ổn định và bền vững',
    text: 'Trong 5 năm qua, CP Land đã mở rộng quỹ đất đáng kể, từng bước xây dựng uy tín và lòng tin từ khách hàng. Các sản phẩm bán ra luôn đạt tỉ lệ thanh khoản cao và được đánh giá có khả năng sinh lời tốt.'
  },
  {
    year: '4',
    img: Img4,
    title: 'Mạng lưới kết nối tốt với chủ đầu tư và người mua',
    text: 'CP Land xây dựng hệ thống kết nối hiệu quả giữa người bán – người mua, đồng thời hợp tác chặt chẽ với chính quyền địa phương và các nhà đầu tư, góp phần thúc đẩy phát triển hạ tầng khu vực và gia tăng giá trị đất.'
  },
  {
    year: '5',
    img: Img5,
    title: 'Dịch vụ tư vấn đầu tư chuyên sâu',
    text: 'CP Land không chỉ bán đất mà còn cung cấp giải pháp đầu tư, phân tích thị trường, định giá tài sản và hỗ trợ pháp lý – giúp khách hàng tối ưu lợi nhuận và giảm thiểu rủi ro trong đầu tư.'
  }
]

export interface SearchbarProps {
  onSearch?: (query: SearchbarQuery) => void;
}
export interface SearchbarQuery {
  keyword?:       string;
  provinceCode?:  string;
  districtCode?:  string;
  wardCode?:      string;
  propertyType?:  string;
  sortOrder?: 'price-asc' | 'price-desc';
}

/** 1 tỉnh/thành trong tinh_tp.json */
export interface ProvinceItem {
   code: string;
   name: string;
}
/** 1 quận/huyện trong quan_huyen/{provinceCode}.json */
export interface DistrictItem {
   code: string;
   name: string;
}
/** 1 phường/xã trong xa_phuong/{districtCode}.json */
export interface WardItem {
   code: string;
   name: string;
}
export type PropertyType =
  | "can-ho/chung-cu"
  | "dat-nen"
  | "nha-pho"
  | "biet-thu"
  | "van-phong/mat-bang"
  | "khac"

/** Interface cho thông tin địa chỉ: tỉnh, quận/huyện, phường/xã */
export interface Address {
  provinceCode: string;   // ví dụ "89"
  provinceName: string;   // ví dụ "Tỉnh An Giang"
  districtCode: string;   // ví dụ "883"
  districtName: string;   // ví dụ "Thành phố Long Xuyên"
  wardCode: string;       // ví dụ "30280"
  wardName: string;       // ví dụ "Phường Mỹ Bình"
  street: string;         // ví dụ "Đường Nguyễn Huệ"
}

/** Interface cho một bài đăng bất động sản */
export interface Post {
  id: string;             // Một chuỗi ID duy nhất (UUID, timestamp, v.v…)
  title: string;          // Tiêu đề bài đăng
  description: string;    // Mô tả chi tiết
  propertyType: PropertyType; // Loại hình BĐS
  price: number;          // Giá (đơn vị VNĐ)
  area: number;           // Diện tích (m2)
  address: Address;       // Địa chỉ chi tiết
  images: string[];       // Mảng URL hình ảnh (hoặc Base64 nếu dùng upload tạm)
  createdAt: string;      // Thời điểm tạo (ISO string)
}