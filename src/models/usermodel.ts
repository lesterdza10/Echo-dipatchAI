import mongoose from 'mongoose';
import type { IUser } from '@/types/user';

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: false },
		role: { type: String, enum: ['user', 'admin', 'partner'], default: 'user' },
		isEmailVerified: { type: Boolean, default: false },
		otp: { type: String, required: false },
		otpExpiresAt: { type: Date, required: false },
		partnerOnboardingSteps: { type: Number, min: 0, max: 8, default: 0 },
		mobileNumber: { type: String },
	},
	{
		timestamps: true,
	}
);

const User: mongoose.Model<IUser> = (mongoose.models['User'] as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
