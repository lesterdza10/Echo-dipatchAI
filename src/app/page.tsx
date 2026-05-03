import Footer from "@/components/Footer";
import Homepage from "@/components/Homepage";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Nav />
      <Homepage />
      <Footer />
    </div>
  );
}
