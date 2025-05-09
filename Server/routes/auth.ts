// server/routes/auth.ts
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        console.warn(`[${new Date().toISOString()}] 🔒 Login attempt with missing fields: email=${email}, passwordProvided=${!!password}`);
        res.status(400).json({ message: 'Thiếu email hoặc mật khẩu.' });
        return;
      }

      // 1) Tìm user
      const [[user]]: any = await pool.query(
        'SELECT id, name, password_hash, role FROM users WHERE email = ?',
        [email]
      );
      if (!user) {
        console.warn(`[${new Date().toISOString()}] 🚫 Login failed: no user found for email=${email}`);
        res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        return;
      }

      // 2) So khớp mật khẩu
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        console.warn(`[${new Date().toISOString()}] 🚫 Login failed: wrong password for email=${email}`);
        res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        return;
      }

      // 3) Sinh JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      // 4) Ghi log thành công
      console.log(`[${new Date().toISOString()}] ✅ Đăng nhập thành công: email=${email}, userId=${user.id}`);

      // 5) Trả về token + user basic
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(`[${new Date().toISOString()}] ❌ Lỗi bất ngờ khi /login:`, err);
      next(err);
    }
  }
);


// GET /api/auth/me
router.get(
  '/me',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        res.json({ authenticated: false });
        return;
      }
      const token = authHeader.slice(7);
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId: number };

      const [[user]]: any = await pool.query(
        'SELECT id, name, role FROM users WHERE id = ?',
        [payload.userId]
      );
      if (!user) {
        res.json({ authenticated: false });
        return;
      }

      res.json({ authenticated: true, user });
    } catch {
      res.json({ authenticated: false });
    }
  }
);

export default router;
