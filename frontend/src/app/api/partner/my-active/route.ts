import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db"
import Booking from "@/models/booking.model"
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"

export async function GET() {
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
        const booking = await Booking.findOne({
            driver: user._id,
            bookingStatus: { $in: ["confirmed", "started"] }
        }).populate("user vehicle driver")

        return NextResponse.json(booking
            , { status: 200 }
        )

    } catch (error) {
        return NextResponse.json({ message: `get active ride for partner error ${error}` }
            , { status: 500 }
        )
    }
}