import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        await connectDB();
        const PartnerId = (await context.params).id;
        const partner = await User.findById(PartnerId);


        if (!partner || partner.role !== "partner") {
            return new Response(JSON.stringify({ message: "Partner not found" }), {
                status: 400,
            });
        }
        const roomId = `kyc-${partner._id}-${Date.now()}`;
        partner.videoKycRoomId = roomId;
        partner.videoKycStatus = "in_progress";
        partner.partnerOnboardingSteps = 4;
        await partner.save();

        return new Response(JSON.stringify({ roomId }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Video KYC start error: ${error}` }), {
            status: 500,
        });


    }
}