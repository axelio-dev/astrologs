"use client";

import { authClient } from "@/lib/auth-client";
import { Rocket, Camera, Clock, Tent, Telescope } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exo } from "../fonts";
import StatCard from "@/components/StatCard";
import { useState, useEffect, useMemo } from "react";
import { getUserSessions } from "@/lib/actions/session";

export default function Dashboard() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (session) {
        try {
          const data = await getUserSessions();
          setSessions(data);
        } catch (error) {
          console.error("Failed to fetch sessions:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [session]);

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalFrames = sessions.reduce(
      (acc, s) => acc + (s.frameCount || 0),
      0,
    );

    let totalSeconds = 0;
    sessions.forEach((s) => {
      if (!s.totalDuration) return;
      const match = s.totalDuration.match(
        /(?:(\d+)h)?\s*(?:(\d+)m|min)?\s*(?:(\d+)s)?/i,
      );
      if (!match) return;
      const h = parseInt(match[1] || "0");
      const m = parseInt(match[2] || "0");
      const sec = parseInt(match[3] || "0");
      totalSeconds += h * 3600 + m * 60 + sec;
    });

    const formatTotalTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return h > 0 ? `${h}h ${m}m` : `${m}min`;
    };

    const uniqueTargets = new Set(
      sessions.map((s) => s.target.trim().toUpperCase()),
    ).size;

    return {
      count: totalSessions.toString(),
      frames: totalFrames.toLocaleString(),
      time: formatTotalTime(totalSeconds),
      targets: uniqueTargets.toString(),
    };
  }, [sessions]);

  if (isSessionPending || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center transition-colors">
        <Rocket className="text-red-500 animate-bounce w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1
                  className={`${exo.className} text-4xl font-semibold text-gray-900 dark:text-white`}
                >
                  Welcome back {session?.user?.name}!
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-3 text-md">
                  Here is an overview of your astronomical activity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <StatCard
                title="Total Sessions"
                icon={Tent}
                description="Cumulative observation nights"
                value={stats.count}
              />
              <StatCard
                title="Images Captured"
                icon={Camera}
                description="Total frames across all sessions"
                value={stats.frames}
              />
              <StatCard
                title="Total Exposure"
                icon={Clock}
                description="Total time spent tracking"
                value={stats.time}
              />
              <StatCard
                title="Targets Observed"
                icon={Telescope}
                description="Unique deep sky objects"
                value={stats.targets}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
