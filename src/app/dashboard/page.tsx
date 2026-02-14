"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, Rocket, User as UserIcon } from "lucide-react";
import { exo } from "@/app/fonts";
import Navbar from "@/components/Navbar";

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
      <div className="min-h-screen bg-[#fff] flex items-center justify-center">
        <Rocket className="text-red-500 animate-bounce w-10 h-10" />
      </div>
    );

  return (
    <main className="bg-black h-full w-full">
      <Navbar />
    </main>
  );
}
