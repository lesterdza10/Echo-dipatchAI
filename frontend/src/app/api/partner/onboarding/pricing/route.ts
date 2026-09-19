import { authOptions } from "@/auth";
import uploadToCloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import Vehicle from "@/models/vehicle.model";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions) as any;
        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const partner = await User.findOne({ email: session.user.email });
        if (!partner) {
            return new Response(JSON.stringify({ message: "Partner not found" }), {
                status: 404,
            });
        }
        const vehicle = await Vehicle.findOne({ owner: partner._id });
        if (!vehicle) {
            return new Response(JSON.stringify({ message: "Vehicle not found" }), {
                status: 404,
            });
        }
        const formData = await request.formData();
        const image = formData.get("image") as File | null;
        const baseFare = formData.get("baseFare") as string;
        const pricePerKm = formData.get("pricePerKm") as string;
        const waitingCharge = formData.get("waitingCharge") as string;

        let updated = false;
        if (image && image.size > 0) {
            const imageUrl = await uploadToCloudinary(image);
            vehicle.imageUrl = imageUrl;
            updated = true;
        }
        if (baseFare !== null) {
            vehicle.baseFare = parseFloat(baseFare);
            updated = true;
        }
        if (pricePerKm !== null) {
            vehicle.pricePerKm = parseFloat(pricePerKm);
            updated = true;
        }
        if (waitingCharge !== null) {
            vehicle.waitingCharge = parseFloat(waitingCharge);
            updated = true;
        }

        if (updated == false) {
            return new Response(JSON.stringify({ message: "No data to update" }), {
                status: 400,
            });
        }

        vehicle.status = "pending";
        vehicle.rejectionReason = undefined;
        await vehicle.save();
        partner.partnerOnboardingSteps = 6;
        await partner.save();

        return new Response(
            JSON.stringify({ message: "Pricing updated successfully", vehicle }),
            {
                status: 200,
            },
        );



    } catch (error) {
        return new Response(JSON.stringify({ message: `Internal server error ${error}` }), {
            status: 500,
        });

    }



}

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions) as any;
        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        const partner = await User.findOne({ email: session.user.email });
        if (!partner) {
            return new Response(JSON.stringify({ message: "Partner not found" }), {
                status: 404,
            });
        }
        const vehicle = await Vehicle.findOne({ owner: partner._id });
        if (!vehicle) {
            return new Response(JSON.stringify({ message: "Vehicle not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ vehicle }), {
            status: 200,
        });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
        });
    }
}