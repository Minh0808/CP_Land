import { ReactNode } from "react"

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

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}