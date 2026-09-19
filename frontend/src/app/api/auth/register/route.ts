import { NextResponse, userAgent } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/usermodel'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/SendMail'


async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'name, email and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email }).lean()
    if (existing && existing.isEmailVerified) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes




    const passwordHash = await hashPassword(password)
    let createdUser
    if (existing && !existing.isEmailVerified) {
      existing.name = name,
        existing.password = passwordHash,
        existing.otp = otp,
        existing.otpExpiresAt = otpExpiresAt,
        createdUser = await existing.save()
    }
    else {
      createdUser = await User.create({
        name,
        email,
        password: passwordHash,
        otp,
        otpExpiresAt,
        partnerStatus: "pending",
      })
    }

    await sendEmail(
      email,
      'Verify your email for Echo Dispatch',
      `<h2>Your OTP code is: ${otp}</h2><p>This code will expire in 10 minutes.</p>`
    )




    const role = createdUser.role || 'user'

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: createdUser._id.toString(),
          name: createdUser.name,
          email: createdUser.email,
          password: createdUser.password,
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt,
          role,
        },
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    console.error('Register error:', err)
    const error = err as { code?: number; message?: string }
    if (error.code === 11000) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
