"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LayoutDashboard, ArrowRight, BarChart3, Users, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

import { loginUser } from "./actions";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginUser(formData);

      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-zinc-50 dark:bg-zinc-950 selection:bg-blue-200 dark:selection:bg-blue-900 overflow-hidden">
      {/* LEFT PANEL: Branding & Visuals (Hidden on smaller screens) */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-between p-12 overflow-hidden bg-zinc-900 border-r border-zinc-800">
        {/* Background Gradients (No Purple!) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />

        {/* Top: Logo & Title */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">VeloTrack</span>
        </div>

        {/* Middle: Content & Aesthetic Grid */}
        <div className="relative z-10 flex-grow flex flex-col justify-center mt-12 max-w-xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Sistem Manajemen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Operasional Cerdas
              </span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Pantau performa, kelola proyek, dan tingkatkan efisiensi operasional Velora dalam satu platform terintegrasi.
            </p>
          </motion.div>

          {/* Aesthetic 2x2 Grid Layout */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Grid Item 1: Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 backdrop-blur-sm group cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-zinc-100 font-medium text-lg mb-2">Real-time Analytics</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Visualisasi data instan untuk setiap keputusan strategis harian.
              </p>
            </motion.div>

            {/* Grid Item 2: Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 backdrop-blur-sm group cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-zinc-100 font-medium text-lg mb-2">Aman & Terpusat</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Manajemen data yang dikelola ketat. Hanya Anda yang memiliki hak akses.
              </p>
            </motion.div>

            {/* Grid Item 3: Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 backdrop-blur-sm group cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center mb-4 text-sky-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-zinc-100 font-medium text-lg mb-2">Kolaborasi Tim</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Ruang terpadu untuk tim dan mitra berkomunikasi dengan mulus.
              </p>
            </motion.div>

            {/* Grid Item 4: Fast/Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 backdrop-blur-sm group cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mb-4 text-teal-400 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-zinc-100 font-medium text-lg mb-2">Performa Tinggi</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Arsitektur Serverless modern yang responsif dan sangat ringan.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom: Footer Info */}
        <div className="relative z-10 flex items-center justify-between text-sm text-zinc-500 mt-auto pt-8 border-t border-zinc-800/50">
          <p>© {new Date().getFullYear()} Velora. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-300 transition-colors">Bantuan</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Privasi</a>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12">
        {/* Subtle Background Pattern for Light Mode */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none lg:hidden dark:bg-none" />

        {/* Theme Toggle (Absolute Top Right) */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile Logo Logo (visible only on small screens) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">VeloTrack</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
              Selamat datang kembali
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Silakan masuk ke akun Anda untuk melanjutkan.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1"
              >
                Alamat Email
              </label>
              <Input
                id="email"
                name="email"
                placeholder="nama@velora.id"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                required
                className="h-12 bg-white dark:bg-zinc-900/50"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Lupa password?
                </button>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                icon={<Lock className="w-4 h-4" />}
                required
                className="h-12 bg-white dark:bg-zinc-900/50"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700 transition-all font-medium text-sm rounded-xl"
              isLoading={isLoading}
            >
              Log in <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Mobile Footer Info */}
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-10 lg:hidden">
            Akses terbatas. Diawasi secara internal.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
