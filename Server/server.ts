// src/server.ts
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import signupRouter from './routes/signup'
import authRouter   from './routes/auth'
import panelsRouter from './routes/panels'
import slidesRouter from './routes/slides'


dotenv.config()

const {
  VITE_API_URL_SERVER = '',
  VITE_API_URL_LOCAL = '',
  FRONTEND_URL_SERVER = '',
  FRONTEND_URL_LOCAL  = '',
  PORT                = '4000',
  NODE_ENV            = 'development',
} = process.env

const isProd       = NODE_ENV === 'production'
const FRONTEND_URL = isProd ? FRONTEND_URL_SERVER : FRONTEND_URL_LOCAL
const API_BASE = isProd ? VITE_API_URL_SERVER : VITE_API_URL_LOCAL
const app = express()

// Middleware chung
app.use(express.json())
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true,
  })
)

app.use('/uploads', express.static(path.resolve(__dirname, 'public', 'uploads')))

app.use('/', signupRouter)
app.use('/', authRouter)
app.use('/', panelsRouter)
app.use('/', slidesRouter)

app.get('/', (_req, res) => {
  res.send('✅ API CP_Land đang hoạt động!')
})

// BẬT HTTP SERVER
const port = parseInt(PORT, 10) || 4000
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại ${API_BASE}`)
})

export default app
