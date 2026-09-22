import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/usermodel";
import Vehicle from "@/models/vehicle.model";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions)
        if (!session?.user?.id && !session?.user?.email) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 401 }
            )
        }

        const {
            driverId,
            vehicleId,
            pickUpAddress,
            dropAddress,
            pickUpLocation,
            dropLocation,
            fare,
            mobileNumber,
        } = await req.json()


        if (!vehicleId || !pickUpLocation?.coordinates || !dropLocation?.coordinates) {
            return NextResponse.json(
                { message: "missing required details" },
                { status: 400 }
            )
        }
        const user = session.user.id
            ? await User.findById(session.user.id)
            : await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 404 }
            )
        }
        const vehicle = await Vehicle.findById(vehicleId)
        if (!vehicle) {
            return NextResponse.json(
                { message: "vehicle not found" },
                { status: 400 }
            )
        }

        const resolvedDriverId = driverId || vehicle.owner.toString()
        const driver = await User.findById(resolvedDriverId)
        if (!driver) {
            return NextResponse.json(
                { message: "driver not found" },
                { status: 400 }
            )
        }

        const existing = await Booking.findOne({
            user: user._id,
            bookingStatus: {
                $in: ["requested", "awaiting_payment", "confirmed", "started"]
            }
        })
        console.log(existing)

        if (existing) {
            return NextResponse.json(
                existing
            )
        }

        const booking = await Booking.create({
            user: user._id,
            driver,
            vehicle: vehicleId,
            pickUpAddress,
            dropAddress,

            pickUpLocation,
            dropLocation,

            fare,

            userMobileNumber: mobileNumber,
            driverMobileNumber: driver.mobileNumber,

            bookingStatus: "requested"
        })

        await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
            event: "new-booking",
            userId: resolvedDriverId,
            data: booking
        })


        return NextResponse.json(
            booking, { status: 200 }
        )


    } catch (error) {
        return NextResponse.json(
            { message: `create booking error ${error}` },
            { status: 500 }
        )
    }
}