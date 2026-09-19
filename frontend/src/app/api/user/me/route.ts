import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import User from "@/models/usermodel";
import { connectDB } from "@/lib/db";

export async function GET(request:Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions)

    // User is not authenticated
    if (!session || !session.user) {
      return Response.json(
        { authenticated: false, message: "User not authenticated" },
        { status: 401 }
      )
    }
    const user=await User.findOne({ email: session.user.email })
    if(!user){
      return Response.json(
        { authenticated: false, message: "User not found" },
        { status: 401 }
      )
    }
    return Response.json(
        user,
        { status: 200 }
    )

    
    
  } catch (error) {
    console.error('Error in /api/user/me:', error);
    return Response.json(
      { authenticated: false, message: `get me error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
