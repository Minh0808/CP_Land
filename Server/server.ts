// src/server.ts
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import signupRouter from './routes/signup'
import authRouter   from './routes/auth'
import panelsRouter from './routes/panels'
import slidesRouter from './routes/slides'
import rssNewsRouter from './routes/newfeeds'
import adminNewsRouter from './routes/adminNewfeeds'

// 1. Load .env
dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development'
})

// 2. Destructure biến môi trường
const {
  PORT = '4000',
  NODE_ENV = 'development',
  BACKEND_URL_LOCAL = 'http://localhost:4000',
  FRONTEND_URL_SERVER = '',
} = process.env

// 3. Tính toán CORS origin
const corsOrigin =
  NODE_ENV === 'production'
    ? FRONTEND_URL_SERVER
    : BACKEND_URL_LOCAL

// 4. Khởi tạo app
const app = express()
app.use(cors({ origin: corsOrigin, credentials: true }))

// 5. Middleware chung
app.use(express.json())
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

// 6. Static files (uploads)
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, 'public', 'uploads'))
)

// 7. Routes API
app.use('/api/signup', signupRouter)
app.use('/api/auth',   authRouter)
app.use('/api/panels', panelsRouter)
app.use('/api/slides', slidesRouter)
app.use('/api/rss',    rssNewsRouter)
app.use('/api/admin',  adminNewsRouter)

// 8. Health‐check endpoint
app.get('/', (_req, res) => {
  res.send('✅ API CP_Land đang hoạt động!')
})

// 9. Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Internal error:', err)
  res.status(500).json({ message: 'Server lỗi nội bộ.' })
})

// 10. Start server
const portNumber = parseInt(PORT, 10)
app.listen(portNumber, () => {
  console.log(`🚀 Server đang chạy ở cổng: ${BACKEND_URL_LOCAL}`)
  console.log(`   ENV:          ${NODE_ENV}`)
})

export default app
