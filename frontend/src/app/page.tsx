import { authOptions } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Homepage from "@/components/Homepage";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const user = await User.findOne({ email: session?.user?.email });

  return (
    <div className="w-full min-h-screen bg-white">
      {user?.role === "partner" ? (
        <>
          <Nav />
          <PartnerDashboard />
        </>
      ) : user?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <>
          <Nav />
          <Homepage />
        </>
      )}
      <Footer />
    </div>
  );
}
