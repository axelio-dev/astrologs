import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astrologs | Sessions",
  description:
    "Astrologs dashboard: edit your sessions, view your sessions statistics and monitor your activity in real time.",
};

export default function SessionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen">{children}</div>;
}
