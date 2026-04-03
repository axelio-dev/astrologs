import type { Metadata } from "next";
import { geistSans, geistMono } from "@/app/fonts";
import "./globals.css";
import "./fonts";
import { ThemeProvider } from "@/components/ThemeProvider"; // Importe ton provider ici

export const metadata: Metadata = {
  title: "Astrologs",
  description: "Where cosmos meets data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning est nécessaire car next-themes modifie l'élément <html>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class" // Indique à Tailwind d'utiliser la classe .dark
          defaultTheme="system" // Utilise le thème de l'ordi par défaut
          enableSystem // Permet de switcher automatiquement si l'utilisateur change ses réglages OS
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
