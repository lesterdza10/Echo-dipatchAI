import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/booking.model";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { booking: null },

            )
        }

        const booking = await Booking.findOne({
            user: session.user.id,
            bookingStatus: { $in: ["requested", "awaiting_payment", "confirmed", "started"] }
        })

        if (!booking) {
            return NextResponse.json(
                { booking: "idle" }
            )
        }

        return NextResponse.json(
            { booking }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `get active booking error ${error}` },
            { status: 400 }
        )
    }
}