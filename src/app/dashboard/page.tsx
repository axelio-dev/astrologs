"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, Rocket, User as UserIcon } from "lucide-react";
import { exo } from "@/app/fonts";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Safe flight, astronaut!");
          router.push("/auth/login");
          router.refresh();
        },
      },
    });
  };

  if (isPending)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Rocket className="text-red-500 animate-bounce w-10 h-10" />
      </div>
    );

  return (
    <main className="min-h-screen bg-[#050505] text-white bg-[url('/grid.svg')] bg-center">
      <nav className="border-b border-white/10 p-4 backdrop-blur-md bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2
            className={`${exo.className} text-2xl font-bold flex items-center gap-2`}
          >
            <Rocket className="text-red-500" /> Astrologs
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              onKeyDown={(e) => e.key === "Enter" && handleLogout()}
              className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-500 cursor-pointer"
            >
              Logout
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto mt-20 p-6">
        <header className="text-center space-y-4">
          <h1
            className={`${exo.className} text-5xl font-extrabold tracking-tight`}
          >
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              {session?.user?.name}
            </span>{" "}
            !
          </h1>
        </header>
      </section>
    </main>
  );
}
