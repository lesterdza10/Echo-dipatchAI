import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import Vehicle from "@/models/vehicle.model";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const TotalPartners = await User.countDocuments({ role: "partner" });
        const TotalApproved = await User.countDocuments({ role: "partner", partnerStatus: "approved" });
        const TotalPending = await User.countDocuments({ role: "partner", partnerStatus: "pending" });
        const TotalRejected = await User.countDocuments({ role: "partner", partnerStatus: "rejected" });
        const PendingPartnerUsers = await User.find({ role: "partner", partnerStatus: "pending", partnerOnboardingSteps: 3 })

        const partnerId = PendingPartnerUsers.map((p) => p._id)
        const PartnerVehicles = await Vehicle.find({
            owner: { $in: partnerId },
        })
        const vehicleTypeMap = new Map(
            PartnerVehicles.map((v) => [String(v.owner), v.type])
        )
        const PendingPartnersReviews = PendingPartnerUsers.map((p) => ({
            _id: p._id,
            name: p.name,
            email: p.email,
            vehicleType: vehicleTypeMap.get(String(p._id)),
        }))
        return Response.json({
            stats: {
                TotalPartners,
                TotalApproved,
                TotalPending,
                TotalRejected
            },
            PendingPartnersReviews,
        }, { status: 200 })


    } catch (error) {
        return Response.json({ message: `admin dashboard error: ${error}` }, { status: 500 });

    }


}