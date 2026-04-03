import type { Metadata } from "next";
import { geistSans, geistMono } from "@/app/fonts";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Astrologs | Ephemeris",
  description:
    "Astrologs dashboard: Check today's and the coming days' sky conditions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 transition-colors duration-300`}
    >
      {children}
    </div>
  );
}
