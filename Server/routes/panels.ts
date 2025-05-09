// server/routes/panels.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { pool } from '../config/db';
import { Server as IOServer } from 'socket.io';

const router = Router();

// 1) memoryStorage để lấy buffer
const upload = multer({ storage: multer.memoryStorage() });

// helper lấy io
function getIO(req: Request): IOServer {
  return req.app.locals.io as IOServer;
}

// -- GET all panels
router.get('/panels', async (_req, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM panels ORDER BY sort_order');
    res.json(rows as any);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi lấy danh sách panels.' });
  }
});

// -- POST tạo mới panel
router.post('/panels', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'Vui lòng gửi kèm file ảnh.' });
    return;
  }

  try {
    // tính hash + tên file
    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${hash}${ext}`;

    const uploadDir = path.resolve(__dirname, '../public/uploads');
    const absPath = path.join(uploadDir, filename);
    const imageUrl = `/uploads/${filename}`;

    // nếu thư mục chưa có, tạo
    await fs.mkdir(uploadDir, { recursive: true });

    // ghi file nếu chưa có
    try {
      await fs.access(absPath);
    } catch {
      await fs.writeFile(absPath, req.file.buffer);
    }

    // tìm sort_order mới
    const [[{ maxOrder }]]: any = await pool.query(
      'SELECT MAX(sort_order) AS maxOrder FROM panels'
    );
    const sort_order = (maxOrder ?? 0) + 1;

    // insert
    const [result]: any = await pool.query(
      'INSERT INTO panels (image_url, sort_order) VALUES (?, ?)',
      [imageUrl, sort_order]
    );
    const newPanel = { id: result.insertId, image_url: imageUrl, sort_order };

    // emit
    getIO(req).emit('panel:added', newPanel);

    res.json(newPanel);
    return;
  } catch (err) {
    console.error('POST panels error:', err);
    res.status(500).json({ message: 'Lỗi tạo mới panel.' });
    return;
  }
});

// -- PUT cập nhật panel
router.put('/panels/:id', upload.single('image'), async (req: Request<{id:string}>, res: Response) => {
  const { id } = req.params;
  const { sort_order } = req.body;

  try {
    // 1) Lấy image_url cũ
    const [[orig]]: any = await pool.query(
      'SELECT image_url FROM panels WHERE id = ?',
      [id]
    );
    let imageUrl: string = orig?.image_url;

    // 2) Nếu có file mới, xử lý tương tự POST
    if (req.file) {
      const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
      const ext = path.extname(req.file.originalname).toLowerCase();
      const filename = `${hash}${ext}`;

      const uploadDir = path.resolve(__dirname, '../public/uploads');
      const absPath = path.join(uploadDir, filename);
      imageUrl = `/uploads/${filename}`;

      await fs.mkdir(uploadDir, { recursive: true });
      try {
        await fs.access(absPath);
      } catch {
        await fs.writeFile(absPath, req.file.buffer);
      }
    }

    // 3) Update DB
    await pool.query(
      'UPDATE panels SET image_url = ?, sort_order = ? WHERE id = ?',
      [imageUrl, sort_order, id]
    );

    const updated = { id: Number(id), image_url: imageUrl, sort_order: Number(sort_order) };

    // emit
    getIO(req).emit('panel:updated', updated);

    res.json(updated);
    return;
  } catch (err) {
    console.error('PUT panels error:', err);
    res.status(500).json({ message: 'Lỗi cập nhật panel.' });
    return;
  }
});

// -- DELETE panel + xóa file nếu không còn
router.delete('/panels/:id', async (req: Request<{id:string}>, res: Response) => {
  const { id } = req.params;

  try {
    // 1) Lấy image_url
    const [[row]]: any = await pool.query(
      'SELECT image_url FROM panels WHERE id = ?',
      [id]
    );

    // 2) Xoá bản ghi
    await pool.query('DELETE FROM panels WHERE id = ?', [id]);

    // 3) Nếu file này không còn ai dùng, xóa khỏi disk
    if (row?.image_url) {
      const [[countRow]]: any = await pool.query(
        'SELECT COUNT(*) AS cnt FROM panels WHERE image_url = ?',
        [row.image_url]
      );
      if (countRow.cnt === 0) {
        const publicDir = path.resolve(__dirname, '../public');
        const rel = row.image_url.replace(/^\/+/, '');
        const abs = path.join(publicDir, rel);
        await fs.unlink(abs).catch(() => {});
      }
    }

    // 4) Emit
    getIO(req).emit('panel:deleted', { id: Number(id) });

    res.json({ id: Number(id) });
    return;
  } catch (err) {
    console.error('DELETE panels error:', err);
    res.status(500).json({ message: 'Lỗi xóa panel.' });
    return;
  }
});

export default router;
