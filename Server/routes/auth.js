"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.ts
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
// Schema validation với Joi
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Lỗi validate đầu vào: ${error.details[0].message}`);
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    const { email, password } = value;
    const [[user]] = await db_1.pool.query('SELECT id, name, password_hash, role FROM users WHERE email = ?', [email]);
    if (!user) {
        console.warn(`[${new Date().toISOString()}] 🚫 Đăng nhập thất bại: không tìm thấy user với email=${email}`);
        res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        return;
    }
    const match = await bcrypt_1.default.compare(password, user.password_hash);
    if (!match) {
        console.warn(`[${new Date().toISOString()}] 🚫 Đăng nhập thất bại: mật khẩu không khớp cho email=${email}`);
        res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(`[${new Date().toISOString()}] ✅ Đăng nhập thành công: email=${email}, userId=${user.id}`);
    res.json({
        token,
        user: { id: user.id, name: user.name, role: user.role },
    });
});
// Middleware bảo vệ route
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Thiếu hoặc sai định dạng Authorization header`);
        res.status(401).json({ message: 'Thiếu hoặc sai định dạng token.' });
        return;
    }
    const token = header.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (err) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Token không hợp lệ hoặc đã hết hạn`);
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        return;
    }
}
// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
    const { userId } = req.user;
    const [[user]] = await db_1.pool.query('SELECT id, name, role FROM users WHERE id = ?', [userId]);
    res.json({ id: user.id, name: user.name, role: user.role });
});
// POST /api/auth/logout
router.post('/logout', authenticate, (req, res) => {
    const { userId } = req.user;
    // TODO: nếu dùng blacklist, lưu token vào blacklist ở đây
    console.log(`[${new Date().toISOString()}] 🔒 User ID=${userId} đã logout`);
    res.json({ message: 'Đăng xuất thành công.' });
});
exports.default = router;
