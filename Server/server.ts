// server.ts
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import slidesRouter from './routes/slides';
import panelsRouter from './routes/panels';
import authRouter from './routes/auth';
import path from 'path';
dotenv.config();

const {
  DB_HOST = '',
  DB_PORT = '14958',
  DB_USER = '',
  DB_PASS = '',
  DB_NAME = '',
  EMAIL_USER = '',
  EMAIL_PASS = '',
  ADMIN_EMAIL = '',
  PORT = '4000',
  JWT_SECRET = '',
  FRONTEND_URL_SERVER = '',
  FRONTEND_URL_LOCAL = '',
  NODE_ENV = 'development',
} = process.env;

const isProd = NODE_ENV === 'production';
const FRONTEND_URL = isProd ? FRONTEND_URL_SERVER : FRONTEND_URL_LOCAL;

// --- Validate environment variables ---
if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) {
  console.error('❌ Thiếu cấu hình database trong .env');
  process.exit(1);
}
if (!EMAIL_USER || !EMAIL_PASS || !ADMIN_EMAIL) {
  console.error('❌ Thiếu cấu hình email trong .env');
  process.exit(1);
}
if (!FRONTEND_URL) {
  console.error(`❌ Thiếu FRONTEND_URL_${isProd ? 'SERVER' : 'LOCAL'} trong .env`);
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error('❌ Thiếu JWT_SECRET trong .env')
  process.exit(1)
}

// --- MySQL pool ---
const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// --- Nodemailer transporter ---
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// --- Express app ---
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// 1) Serve ảnh upload
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, 'public', 'uploads'))
);

// --- Test endpoints ---
app.get('/', (_req, res) => {
  res.send('✅ Server CP_Land đang hoạt động!');
});

app.get('/api/ping', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});
app.get('/api/db-check', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1+1 AS result');
    res.json({ ok: true, result: rows });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: msg });
  }
});
app.get('/api/mail-check', async (_req, res) => {
  try {
    await transporter.verify();
    res.json({ ok: true, mail: 'SMTP server reachable' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: msg });
  }
});

// --- Signup endpoint ---
type SignupBody = { email: string; phone: string };
app.get('/api/signup', (_req, res) => {
  res.send('✅ Signup sẵn sàng!');
});

app.post('/api/signup',async (req: Request<{}, {}, SignupBody>,res: Response,next: NextFunction): Promise<void> => {
  const { email, phone } = req.body;
  if (!email || !phone) {
   res.status(400).json({ message: 'Thiếu email hoặc số điện thoại.' });
  }

  try {
    await pool.execute(
      'INSERT INTO signup (email, SDT, created_at) VALUES (?, ?, NOW())',
      [email, phone]
    );

    const signupTime = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    await transporter.sendMail({
      from: `"CP Land Website" <${EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: '📣 New Signup from Website',
      html: `
        <h3>Người dùng mới đăng ký:</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>SĐT:</strong> ${phone}</p>
        <p><em>Thời gian:</em> ${signupTime}</p>
      `,
    });

    res.status(201).json({ message: 'Đăng ký thành công.' });
  } catch (err: unknown) {
    console.error('❌ Lỗi khi xử lý /api/signup:', err);
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại sau.' });
  }
});

// Mount API routers
app.use('/api/slides', slidesRouter);
app.use('/api/panels', panelsRouter);
app.use('/', authRouter);

// ------ SOCKET.IO (chỉ cho local, không dùng trên Vercel) ------
if (!isProd) {
  // Tạo HTTP server và Socket.IO
  const httpServer = createServer(app);
  const io = new IOServer(httpServer, {
    cors: { origin: FRONTEND_URL, methods: ['GET', 'POST', 'PUT', 'DELETE'] }
  });
  app.locals.io = io;

  // Khởi server local
  httpServer.listen(Number(PORT), () => {
    console.log(`🚀 [Local] Server chạy tại http://localhost:${PORT}`);
  });
} else {
  console.log('⚙️ Production mode – no local listener');
}

// --- Export server (not app) ---
export default app;
