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
}
