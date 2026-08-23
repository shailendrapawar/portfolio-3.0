import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}