"use client";

import { Home, Camera, Calendar, Package, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Sessions", icon: Camera, href: "/dashboard/sessions" },
  { name: "Ephemeris", icon: Calendar, href: "/dashboard/ephemeris" },
  { name: "Equipments", icon: Package, href: "/dashboard/equipments" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 
        h-full md:h-[calc(100vh-81px)] flex flex-col justify-between 
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <nav className="p-4">
          <div className="flex items-center justify-between md:hidden mb-6">
            <span className="font-bold text-red-500">Navigation</span>
            <button onClick={onClose} className="p-2">
              <X size={20} />
            </button>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => onClose()} // Close sidebar on link click (mobile)
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-red-50 dark:bg-red-500/10 text-red-500 font-semibold"
                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-red-500"
                          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-slate-300"
                      }`}
                    />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="p-4 border-t border-gray-100 dark:border-slate-800">
          <div className="flex flex-col gap-1 px-4 py-2">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Connected as
            </p>
            <p className="text-xs font-medium text-gray-700 dark:text-slate-200 truncate">
              {session?.user?.email || "Loading..."}
            </p>
            <p className="text-[10px] text-gray-400 mt-2">
              Version : Beta
            </p>
          </div>
        </footer>
      </aside>
    </>
  );
}
