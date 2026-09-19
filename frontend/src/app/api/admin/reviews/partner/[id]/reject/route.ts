import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import User from "@/models/usermodel";
import PartnerDocs from "@/models/PartnerDocs.models";
import PartnerBank from "@/models/partnerBank.model";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }
        await connectDB();
        const { rejectionReason } = await req.json();
        const PartnerId = (await context.params).id;
        const partner = await User.findById(PartnerId);


        if (!partner || partner.role !== "partner") {
            return new Response(JSON.stringify({ message: "Partner not found" }), {
                status: 400,
            });
        }


        partner.partnerStatus = "rejected";
        partner.rejectionReason = rejectionReason

        await partner.save();

        return new Response(JSON.stringify({ message: "Partner rejected successfully" }), {
            status: 200,
        });


    } catch (error) {
        return new Response(JSON.stringify({ message: `Partner reject error ${error}` }), {
            status: 500,
        });

    }
}