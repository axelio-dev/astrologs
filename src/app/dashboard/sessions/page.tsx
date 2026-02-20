"use client";

import { authClient } from "@/lib/auth-client";
import { Rocket, Camera } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exo } from "../../fonts";

export default function Sessions() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Rocket className="text-red-500 animate-bounce w-10 h-10" />
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1">
        <div className="block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1
                  className={`${exo.className} text-4xl font-semibold text-gray-900`}
                >
                  Sessions
                </h1>
                <p className="text-gray-500 mt-3 text-md">
                  Manage your astronomical sessions
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
