import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import Vehicle from "@/models/vehicle.model";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { latitude, longitude, vehicleType } = await request.json();
        if (!latitude || !longitude) {
            return new Response(JSON.stringify({ error: "Missing coordinates" }), { status: 400 });
        }
        const partners = await User.find({
            role: "partner",
            isOnline: true,
            partnerStatus: "approved",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000 // 10 km radius
                }
            }
        })
        const partnerIds = partners.map(partner => partner._id);
        if (partnerIds.length === 0) {
            return new Response(JSON.stringify({ error: "No nearby partners found" }), { status: 200 });
        }
        const vehicles = await Vehicle.find({
            owner: { $in: partnerIds },
            type: vehicleType,
            status: "approved",
            isActive: true
        }).lean()
        return new Response(JSON.stringify({ vehicles }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: `Nearby vehicles error ${error}` }), { status: 500 });

    }
}