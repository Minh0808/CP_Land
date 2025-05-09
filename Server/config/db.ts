// src/data.ts
import dotenv from 'dotenv'
import * as mysql from 'mysql2/promise'
import nodemailer from 'nodemailer'

dotenv.config()

// Lấy ENV
const {
    DB_HOST = '',
    DB_PORT = '14958',
    DB_USER = '',
    DB_PASS = '',
    DB_NAME = '',
    EMAIL_USER = '',
    EMAIL_PASS = '',
  } = process.env;

// Khởi MySQL pool
export const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

// Khởi Nodemailer
export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
})
