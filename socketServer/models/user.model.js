import mongoose from 'mongoose';



const UserSchema= new mongoose.Schema(
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
		partnerStatus: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
		rejectionReason: { type: String },
		videoKycStatus: { type: String, enum: ["not_required", "pending", "approved", "rejected", "in_progress"], default: "not_required" },
		videoKycRoomId: { type: String },
		videoKycRejectionReason: { type: String },
		socketId: { type: String, default: null },
		isOnline: { type: Boolean, default: false, index: true },
		location: {
			type: { type: String, enum: ['Point'] },
			coordinates: { type: [Number], default: [0, 0] }
		}
	},
	{
		timestamps: true,
	}
);
UserSchema.index({ location: '2dsphere' });
const User=mongoose.model('User', UserSchema);

export default User;
