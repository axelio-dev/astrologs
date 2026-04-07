"use client";

import { exo } from "@/app/fonts";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  Telescope,
  Sun,
  Moon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function Register() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !email || !password)
      return toast.error("Please fill in all fields");
    if (password.length < 8)
      return toast.error("Password must be 8+ characters");
    setStatus("loading");

    try {
      const { error } = await signUp.email({
        email,
        password,
        name: username,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message ?? "Registration failed");
        setStatus("error");
        return;
      }

      toast.success("Welcome!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
      setStatus("error");
    }
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full flex bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-5 right-5 z-50 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-yellow-400 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="hidden lg:block lg:w-1/2 h-full relative">
        <Image
          src="/pexels-martin-marthadinata-252863-35663232.jpg"
          alt="Register background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12">
          <h1
            className={`${exo.className} text-white text-5xl font-bold flex items-center gap-4`}
          >
            <Telescope size={48} /> Astrologs
          </h1>
          <p className="text-white/80 text-lg mt-2">
            Where the cosmos meets data.
          </p>
        </div>
      </div>

      <section className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <header className="mb-8 text-center lg:text-left">
            <h1
              className={`${exo.className} text-4xl font-bold text-slate-900 dark:text-white mb-2`}
            >
              Register
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Join the community of Astrologs!
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="NebulaRider"
                  className="w-full pl-12 pr-4 h-12 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="astro@example.com"
                  className="w-full pl-12 pr-4 h-12 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 h-12 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50 mt-2"
            >
              {status === "loading" ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <footer className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-red-600 font-bold hover:underline ml-1"
            >
              Log in
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
