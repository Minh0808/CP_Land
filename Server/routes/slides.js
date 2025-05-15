"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/slides.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// --- GET all slides ---
router.get('/', async (_req, res) => {
    try {
        const [rows] = await db_1.pool.query('SELECT * FROM slides ORDER BY sort_order');
        res.json(rows);
    }
    catch (err) {
        console.error('GET slides error:', err);
        res.status(500).json({ message: 'Lỗi lấy danh sách slides.' });
    }
});
// --- POST create new slide ---
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'Vui lòng gửi kèm file ảnh.' });
        return;
    }
    try {
        // 1) Hash buffer + định danh file
        const hash = crypto_1.default.createHash('sha256').update(req.file.buffer).digest('hex');
        const ext = path_1.default.extname(req.file.originalname).toLowerCase();
        const filename = `${hash}${ext}`;
        // 2) Tạo đường dẫn lưu ảnh
        const uploadDir = path_1.default.resolve(__dirname, '../public', 'uploads');
        const absPath = path_1.default.join(uploadDir, filename);
        const imageUrl = `/uploads/${filename}`;
        await promises_1.default.mkdir(uploadDir, { recursive: true });
        try {
            await promises_1.default.access(absPath);
        }
        catch {
            await promises_1.default.writeFile(absPath, req.file.buffer);
        }
        // 3) Tính sort_order mới
        const [[{ maxOrder }]] = await db_1.pool.query('SELECT MAX(sort_order) AS maxOrder FROM slides');
        const sort_order = (maxOrder ?? 0) + 1;
        // 4) Insert vào DB
        const { title, price, details } = req.body;
        const [result] = await db_1.pool.query(`INSERT INTO slides
         (image_url, title, price, details, sort_order)
       VALUES (?, ?, ?, ?, ?)`, [imageUrl, title, price, details, sort_order]);
        const newSlide = {
            id: result.insertId,
            image_url: imageUrl,
            title,
            price,
            details,
            sort_order,
        };
        res.status(201).json(newSlide);
        return;
    }
    catch (err) {
        console.error('POST slides error:', err);
        res.status(500).json({ message: 'Lỗi tạo mới slide.' });
        return;
    }
});
// --- PUT update slide ---
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, price, details, sort_order } = req.body;
    try {
        // 1) Lấy image_url cũ
        const [[orig]] = await db_1.pool.query('SELECT image_url FROM slides WHERE id = ?', [id]);
        let imageUrl = orig?.image_url;
        // 2) Nếu có file mới, lưu giống POST
        if (req.file) {
            const hash = crypto_1.default.createHash('sha256').update(req.file.buffer).digest('hex');
            const ext = path_1.default.extname(req.file.originalname).toLowerCase();
            const filename = `${hash}${ext}`;
            const uploadDir = path_1.default.resolve(__dirname, '../public', 'uploads');
            const absPath = path_1.default.join(uploadDir, filename);
            imageUrl = `/uploads/${filename}`;
            await promises_1.default.mkdir(uploadDir, { recursive: true });
            try {
                await promises_1.default.access(absPath);
            }
            catch {
                await promises_1.default.writeFile(absPath, req.file.buffer);
            }
        }
        // 3) Cập nhật DB
        await db_1.pool.query(`UPDATE slides
         SET image_url = ?, title = ?, price = ?, details = ?, sort_order = ?
       WHERE id = ?`, [imageUrl, title, price, details, sort_order ?? 0, id]);
        // 4) Nếu có file mới, xóa ảnh cũ
        if (req.file && orig?.image_url) {
            const publicDir = path_1.default.resolve(__dirname, '../public');
            const rel = orig.image_url.replace(/^\/+/, '');
            const abs = path_1.default.join(publicDir, rel);
            await promises_1.default.unlink(abs).catch(() => { });
        }
        const updated = {
            id: Number(id),
            image_url: imageUrl,
            title,
            price,
            details,
            sort_order: Number(sort_order) || 0,
        };
        res.json(updated);
        return;
    }
    catch (err) {
        console.error('PUT slides error:', err);
        res.status(500).json({ message: 'Lỗi cập nhật slide.' });
        return;
    }
});
// --- DELETE slide + xóa file ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1) Lấy image_url
        const [[row]] = await db_1.pool.query('SELECT image_url FROM slides WHERE id = ?', [id]);
        // 2) Xóa record
        await db_1.pool.query('DELETE FROM slides WHERE id = ?', [id]);
        // 3) Xóa file ảnh nếu có
        if (row?.image_url) {
            const publicDir = path_1.default.resolve(__dirname, '../public');
            const rel = row.image_url.replace(/^\/+/, '');
            const abs = path_1.default.join(publicDir, rel);
            await promises_1.default.unlink(abs).catch(() => { });
        }
        res.json({ id: Number(id) });
        return;
    }
    catch (err) {
        console.error('DELETE slides error:', err);
        res.status(500).json({ message: 'Lỗi xóa slide.' });
        return;
    }
});
exports.default = router;
