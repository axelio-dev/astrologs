"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { geistSans, geistMono } from "@/app/fonts";
import "../globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950`}
    >
      <Navbar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-slate-900/20 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
