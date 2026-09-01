import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CountdownBanner } from "@/components/CountdownBanner";
import { BottomNav } from "@/components/BottomNav";
import { PincodeModal } from "@/components/PincodeModal";
import { Toaster } from "sonner";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <Toaster position="top-center" richColors theme="light" />
      <CountdownBanner />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <PincodeModal />
    </div>
  );
}
