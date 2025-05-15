"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
// GET /api/admin/news      → lấy danh sách custom news
router.get('/news', async (_req, res) => {
    try {
        const [rows] = await db_1.pool.query('SELECT * FROM newsfeeds ORDER BY created_at DESC');
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi lấy custom news' });
    }
});
// POST /api/admin/news     → thêm 1 tin
router.post('/news', async (req, res) => {
    const { title, link, image_url, summary } = req.body;
    if (!title || !link) {
        res.status(400).json({ message: 'Thiếu title hoặc link' });
        return;
    }
    try {
        const [result] = await db_1.pool.query(`INSERT INTO news_custom (title, link, image_url, summary)
         VALUES (?, ?, ?, ?)`, [title, link, image_url || null, summary || null]);
        // @ts-ignore
        const insertId = result.insertId;
        res.status(201).json({ id: insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi thêm custom news' });
    }
});
// DELETE /api/admin/news/:id  → xóa 1 tin
router.delete('/news/:id', async (req, res) => {
    try {
        await db_1.pool.query('DELETE FROM news_custom WHERE id = ?', [req.params.id]);
        res.status(204).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi xóa custom news' });
    }
});
exports.default = router;
