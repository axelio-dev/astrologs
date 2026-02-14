"use client";

import { Telescope, Settings, LogOut, User } from "lucide-react";
import { exo } from "@/app/fonts";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();

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
    <nav className="flex items-center justify-between bg-white px-6 py-5 border-b border-gray-200">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Telescope className="h-8 w-8 text-red-600" />
          <h1 className={`text-2xl font-bold tracking-tight ${exo.className}`}>
            AstroLogs
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium text-green-700">
            All services are available
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-gray-600">
        <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <User className="h-5 w-5" />
        </button>

        <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="h-6 w-6" />
        </button>

        <button
          onClick={handleLogout}
          className="p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
          title="Déconnexion"
        >
          <LogOut className="h-6 w-6 group-hover:text-red-600 transition-colors" />
        </button>
      </div>
    </nav>
  );
}
