import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import Vehicle from "@/models/vehicle.model";
import { getServerSession } from "next-auth";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        await connectDB();
        const vehicleId = (await context.params).id;
        const vehicle = await Vehicle.findById(vehicleId).populate("owner")


        if (!vehicle) {
            return new Response(JSON.stringify({ message: "Vehicle not found" }), {
                status: 400,
            });
        }

        vehicle.status = "approved";
        vehicle.rejectionReason = undefined;
        await vehicle.save();

        const partner = await User.findById(vehicle.owner._id);
        if (!partner) {
            return new Response(JSON.stringify({ message: "Owner not found" }), {
                status: 400,
            });
        }
        partner.partnerOnboardingSteps = 7;
        await partner.save();

        return new Response(JSON.stringify({ vehicle }), {
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
        });
    }

}