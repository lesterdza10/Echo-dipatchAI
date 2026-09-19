import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const PendingKycReviews = await User.find({
            role: "partner",
            partnerOnboardingSteps: 4,
            videoKycStatus: { $in: ["pending", "in_progress"] },
        });
        return Response.json(PendingKycReviews
            , { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Partner kyc get error ${error}` }), {
            status: 500,
        });
    }
}