import {connectDB} from '@/lib/db'
import User from '@/models/usermodel'
export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, otp } = await req.json()
    if (!email || !otp) {
      return Response.json({ error: 'Email and OTP are required' }, { status: 409 })
    }
    let user = await User.findOne({ email })
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 400 })
    }
    if (user.isEmailVerified) {
      return Response.json({ error: 'Email is already verified' }, { status: 400 })
    }
    if(!user.otpExpiresAt || user.otpExpiresAt < new Date()){
      return Response.json({ error: 'OTP has expired' }, { status: 400 })
    }
    if (user.otp !== otp) {
      return Response.json({ error: 'Invalid OTP' }, { status: 400 })
    }
    user.isEmailVerified = true
    user.otp = undefined
    user.otpExpiresAt = undefined as unknown as Date
    await user.save()
    return Response.json({ message: 'Email verified successfully' }, { status: 200 })
  }
catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })


}
}