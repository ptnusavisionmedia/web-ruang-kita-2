import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { ToastProvider } from "@/components/Toast";
import MotionProvider from "@/components/MotionProvider";
import SplashScreen from "@/components/SplashScreen";

// Font disimpan lokal di app/fonts (lisensi SIL OFL), jadi build tidak butuh koneksi ke Google Fonts.
const instrument = localFont({
  src: "./fonts/InstrumentSans-Variable.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
});

const dmSerif = localFont({
  src: "./fonts/DMSerifDisplay-Regular.woff2",
  variable: "--font-dm-serif",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RuangKita — Cari dan booking kos, apartemen, rumah",
  description:
    "Temukan tempat tinggal yang terasa seperti rumah. Cari, jadwalkan survei, lalu booking dan bayar dalam satu tempat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${instrument.variable} ${dmSerif.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <MotionProvider>
        <SplashScreen />
        <ToastProvider>
          <Suspense fallback={<div className="h-16 border-b border-line" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
        </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
