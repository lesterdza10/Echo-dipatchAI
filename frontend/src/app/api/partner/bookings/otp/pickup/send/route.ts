import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/SendMail";
import Booking from "@/models/booking.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { bookingId } = await req.json()


        const booking = await Booking.findById(bookingId).populate("user")
        if (!booking) {
            return NextResponse.json(
                { message: "booking not found" },
                { status: 400 }
            )
        }
        if (!booking.user || typeof booking.user === "string" || !booking.user.email) {
            return NextResponse.json(
                { message: "booking user email not found" },
                { status: 400 }
            )
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        booking.pickUpOtp = otp
        booking.pickUpOtpExpires = new Date(Date.now() + 5 * 60 * 1000)
        await booking.save()

        try {
            await sendEmail(booking.user.email, "Your Pickup OTP - Echodispatch",
                `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Ride OTP</h2>

          <p>Your pickup OTP is:</p>

          <h1 style="letter-spacing:6px">${otp}</h1>

          <p>This OTP is valid for 5 minutes.</p>

          <p>Share this OTP with your driver to start the ride.</p>

          <br/>

          <b>Echodispatch</b>
        </div>
        `)
        } catch (error) {
            console.error("Pickup OTP email failed:", error)
            return NextResponse.json(
                { message: "pickup otp email failed" },
                { status: 502 }
            )
        }

        return NextResponse.json(
            { message: "pick up otp sent" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Pickup OTP route failed:", error)
        return NextResponse.json(
            { message: "pick up otp error" },
            { status: 500 }
        )
    }
}