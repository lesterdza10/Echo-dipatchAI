import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const { roomId, action, reason } = await request.json();
        if (!roomId) {
            return new Response(JSON.stringify({ message: "Room ID is required" }), {
                status: 400,
            });

        }
        if (!["approved", "rejected"].includes(action)) {
            return new Response(JSON.stringify({ message: "Invalid action" }), {
                status: 400,
            });
        } const partner = await User.findOne({
            videoKycRoomId: roomId,
            role: "partner",
        })
        if (!partner) {
            return new Response(JSON.stringify({ message: "Partner not found" }), {
                status: 404,
            });
        }
        if (action === "approved") {
            partner.videoKycStatus = "approved";
            partner.videoKycRejectionReason = undefined;
            partner.partnerOnboardingSteps = 5;
        }
        if (action === "rejected") {
            if (!reason) {
                return new Response(JSON.stringify({ message: "Rejection reason is required" }), {
                    status: 400,
                });
            }
            partner.videoKycStatus = "rejected";
            partner.videoKycRejectionReason = reason.trim()

        }
        await partner.save();
        return new Response(JSON.stringify({ status: partner.videoKycStatus }), {
            status: 200,
        });


    } catch (error) {
        return new Response(JSON.stringify({ message: `Internal server error: ${error}` }), {
            status: 500,
        });
    }
}