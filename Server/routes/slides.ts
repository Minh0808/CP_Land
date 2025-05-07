
import { Router } from 'express';
import { pool } from '../config/db';
import multer from 'multer';

const router = Router();
// cấu hình multer để upload ảnh lên /public/uploads
const upload = multer({ dest: './public/uploads/' });

// GET tất cả slides, ordered
router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM slides ORDER BY sort_order');
  res.json(rows);
});

// POST slide mới (có file ảnh)
router.post('/', upload.single('image'), async (req, res) => {
  const { title, price, details, sort_order } = req.body;
  const imageUrl = `/uploads/${req.file!.filename}`;
  const [result] = await pool.query(
    'INSERT INTO slides (image_url, title, price, details, sort_order) VALUES (?, ?, ?, ?, ?)',
    [imageUrl, title, price, details, sort_order || 0]
  );
  res.json({ id: (result as any).insertId });
});

// PUT chỉnh sửa slide
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, price, details, sort_order } = req.body;
  let sql = 'UPDATE slides SET title=?, price=?, details=?, sort_order=?';
  const params: any[] = [title, price, details, sort_order || 0];
  if (req.file) {
    sql += ', image_url=?';
    params.push(`/uploads/${req.file.filename}`);
  }
  sql += ' WHERE id=?';
  params.push(id);
  await pool.query(sql, params);
  res.json({ ok: true });
});

// DELETE slide
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM slides WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
