import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";

const oswald = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});
const newZealand = localFont({
  src: "../fonts/PlaywriteNZ-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-newZealand",
});

export const metadata: Metadata = {
  title: "Movies Mania!",
  description: "Movie Matrix Fun!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newZealand.variable} ${oswald.variable}  bg-slate text-darkSlate`}
    >
      <body className="font-oswald">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
