// routes/auth.ts
import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { pool } from '../config/db'

const router = Router()

// Schema validation với Joi
const loginSchema = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().min(6).required(),
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
   const { error, value } = loginSchema.validate(req.body)
   if (error) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Lỗi validate đầu vào: ${error.details[0].message}`)
      res.status(400).json({ message: error.details[0].message })
      return 
   }
   const { email, password } = value

   const [[user]]: any = await pool.query(
      'SELECT id, name, password_hash, role FROM users WHERE email = ?',
      [email]
   )
   if (!user) {
      console.warn(`[${new Date().toISOString()}] 🚫 Đăng nhập thất bại: không tìm thấy user với email=${email}`)
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' })
      return 
   }

   const match = await bcrypt.compare(password, user.password_hash)
   if (!match) {
      console.warn(`[${new Date().toISOString()}] 🚫 Đăng nhập thất bại: mật khẩu không khớp cho email=${email}`)
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' })
      return 
   }

   const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
   )

   console.log(`[${new Date().toISOString()}] ✅ Đăng nhập thành công: email=${email}, userId=${user.id}`)

   res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role },
   })
})

// Middleware bảo vệ route
function authenticate(req: Request, res: Response, next: any) {
   const header = req.headers.authorization
   if (!header?.startsWith('Bearer ')) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Thiếu hoặc sai định dạng Authorization header`)
      res.status(401).json({ message: 'Thiếu hoặc sai định dạng token.' })
      return 
   }
   const token = header.slice(7)
   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any
      ;(req as any).user = payload
      next()
   } catch (err) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Token không hợp lệ hoặc đã hết hạn`)
      res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' })
      return 
   }
}

// GET /api/auth/me
router.get('/me', authenticate, async (req: Request, res: Response) => {
   const { userId } = (req as any).user
   const [[user]]: any = await pool.query(
      'SELECT id, name, role FROM users WHERE id = ?',
      [userId]
   )
   res.json({ id: user.id, name: user.name, role: user.role })
})

// POST /api/auth/logout
router.post('/logout', authenticate, (req: Request, res: Response) => {
   const { userId } = (req as any).user
   // TODO: nếu dùng blacklist, lưu token vào blacklist ở đây
   console.log(`[${new Date().toISOString()}] 🔒 User ID=${userId} đã logout`)
   res.json({ message: 'Đăng xuất thành công.' })
})

export default router
