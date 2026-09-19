type VideoKycStatus = "not_required" | "pending" | "approved" | "rejected" | "in_progress";
export interface IUser {
	_id?: string;
	name: string;
	email: string;
	password?: string;
	isEmailVerified?: boolean;
	otp?: string;
	otpExpiresAt?: Date;
	role: 'user' | 'admin' | 'partner'
	createdAt?: Date;
	updatedAt?: Date;
	partnerOnboardingSteps?: number;
	mobileNumber?: string;
	partnerStatus?: "approved" | "pending" | "rejected";
	rejectionReason?: string;
	videoKycStatus: VideoKycStatus;
	videoKycRoomId: string;
	videoKycRejectionReason?: string;

}
