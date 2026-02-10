"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await authClient.signOut();
      router.push("/auth/login");
      router.refresh();
    };
    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white">Logging out...</p>
    </div>
  );
}
