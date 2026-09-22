
import razorpay from "@/lib/razorpay";

import { connectDB } from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { bookingId } = await req.json()
        if (!bookingId) {
            return NextResponse.json(
                { message: "bookingId is required" },
                { status: 400 }
            )
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return NextResponse.json(
                { message: "booking is not found." },
                { status: 400 }
            )
        }

        const amount = Math.round(Number(booking.fare) * 100)
        if (!Number.isInteger(amount) || amount <= 0) {
            return NextResponse.json(
                { message: "booking fare is invalid" },
                { status: 400 }
            )
        }

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: booking._id.toString()
        })

        booking.bookingStatus = "awaiting_payment"
        await booking.save()

        return NextResponse.json(
            {
                orderId: order.id,
                amount: order.amount
            }
            ,
            { status: 200 }
        )

    } catch (error: any) {
        console.error("Payment order creation failed:", error?.error || error)
        return NextResponse.json(
            {
                message: error?.error?.description || "payment order creation failed"
            }
            ,
            { status: 500 }
        )

    }
}