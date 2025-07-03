// src/Component/QuillEditor.tsx
import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../Style/quill-custom.css';

const Font = Quill.import('formats/font') as any;
Font.whitelist = [
   'sans-serif',
   'serif',
   'monospace',
   'Arial',
   'Courier New',
   'Times New Roman',
   'Georgia',
   'Verdana',
];
// 3) Register lại với Quill
Quill.register(Font, true);
// --- Lấy format Size từ Quill và thiết lập whitelist ---
const Size = Quill.import('formats/size') as any;
Size.whitelist = [
   '12px',
   '14px',
   '16px',
   '18px',
   '20px',
   '22px',
   '24px',
   '26px',
   '28px',
   '30px',
   '32px',
   '34px',
   '36px',
   '38px',
   '40px',
   '42px',
   '44px',
   '46px',
   '48px',
   '50px',
   '52px',
   '54px',
   '56px',
   '58px',
   '60px',
   '62px',
   '64px',
   '66px',
   '68px',
   '70px',
];
Quill.register(Size, true);
// --- Toolbar cấu hình theo demo ---
const toolbarOptions = [
   // Hàng 1
   [{ font: Font.whitelist }], // dropdown font (mặc định có “Sans Serif”)
   [{ size: Size.whitelist }], // dropdown size (tương đương “Small, Normal, Large, Huge”)

   ['bold', 'italic', 'underline', 'strike'], // B I U S

   [{ list: 'ordered' }, { list: 'bullet' }], // danh sách số/bullets
   [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

   ['link', 'image', 'video'], // liên kết, ảnh, video
   ['formula'], // công thức

   [{ color: [] }, { background: [] }], // text color / background

   [{ script: 'sub' }, { script: 'super' }], // sub/superscript

   [{ header: 1 }, { header: 2 }], // H1, H2

   ['blockquote', 'code-block'], // blockquote, code-block
];

// Danh sách formats phải bao gồm hết keys trên
const formats = [
   'font',
   'size',
   'bold',
   'italic',
   'underline',
   'strike',
   'list',
   'indent',
   'link',
   'image',
   'video',
   'formula',
   'color',
   'background',
   'script',
   'header',
   'blockquote',
   'code-block',
];

interface QuillEditorProps {
   value?: string;
   onChange?: (html: string) => void;
   placeholder?: string;
}

export default function QuillEditor({
   value = '',
   onChange,
   placeholder = 'Compose an epic...',
}: QuillEditorProps) {
   const editorRef = useRef<HTMLDivElement>(null);
   const quillRef = useRef<Quill | null>(null);

   useEffect(() => {
      if (!editorRef.current || quillRef.current) return;

      quillRef.current = new Quill(editorRef.current, {
         theme: 'snow',
         placeholder,
         modules: {
            toolbar: toolbarOptions,
         },
         formats,
      });

      // khởi nội dung ban đầu
      
      if (value) {
         quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
      // lắng text-change
      quillRef.current.on('text-change', () => {
         const html = editorRef.current!.querySelector('.ql-editor')!.innerHTML;
         onChange?.(html);
      });
   }, []);

   // sync nếu prop value thay đổi
   useEffect(() => {
      if (quillRef.current && value !== quillRef.current.root.innerHTML) {
         quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
   }, [value]);

   return (
      <div style={{ border: '1px solid #ccc', borderRadius: 4 }}>
         <div ref={editorRef} style={{ height: 300 }} />
      </div>
   );
}
