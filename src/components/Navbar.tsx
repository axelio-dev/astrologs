import { Telescope, Bell, Settings, LogOut, User } from "lucide-react";
import { exo } from "@/app/fonts";
import Link from "next/link";

export default function Navbar() {
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
        <div className="relative p-1 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
          <User className="h-5 w-5" />
        </div>
        <div className="relative p-1 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
          <Settings className="h-6 w-6 cursor-pointer transition-colors" />
        </div>
        <div className="relative p-1 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
          <Link href="/auth/logout">
            <LogOut className="h-6 w-6 cursor-pointer hover:text-red-600 transition-colors" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
