import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astrologs | Register",
  description: "Please register to access to the dashboard",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="register-layout">{children}</div>;
}
