// Root layout — renders grain overlay, Header, page content, Footer, and ChatWidget for all pages.
import type { Metadata } from "next";
// @ts-ignore: allow importing global CSS in app layout
import "./globals.css";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ChatWidget from "@/components/storefront/ChatWidget";
import { ToastProvider } from "@/components/ui/Toast";
import VantaBackground from "@/components/storefront/VantaBackground";

export const metadata: Metadata = {
  title: "Chickenoodle",
  description: "E-commerce template",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-brand-pitch text-brand-warm-white relative">
        <div className="grain-overlay" />
        <VantaBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatWidget />
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
