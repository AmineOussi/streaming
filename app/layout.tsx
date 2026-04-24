import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "StreamVault — Watch Movies & TV Shows",
  description: "Stream thousands of movies and TV shows. Powered by IMDB ratings.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "StreamVault",
    description: "Your streaming destination — explore top-rated movies and shows.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="min-h-full bg-[#141414] text-white">
        <Navbar />
        <main>{children}</main>
        <footer className="mt-16 pb-8 px-4 md:px-12 text-gray-600 text-xs">
          <div className="max-w-4xl">
            <p className="mb-2">StreamVault uses data from TMDB and IMDB. Not affiliated with any streaming service.</p>
            <p>© {new Date().getFullYear()} StreamVault. For entertainment purposes.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
