import { authOptions } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
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
  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="w-full min-h-screen bg-white">
      <GeoUpdater userId={plainUser?._id} />
      {plainUser?.role === "partner" ? (
        <>
          <Nav />
          <PartnerDashboard />
        </>
      ) : plainUser?.role === "admin" ? (
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
