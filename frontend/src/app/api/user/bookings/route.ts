

import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "unauthorized" }
                , { status: 400 }
            )
        }

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ message: "user not found" }
                , { status: 400 }
            )
        }

        const bookings = await Booking.find({ user: user._id }).populate("user driver vehicle")
            .sort({ createdAt: -1 })


        return NextResponse.json(
            bookings,
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({ message: `get bookings for partner error ${error}` }
            , { status: 400 }
        )
    }
}