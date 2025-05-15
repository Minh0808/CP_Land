"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/panels.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// GET all panels
router.get('/', async (_req, res) => {
    try {
        const [rows] = await db_1.pool.query('SELECT * FROM panels ORDER BY sort_order');
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi lấy danh sách panels.' });
    }
});
// POST tạo mới panel
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'Vui lòng gửi kèm file ảnh.' });
        return;
    }
    try {
        // Tính hash + tên file
        const hash = crypto_1.default.createHash('sha256').update(req.file.buffer).digest('hex');
        const ext = path_1.default.extname(req.file.originalname).toLowerCase();
        const filename = `${hash}${ext}`;
        const uploadDir = path_1.default.resolve(__dirname, '../public/uploads');
        const absPath = path_1.default.join(uploadDir, filename);
        const imageUrl = `/uploads/${filename}`;
        await promises_1.default.mkdir(uploadDir, { recursive: true });
        try {
            await promises_1.default.access(absPath);
        }
        catch {
            await promises_1.default.writeFile(absPath, req.file.buffer);
        }
        // Tìm sort_order mới
        const [[{ maxOrder }]] = await db_1.pool.query('SELECT MAX(sort_order) AS maxOrder FROM panels');
        const sort_order = (maxOrder ?? 0) + 1;
        // Insert vào DB
        const [result] = await db_1.pool.query('INSERT INTO panels (image_url, sort_order) VALUES (?, ?)', [imageUrl, sort_order]);
        const newPanel = { id: result.insertId, image_url: imageUrl, sort_order };
        res.status(201).json(newPanel);
        return;
    }
    catch (err) {
        console.error('POST panels error:', err);
        res.status(500).json({ message: 'Lỗi tạo mới panel.' });
        return;
    }
});
// PUT cập nhật panel
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { sort_order } = req.body;
    try {
        // Lấy image_url cũ
        const [[orig]] = await db_1.pool.query('SELECT image_url FROM panels WHERE id = ?', [id]);
        let imageUrl = orig?.image_url;
        // Nếu có file mới, xử lý tương tự POST
        if (req.file) {
            const hash = crypto_1.default.createHash('sha256').update(req.file.buffer).digest('hex');
            const ext = path_1.default.extname(req.file.originalname).toLowerCase();
            const filename = `${hash}${ext}`;
            const uploadDir = path_1.default.resolve(__dirname, '../public/uploads');
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
        // Update DB
        await db_1.pool.query('UPDATE panels SET image_url = ?, sort_order = ? WHERE id = ?', [imageUrl, sort_order, id]);
        const updated = { id: Number(id), image_url: imageUrl, sort_order: Number(sort_order) };
        res.json(updated);
        return;
    }
    catch (err) {
        console.error('PUT panels error:', err);
        res.status(500).json({ message: 'Lỗi cập nhật panel.' });
        return;
    }
});
// DELETE panel + xóa file nếu không còn
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Lấy image_url
        const [[row]] = await db_1.pool.query('SELECT image_url FROM panels WHERE id = ?', [id]);
        // Xóa bản ghi
        await db_1.pool.query('DELETE FROM panels WHERE id = ?', [id]);
        // Xóa file nếu không còn ai dùng
        if (row?.image_url) {
            const [[countRow]] = await db_1.pool.query('SELECT COUNT(*) AS cnt FROM panels WHERE image_url = ?', [row.image_url]);
            if (countRow.cnt === 0) {
                const publicDir = path_1.default.resolve(__dirname, '../public');
                const rel = row.image_url.replace(/^\/+/, '');
                const abs = path_1.default.join(publicDir, rel);
                await promises_1.default.unlink(abs).catch(() => { });
            }
        }
        res.json({ id: Number(id) });
        return;
    }
    catch (err) {
        console.error('DELETE panels error:', err);
        res.status(500).json({ message: 'Lỗi xóa panel.' });
        return;
    }
});
exports.default = router;
