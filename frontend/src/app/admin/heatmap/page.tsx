import { authOptions } from "@/auth";
import HeatmapDashboard from "@/components/HeatmapDashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Live Heatmap | EchoDispatch Admin",
  description:
    "Real-time request density heatmap for the EchoDispatch admin dashboard.",
};

export default async function HeatmapPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }
  return <HeatmapDashboard />;
}
