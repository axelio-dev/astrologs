"use client";

import { useState } from "react";
import { exo } from "@/app/fonts";
import { User, Lock, Mail, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        toast.error(data.error ?? "Registration failed");
        return;
      }

      setStatus("success");
      toast.success("Account created successfully!");

      setUsername("");
      setEmail("");
      setPassword("");
    } catch {
      setStatus("error");
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[url('/pexels-thirdman-8495471.webp')] bg-cover bg-center">
      <section className="w-full max-w-md border border-white/20 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl p-4 sm:p-6 scale-95 sm:scale-100">
        <header>
          <h1
            className={`${exo.className} text-white text-3xl sm:text-4xl text-center`}
          >
            Register
          </h1>
          <h2
            className={`${exo.className} text-white text-lg sm:text-xl text-center italic mt-1`}
          >
            Create an account!
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="username"
              className={`${exo.className} text-white text-base sm:text-lg`}
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="username"
                type="text"
                placeholder="NebulaRider"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 py-2.5 sm:py-3 rounded-3xl bg-white focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className={`${exo.className} text-white text-base sm:text-lg`}
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 py-2.5 sm:py-3 rounded-3xl bg-white focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className={`${exo.className} text-white text-base sm:text-lg`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Andromeda@42"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-2.5 sm:py-3 rounded-3xl bg-white focus:outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 sm:mt-10 py-2.5 sm:py-3 px-6 rounded-full font-medium text-black bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Register
            <LogIn className="w-5 h-5" />
          </button>
        </form>

        <footer className="mt-4 sm:mt-6 text-center text-white/80 text-sm">
          <Link href="/auth/login" className="underline">
            Already have an account? Log in
          </Link>
        </footer>
      </section>
    </main>
  );
}
