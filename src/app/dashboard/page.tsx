"use client";

import { authClient } from "@/lib/auth-client";
import { Rocket, Camera, Telescope, Tent, Clock, Share } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exo } from "../fonts";
import StatCard from "@/components/StatCard";

export default function Dashboard() {
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
                  Welcome to Astrologs!
                </h1>
                <p className="text-gray-500 mt-3 text-md">
                  Here is an overview of your astronomical activity
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
            <StatCard
              title="Sessions this month"
              icon={Tent}
              description="+0% vs last month"
              value="0"
            />
            <StatCard
              title="Images captured"
              icon={Camera}
              description="+18% vs last month"
              value="260"
            />
            <StatCard
              title="Total time"
              icon={Clock}
              description="+18% vs last month"
              value="4h 45m 30s"
            />
            <StatCard
              title="Publications"
              icon={Share}
              description="+18% vs last month"
              value="2"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
