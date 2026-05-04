import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/usermodel'
import bcrypt from 'bcryptjs'


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
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const createdUser = await User.create({
      name,
      email,
      password: passwordHash
    })
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
