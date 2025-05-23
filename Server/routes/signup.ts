// src/routes/signup.ts
import { Router, Request, Response } from 'express'
import { pool, transporter } from '../config/db'

type SignupBody = { email: string; phone: string }

const router = Router()

// GET /signup
router.get('/', (_req, res) => {
  res.send('✅ Signup sẵn sàng!')
})
// POST /signup
router.post('/', async (req: Request, res: Response) => {
    // Ép kiểu body ngay trong handler
    const { email, phone } = req.body as SignupBody
  
    if (!email || !phone) {
      res.status(400).json({ message: 'Thiếu email hoặc số điện thoại.' })
      return
    }
  
    try {
      // Lưu vào DB
      await pool.execute(
        'INSERT INTO signup (email, SDT, created_at) VALUES (?, ?, NOW())',
        [email, phone]
      )
  
      // Format thời gian
      const signupTime = new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
      })
  
      // Gửi mail
      await transporter.sendMail({
        from: `"CP Land Website" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: '📣 New Signup from Website',
        html: `
          <h3>Người dùng mới đăng ký:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>SĐT:</strong> ${phone}</p>
          <p><em>Thời gian:</em> ${signupTime}</p>
        `,
      })
  
      // Trả về thành công
      res.status(200).json({ message: 'Đăng ký thành công.' })
      return
    } catch (err) {
      console.error('❌ Lỗi khi xử lý /signup:', err)
      res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại sau.' })
      return
    }
  })

export default router
