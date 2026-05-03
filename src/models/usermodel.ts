import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
	name: string;
	email: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const User: mongoose.Model<IUser> = (mongoose.models['User'] as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
