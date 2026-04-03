"use client";

import { Telescope, Settings, LogOut, User, Sun, Moon } from "lucide-react";
import { exo } from "@/app/fonts";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Évite l'erreur d'hydratation (différence serveur/client au premier rendu)
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("See you soon!");
            router.push("/auth/login");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Error while logout");
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-slate-950 px-6 py-5 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Telescope className="h-8 w-8 text-red-600" />
          <h1
            className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-white ${exo.className}`}
          >
            AstroLogs
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            All services are available
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-gray-600 dark:text-slate-400">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {mounted &&
            (theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5" />
            ))}
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <User className="h-5 w-5" />
        </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <Settings className="h-5 w-5" />
        </button>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
          title="Déconnexion"
        >
          <LogOut className="h-5 w-5 group-hover:text-red-600 transition-colors" />
        </button>
      </div>
    </nav>
  );
}
