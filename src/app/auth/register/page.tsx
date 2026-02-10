"use client";

import { useState } from "react";
import { exo } from "@/app/fonts";
import { User, Lock, Mail, Eye, EyeOff, LogIn, Telescope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setStatus("loading");

    try {
      const { data, error } = await signUp.email({
        email,
        password,
        name: username,
        callbackURL: "/dashboard",
      });

      if (error) {
        const msg =
          typeof error === "string"
            ? error
            : (error.message ?? "An error occurred");
        toast.error(msg);
        setStatus("error");
        return;
      }

      toast.success("Account created! Welcome astronaut.");
      setStatus("success");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen flex">
      <div className="hidden md:block w-1/2 bg-cover bg-center relative">
        <Image
          src="/pexels-martin-marthadinata-252863-35663232.jpg"
          alt="Register background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-red-800 via-red-600/10 to-transparent pointer-events-none" />

        <div className="absolute bottom-20 left-15">
          <h1
            className={`${exo.className} text-white text-5xl font-bold flex items-center`}
          >
            <Telescope className="mr-5 h-15 w-15" />
            Astrologs
          </h1>
          <p className="text-white text-lg italic mt-4">
            Astrologs — where the cosmos meets data.
          </p>
        </div>
      </div>

      <section className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <header className="mb-8 w-full max-w-md">
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`w-3 h-3 rounded-full bg-red-800 ${status === "loading" ? "animate-pulse" : ""}`}
            ></span>
            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            <span className="w-3 h-3 bg-red-400 rounded-full"></span>
            <h1 className={`${exo.className} text-4xl font-bold ml-2`}>
              Register
            </h1>
          </div>
          <h2 className="text-gray-500">Create your account</h2>
        </header>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="NebulaRider"
                className="pl-10 w-full bg-gray-100 h-12 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ludovic.crochet@ptarmigan.xyz"
                className="pl-10 w-full bg-gray-100 h-12 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Andromeda@42"
                className="w-full h-12 rounded-md pl-10 pr-10 bg-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`bg-red-500 text-white w-full h-12 rounded-md flex items-center justify-center space-x-2 font-bold transform hover:scale-[1.02] transition-all duration-300 shadow-lg ${
              status === "loading" ? "opacity-70 cursor-wait" : "cursor-pointer"
            }`}
          >
            {status === "loading" ? (
              "Creating account..."
            ) : (
              <>
                <span>Sign Up</span>
                <LogIn size={20} />
              </>
            )}
          </button>
        </form>

        <footer className="mt-7.5 flex items-center space-x-2">
          <p className="text-gray-500 text-sm">Already have an account?</p>
          <Link
            href="/auth/login"
            className="text-red-500 font-bold hover:underline"
          >
            Log in
          </Link>
        </footer>
      </section>
    </main>
  );
}
