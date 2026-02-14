"use client";

import {
  Home,
  Camera,
  Share2,
  Calendar,
  Image as ImageIcon,
  Package,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Sessions", icon: Camera, href: "/sessions" },
  { name: "Publications", icon: Share2, href: "/publications" },
  { name: "Ephemeris", icon: Calendar, href: "/calendar" },
  { name: "Gallery", icon: ImageIcon, href: "/gallery" },
  { name: "Equipments", icon: Package, href: "/equipments" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-[calc(100vh-81px)] flex flex-col justify-between">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-red-50 text-red-500 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-red-500"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="p-4 border-t border-gray-100">
        <div className="flex flex-col gap-1 px-4 py-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Connected as
          </p>
          <p className="text-xs font-medium text-gray-700 truncate">
            {session?.user?.email || "Loading..."}
          </p>
          <p className="text-[10px] text-gray-400 mt-2">Version : Pre-Alpha</p>
        </div>
      </footer>
    </aside>
  );
}
