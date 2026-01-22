"use client";

import { useState } from "react";
import { exo } from "@/app/auth/login/font";
import { metadata } from "@/app/auth/login/layout";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center bg-[url('/pexels-thirdman-8495471.jpg')] bg-cover bg-center">
        <section className="w-full max-w-md border border-white/20 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl p-8">
          <header>
            <h1
              className={`${exo.className} text-white text-4xl text-center mt-2 font-exo_2`}
            >
              Login
            </h1>
            <h2
              className={`${exo.className} text-white text-xl text-center italic mt-2`}
            >
              Welcome back!
            </h2>
          </header>

          <form className="mt-8 space-y-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className={`${exo.className} text-white text-lg`}
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  type="text"
                  placeholder="Your email address"
                  className="w-full pl-12 py-3 rounded-3xl bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className={`${exo.className} text-white text-lg`}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full pl-12 pr-12 py-3 rounded-3xl bg-white focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full mt-10 py-3 px-6 rounded-full font-exo_2 font-medium text-black bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <footer className="mt-6 text-center text-white/80 text-sm space-y-1">
            <p className="">Forgot your password?</p>
            <Link href="/auth/register" className="underline">
              <p className="">Create an account</p>
            </Link>
          </footer>
        </section>
      </div>
    </main>
  );
}
