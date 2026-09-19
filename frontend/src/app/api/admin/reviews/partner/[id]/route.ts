import { authOptions } from "@/auth";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import User from "@/models/usermodel";
import Vehicle from "@/models/vehicle.model";
import PartnerDocs from "@/models/PartnerDocs.models";
import PartnerBank from "@/models/partnerBank.model";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }

) {
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

        const vehicle = await Vehicle.findOne({ owner: PartnerId })
        const documents = await PartnerDocs.findOne({ owner: PartnerId })
        const bank = await PartnerBank.findOne({ owner: PartnerId })

        return new Response(JSON.stringify({
            partner,
            vehicle: vehicle || null,
            documents: documents || null,
            bank: bank || null,
        }), {
            status: 200,
        });



    } catch (error) {
        return new Response(JSON.stringify({ message: `Partner get error ${error}` }), {
            status: 500,
        });
    }

}