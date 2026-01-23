import { Exo_2, Geist, Geist_Mono } from "next/font/google";

export const exo = Exo_2({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-exo",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
