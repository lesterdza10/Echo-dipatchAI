import uploadToCloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import PartnerDocs from "@/models/PartnerDocs.models";
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 400,
            });
        }
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }
        const formData = await request.formData();
        const aadhar = formData.get("aadhar") as Blob | null;
        const license = formData.get("license") as Blob | null;
        const rc = formData.get("rc") as Blob | null;
        if (!aadhar || !license || !rc) {
            return new Response(JSON.stringify({ message: "All document fields are required" }), {
                status: 400,
            });
        }
        const updatePayload: any = {
            status: "pending",
        }
        if (aadhar) {
            const url = await uploadToCloudinary(aadhar);
            if (!url) {
                return new Response(JSON.stringify({ message: "Failed to upload aadhar" }), {
                    status: 500,
                });
            }
            updatePayload.aadharUrl = url;

        }
        if (license) {
            const url = await uploadToCloudinary(license);
            if (!url) {
                return new Response(JSON.stringify({ message: "Failed to upload license" }), {
                    status: 500,
                });
            }
            updatePayload.licenceUrl = url;
        }
        if (rc) {
            const url = await uploadToCloudinary(rc);
            if (!url) {
                return new Response(JSON.stringify({ message: "Failed to upload rc" }), {
                    status: 500,
                });
            }
            updatePayload.rcUrl = url;
        }
        const partnerDocs = await PartnerDocs.findOneAndUpdate({ owner: user._id },
            { $set: updatePayload },
            { upsert: true, new: true }
        )
        if (!user.partnerOnboardingSteps || user.partnerOnboardingSteps < 2) {
            user.partnerOnboardingSteps = 2;
        }
        await user.save();
        return new Response(JSON.stringify(partnerDocs), { status: 201 });



    }
    catch (error) {
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }

}