import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar, Footer } from "@/components/layout";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "WeldingPanchal | Industrial Welding, Fabrication & Engineering",
  description:
    "India's premier industrial welding, heavy structural steel fabrication, certified workforce mobilization, and precision metal engineering platform.",
  keywords: [
    "welding",
    "fabrication",
    "structural steel",
    "TIG welding",
    "MIG welding",
    "industrial welding",
    "certified welders",
    "India",
    "Gujarat",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#171717] font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
