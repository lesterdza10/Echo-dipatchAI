import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "unauthorized" }
                , { status: 400 }
            )
        }

        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return NextResponse.json({ message: "partner not found" }
                , { status: 400 }
            )
        }

        const bookings = await Booking.find({
            driver: partner._id,
            bookingStatus: "requested"
        })
        return NextResponse.json(bookings, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `fetch pending req  error ${error}` }
            , { status: 500 }
        )
    }
}