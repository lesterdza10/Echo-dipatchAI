import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import User from "@/models/usermodel";
import PartnerDocs from "@/models/PartnerDocs.models";
import PartnerBank from "@/models/partnerBank.model";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        await connectDB();
        const PartnerId = (await context.params).id;
        const partner = await User.findById(PartnerId);


        if (!partner || partner.role !== "partner") {
            return new Response(JSON.stringify({ message: "Partner not found" }), {
                status: 400,
            });
        }

        const partnerDocs = await PartnerDocs.findOne({ owner: partner._id });
        const partnerBank = await PartnerBank.findOne({ owner: partner._id });
        if (!partnerDocs || !partnerBank) {
            return new Response(JSON.stringify({ message: "Partner did not submit all required documents" }), {
                status: 400,
            });
        }
        if (partner.partnerStatus === "approved") {
            return new Response(JSON.stringify({ message: "Partner already approved" }), {
                status: 400,
            });
        }

        partner.partnerStatus = "approved";
        partner.partnerOnboardingSteps = 4;
        await partner.save();
        partnerDocs.status = "approved";
        await partnerDocs.save();
        partnerBank.status = "verified";
        await partnerBank.save();

        return new Response(JSON.stringify({ message: "Partner approved successfully" }), {
            status: 200,
        });


    } catch (error) {
        return new Response(JSON.stringify({ message: `Partner get error ${error}` }), {
            status: 500,
        });

    }
}