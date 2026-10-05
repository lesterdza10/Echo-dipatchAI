import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/booking.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }

        const { searchParams } = new URL(req.url);
        const hours = parseInt(searchParams.get("hours") ?? "24", 10);
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);

        const bookings = await Booking.find({
            createdAt: { $gte: since },
            "pickUpLocation.coordinates": { $exists: true, $ne: [] },
        }).select("pickUpLocation createdAt");

        const points = bookings
            .filter(
                (b) =>
                    b.pickUpLocation?.coordinates?.length === 2
            )
            .map((b) => ({
                // GeoJSON stores [lng, lat] → map to { lat, lng }
                lat: b.pickUpLocation.coordinates[1],
                lng: b.pickUpLocation.coordinates[0],
            }));

        return Response.json({ points, total: points.length }, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: `heatmap error: ${error}` },
            { status: 500 }
        );
    }
}
