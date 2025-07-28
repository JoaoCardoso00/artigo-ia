import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>{children}</main>
      <Footer className="mt-auto" />
    </div>
  );
}
