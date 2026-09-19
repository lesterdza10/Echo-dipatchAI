import { connectDB } from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }
        const { accountHolderName, accountNumber, ifscCode, upi, mobileNumber } = await request.json();
        if (!accountHolderName || !accountNumber || !ifscCode || !mobileNumber) {
            return new Response(JSON.stringify({ message: "All bank details are required" }), {
                status: 400,
            });
        }
        const partnerBank = await PartnerBank.findOneAndUpdate(
            { owner: user._id },
            { accountHolderName, accountNumber, ifscCode, upi, status: "added" },
            { new: true, upsert: true }
        );
        user.mobileNumber = mobileNumber;

        user.partnerOnboardingSteps = 3;

        user.partnerStatus = "pending";
        user.rejectionReason = undefined;
        user.videoKycStatus = "pending";
        user.videoKycRejectionReason = undefined;
        user.videoKycRoomId = "";
        await user.save();
        return new Response(JSON.stringify({ message: "Bank details saved successfully", partnerBank }), {
            status: 200,
        });

    } catch (error) {
        console.error("Error saving bank details:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
        });
    }
}
export async function GET(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }
        const partnerBank = await PartnerBank.findOne({ owner: user._id });
        if (partnerBank) {
            return new Response(JSON.stringify({ mobileNumber: user.mobileNumber, partnerBank }), {
                status: 200,
            });

        } else {
            return new Response(JSON.stringify({ message: "Bank details not found" }), {
                status: 404,
            });
        }



    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
        });

    }
}
