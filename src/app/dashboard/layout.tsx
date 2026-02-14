import type { Metadata } from "next";
import { geistSans, geistMono } from "@/app/fonts";
import "../globals.css";
import "../fonts";

export const metadata: Metadata = {
  title: "Astrologs | Dashboard",
  description:
    "Astrologs dashboard: manage your data, view your statistics and monitor your activity in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </div>
  );
}
