import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DemoBanner } from "@/components/DemoBanner";
import { StickyChrome } from "@/components/StickyChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bosodance · System rezerwacji (Demo)",
  description:
    "Profesjonalny system rezerwacji i płatności dla szkoły tańca Bosodance. Demo technologiczne — gotowe rozwiązanie szyjemy na miarę.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <StickyChrome>
          <DemoBanner />
          <Header />
        </StickyChrome>
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
