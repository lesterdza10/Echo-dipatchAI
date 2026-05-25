import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import User from "@/models/User";

export async function POST(request:Request){
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if(!session||!session.user?.email){
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 400});

        }
        const user=await User.findOne({ email: session.user.email });
        if(!user){
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const {type, number, vehicleModel} = await request.json();
        if(!type || !number || !vehicleModel){
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }
}
catch (error) {
}