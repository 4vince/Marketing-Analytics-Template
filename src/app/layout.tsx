// Root layout — renders Header, page content, Footer, and ChatWidget for all pages.
import type { Metadata } from "next";
// @ts-ignore: allow importing global CSS in app layout
import "./globals.css";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ChatWidget from "@/components/storefront/ChatWidget";

export const metadata: Metadata = {
  title: "Store",
  description: "E-commerce template",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
