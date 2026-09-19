import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions) as any;
        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const partner = await User.findOne({ email: session.user.email });
        if (!partner) {
            return new Response(JSON.stringify({ message: "Partner not found" }), {
                status: 404,
            });
        }
        if (partner.videoKycStatus !== "rejected") {
            return new Response(JSON.stringify({ message: "You cannot send a request at this time" }), {
                status: 400,
            });
        }
        partner.videoKycStatus = "pending";
        partner.videoKycRejectionReason = undefined;
        partner.videoKycRoomId = "";
        await partner.save();
        return new Response(JSON.stringify({ success: true, message: "Video KYC request sent successfully" }), {
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: `Internal server error: ${error}` }), {
            status: 500,
        });

    }

}