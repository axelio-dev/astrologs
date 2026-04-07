"use client";

import {
  Telescope,
  Settings,
  LogOut,
  User,
  Sun,
  Moon,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { exo } from "@/app/fonts";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import UserModal from "./UserModal";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("See you soon!");
            router.push("/auth/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-white dark:bg-slate-950 px-4 md:px-6 py-4 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300 sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={toggleSidebar}
            className="p-2 md:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <Telescope className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
            <h1
              className={`text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white ${exo.className}`}
            >
              AstroLogs
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              All services available
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-4 text-gray-600 dark:text-slate-400">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} />
              ))}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group"
          >
            <User
              size={20}
              className="group-hover:text-red-500 transition-colors"
            />
            {isPending && (
              <Loader2 className="absolute inset-0 m-auto h-3 w-3 animate-spin text-red-500" />
            )}
          </button>

          <button className="hidden sm:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <Settings size={20} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <LogOut
              size={20}
              className="group-hover:text-red-600 transition-colors"
            />
          </button>
        </div>
      </nav>

      {mounted && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={session?.user}
        />
      )}
    </>
  );
}
