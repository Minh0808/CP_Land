// server/routes/slides.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { pool } from '../config/db';
import { Server as IOServer } from 'socket.io';

const router = Router();

// 1) Dùng memoryStorage để lấy buffer ảnh
const upload = multer({ storage: multer.memoryStorage() });

// 2) Helper lấy Socket.IO từ app.locals
function getIO(req: Request): IOServer {
  return req.app.locals.io as IOServer;
}

// --- GET all slides ---
router.get('/slide', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM slides ORDER BY sort_order');
    res.json(rows as any);
  } catch (err) {
    console.error('GET slides error:', err);
    res.status(500).json({ message: 'Lỗi lấy danh sách slides.' });
  }
});

// --- POST create new slide ---
router.post('/slide', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'Vui lòng gửi kèm file ảnh.' });
    return;
  }

  try {
    // 1. Hash buffer + xác định tên file
    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${hash}${ext}`;

    // 2. Đường dẫn thư mục & file
    const uploadDir = path.resolve(__dirname, '../public', 'uploads');
    const absPath = path.join(uploadDir, filename);
    const imageUrl = `/uploads/${filename}`;

    // 3. Tạo folder nếu chưa có, và ghi file nếu chưa tồn tại
    await fs.mkdir(uploadDir, { recursive: true });
    try {
      await fs.access(absPath);
    } catch {
      await fs.writeFile(absPath, req.file.buffer);
    }

    // 4. Tự tính sort_order mới
    const [[{ maxOrder }]]: any = await pool.query(
      'SELECT MAX(sort_order) AS maxOrder FROM slides'
    );
    const sort_order = (maxOrder ?? 0) + 1;

    // 5. Insert vào DB
    const { title, price, details } = req.body;
    const [result]: any = await pool.query(
      `INSERT INTO slides
         (image_url, title, price, details, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [imageUrl, title, price, details, sort_order]
    );

    const newSlide = {
      id: result.insertId,
      image_url: imageUrl,
      title,
      price,
      details,
      sort_order,
    };

    // 6. Emit real-time
    getIO(req).emit('slide:added', newSlide);

    res.json(newSlide);
    return;
  } catch (err) {
    console.error('POST slides error:', err);
    res.status(500).json({ message: 'Lỗi tạo mới slide.' });
    return;
  }
});

// --- PUT update slide ---
router.put('/slide/:id', upload.single('image'), async (req: Request<{id:string}>, res: Response) => {
  const { id } = req.params;
  const { title, price, details, sort_order } = req.body;

  try {
    // 1. Lấy image_url cũ
    const [[orig]]: any = await pool.query(
      'SELECT image_url FROM slides WHERE id = ?',
      [id]
    );
    let imageUrl = orig?.image_url;

    // 2. Nếu có ảnh mới, xử lý tương tự POST
    if (req.file) {
      const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
      const ext = path.extname(req.file.originalname).toLowerCase();
      const filename = `${hash}${ext}`;

      const uploadDir = path.resolve(__dirname, '../public', 'uploads');
      const absPath = path.join(uploadDir, filename);
      imageUrl = `/uploads/${filename}`;

      await fs.mkdir(uploadDir, { recursive: true });
      try {
        await fs.access(absPath);
      } catch {
        await fs.writeFile(absPath, req.file.buffer);
      }
    }

    // 3. Cập nhật DB
    await pool.query(
      `UPDATE slides
         SET image_url = ?, title = ?, price = ?, details = ?, sort_order = ?
       WHERE id = ?`,
      [imageUrl, title, price, details, sort_order ?? 0, id]
    );

    // 4. Nếu có file mới, xóa file cũ
    if (req.file && orig?.image_url) {
      const publicDir = path.resolve(__dirname, '../public');
      const rel = orig.image_url.replace(/^\/+/, '');
      const abs = path.join(publicDir, rel);
      await fs.unlink(abs).catch(() => {});
    }

    const updated = {
      id: Number(id),
      image_url: imageUrl,
      title,
      price,
      details,
      sort_order: Number(sort_order) || 0,
    };

    // 5. Emit real-time
    getIO(req).emit('slide:updated', updated);

    res.json(updated);
    return;
  } catch (err) {
    console.error('PUT slides error:', err);
    res.status(500).json({ message: 'Lỗi cập nhật slide.' });
    return;
  }
});

// --- DELETE slide + xóa file ---
router.delete('/slide/:id', async (req: Request<{id:string}>, res: Response) => {
  const { id } = req.params;

  try {
    // 1. Lấy image_url cũ
    const [[row]]: any = await pool.query(
      'SELECT image_url FROM slides WHERE id = ?',
      [id]
    );

    // 2. Xóa record
    await pool.query('DELETE FROM slides WHERE id = ?', [id]);

    // 3. Xóa file ảnh (nếu tồn tại)
    if (row?.image_url) {
      const publicDir = path.resolve(__dirname, '../public');
      const rel = row.image_url.replace(/^\/+/, '');
      const abs = path.join(publicDir, rel);
      await fs.unlink(abs).catch(() => {});
    }

    // 4. Emit real-time
    getIO(req).emit('slide:deleted', { id: Number(id) });

    res.json({ id: Number(id) });
    return;
  } catch (err) {
    console.error('DELETE slides error:', err);
    res.status(500).json({ message: 'Lỗi xóa slide.' });
    return;
  }
});

export default router;
