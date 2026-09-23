import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/booking.model"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "unauthorized" }
                , { status: 400 }
            )
        }
        const { bookingId } = await req.json()

        const booking = await Booking.findById(bookingId).populate("user vehicle driver")

        return NextResponse.json(booking
            , { status: 200 }
        )

    } catch (error) {
        return NextResponse.json({ message: `get active ride user error ${error}` }
            , { status: 500 }
        )
    }
}