import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { pool } from '../config/db';
import { OkPacket, RowDataPacket } from 'mysql2';

const router = Router();

// Multer: lưu file vào public/uploads/panels
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/panels'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

/**
 * POST /api/panels
 * Body: FormData { image: File }
 * Chỉ insert image_url và sort_order, không cần title
 */
router.post(
  '/',
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    // Nếu không có file thì gửi 400 và dừng
    if (!req.file) {
      res.status(400).json({ message: 'Vui lòng upload 1 file image.' });
      return;
    }

    try {
      const imageUrl = `/uploads/panels/${req.file.filename}`;

      // Lấy sort_order lớn nhất hiện tại
      const [rowsMax] = await pool.query<RowDataPacket[]>(
        `SELECT COALESCE(MAX(sort_order), 0) AS maxOrder FROM panels`
      );
      const maxOrder = rowsMax[0].maxOrder as number;
      const newOrder = maxOrder + 1;

      // Thêm bản ghi mới
      const [result] = await pool.query<OkPacket>(
        `INSERT INTO panels (image_url, sort_order)
         VALUES (?, ?)`,
        [imageUrl, newOrder]
      );
      const newId = result.insertId;

      // Lấy lại record vừa tạo
      const [rowsPanel] = await pool.query<RowDataPacket[]>(
        `SELECT id, image_url, sort_order
         FROM panels
         WHERE id = ?`,
        [newId]
      );
      const panel = rowsPanel[0];

      // Gửi response 201 với dữ liệu panel
      res.status(201).json(panel);
      return;
    } catch (err) {
      console.error('Lỗi POST /api/panels:', err);
      res.status(500).json({ message: 'Server lỗi khi thêm panel.' });
      return;
    }
  }
);

export default router;
