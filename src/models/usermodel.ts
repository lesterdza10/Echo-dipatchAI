import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
	name: string;
	email: string;
	password?: string;
	isEmailVerified?: boolean;
    otp?: string;
	otpExpiresAt: Date;
	role: 'user' | 'admin'|'partner'
	createdAt?: Date;
	updatedAt?: Date;
}

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: false },
		role: { type: String, enum: ['user', 'admin', 'partner'], default: 'user' },
		isEmailVerified: { type: Boolean, default: false },
		otp: { type: String, required: false },
		otpExpiresAt: { type: Date, required: false },

    },
	{
		timestamps: true,
	}
);

const User: mongoose.Model<IUser> = (mongoose.models['User'] as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
