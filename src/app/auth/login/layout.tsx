import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Astrologs | Login",
  description: "Please login to access to the dashboard",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-layout">
      {children}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
