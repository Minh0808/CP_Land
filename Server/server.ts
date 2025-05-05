// server/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import http from 'http';

dotenv.config();

const {
   DB_HOST = '',
   DB_PORT = '14958',    // ← thêm vào đây
   DB_USER = '',
   DB_PASS = '',
   DB_NAME = '',
   EMAIL_USER = '',
   EMAIL_PASS = '',
   ADMIN_EMAIL = '',
   FRONTEND_URL = '',
   PORT = '4000',
 } = process.env;

// Validate env
if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) {
   console.error('Thiếu cấu hình database trong .env');
   process.exit(1);
}
if (!EMAIL_USER || !EMAIL_PASS || !ADMIN_EMAIL) {
   console.error('Thiếu cấu hình email trong .env');
   process.exit(1);
}

// 1) Tạo connection pool MySQL
const pool = mysql.createPool({
   host: DB_HOST,
   port: Number(DB_PORT),        // ← dùng DB_PORT
   user: DB_USER,
   password: DB_PASS,
   database: DB_NAME,
   waitForConnections: true,
   connectionLimit: 10,
 });
 

// 2) Tạo transporter gửi mail
const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
   },
});

const app = express();
app.use(express.json());
// 3) Middleware
app.use(cors({ origin: FRONTEND_URL }));

// **Thêm route test để hiển thị server đang hoạt động:**
app.get('/', (_req, res) => {
   res.send('✅ Server CP_Land đang hoạt động!');
});
 
 // (Tuỳ chọn) route ping dưới dạng JSON
app.get('/api/ping', (_req, res) => {
   res.json({ ok: true, timestamp: new Date().toISOString() });
});
 
type SignupBody = {
   email: string;
   phone: string;
};

/**
 * POST /api/signup
 * Body: { email, phone }
 * - Lưu vào DB
 * - Gửi mail cho admin
 */
app.post(
   '/api/signup',
   async (req: Request<unknown, unknown, SignupBody>, res: Response) => {
      const { email, phone } = req.body;

    // Validate cơ bản
      if (!email || !phone) {
         res.status(400).json({ message: 'Thiếu email hoặc số điện thoại.' });
         return;
      }

    try {
      // 4.1) Lưu vào database
      await pool.execute(
         'INSERT INTO signup (email, SDT, created_at) VALUES (?, ?, NOW())',
         [email, phone]
      );

      // 4.2) Gửi mail cho admin
      await transporter.sendMail({
         from: `"CP Land Website" <${EMAIL_USER}>`,
         to: ADMIN_EMAIL,
         subject: '📣 New Signup from Website',
         html: `
            <h3>Người dùng mới đăng ký:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>SĐT:</strong> ${phone}</p>
            <p><em>Thời gian:</em> ${new Date().toLocaleString()}</p>
         `,
      });

      // 4.3) Phản hồi thành công
      res.status(201).json({ message: 'Đăng ký thành công.' });
      } catch (err) {
         console.error('Lỗi khi xử lý /api/signup:', err);
         res
         .status(500)
         .json({ message: 'Lỗi máy chủ, vui lòng thử lại sau.' });
      }
   }
);

// Test kết nối DB
app.get('/api/db-check', async (_req, res) => {
   try {
   const [rows] = await pool.query('SELECT 1 + 1 AS result');
   res.json({ ok: true, result: rows });
   } catch (err: unknown) {
   console.error('❌ DB kết nối lỗi:', err);
   const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message });
   }
});
 
// Test SMTP server
app.get('/api/mail-check', async (_req, res) => {
   try {
   await transporter.verify();
   res.json({ ok: true, mail: 'SMTP server reachable' });
   } catch (err: unknown) {
   console.error('❌ SMTP verify lỗi:', err);
   const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message });
   }
});

const server = http.createServer(app);
server.listen(Number(PORT), () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
