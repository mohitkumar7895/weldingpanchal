"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  HardHat,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Building2,
  Wrench,
} from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center text-espresso text-sm">Loading session...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo accounts for 1-click test fill
  const demoAccounts = [
    {
      role: "Admin",
      email: "admin@weldingpanchal.com",
      pass: "Admin@123",
      icon: <ShieldCheck className="h-3.5 w-3.5 text-bronze" />,
      badge: "Full Ops",
    },
    {
      role: "Customer",
      email: "deepa.customer@example.com",
      pass: "Admin@123",
      icon: <User className="h-3.5 w-3.5 text-mocha" />,
      badge: "Project Owner",
    },
    {
      role: "Worker",
      email: "rajesh.welder@example.com",
      pass: "Admin@123",
      icon: <Wrench className="h-3.5 w-3.5 text-bronze" />,
      badge: "6G Welder",
    },
    {
      role: "Contractor",
      email: "vikram.contractor@example.com",
      pass: "Admin@123",
      icon: <Building2 className="h-3.5 w-3.5 text-mocha" />,
      badge: "Panchal Infra",
    },
  ];

  function fillDemo(accEmail: string, accPass: string) {
    setEmail(accEmail);
    setPassword(accPass);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        return;
      }

      // Determine redirect based on user role if no explicit redirect param
      const role = data.data?.user?.role;
      let target = redirectUrl;
      if (!target) {
        if (role === "admin") target = "/admin";
        else if (role === "worker") target = "/dashboard/worker";
        else if (role === "contractor") target = "/dashboard/contractor";
        else target = "/dashboard";
      }

      router.push(target);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-ivory flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="h-11 w-11 rounded-xl bg-espresso text-bronze flex items-center justify-center font-black text-xl shadow-luxury group-hover:scale-105 transition-transform border border-sandstone/30">
              <HardHat className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-espresso">
              WELDING<span className="text-bronze">PANCHAL</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-espresso tracking-tight">
            Account Sign In
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Access your bookings, workforce allocations, and procurement portal.
          </p>
        </div>

        {/* Demo Quick-Fill Bar */}
        <div className="bg-white rounded-[20px] border border-sandstone p-4 shadow-luxury">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-espresso uppercase tracking-wider">
              1-Click Demo Accounts
            </span>
            <span className="text-[10px] text-text-secondary">Click to autofill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => fillDemo(acc.email, acc.pass)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-sandstone bg-ivory/60 hover:bg-sandstone/40 hover:border-mocha text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {acc.icon}
                  <span className="text-xs font-semibold text-espresso truncate">
                    {acc.role}
                  </span>
                </div>
                <span className="text-[10px] text-text-secondary font-mono">
                  {acc.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[20px] border border-sandstone p-6 sm:p-8 shadow-luxury space-y-4"
        >
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-espresso">
                Password
              </label>
              <span className="text-[11px] text-text-secondary font-mono">Default: Admin@123</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-espresso"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to Account
            </Button>
          </div>

          <div className="text-center pt-3 border-t border-sandstone/50">
            <p className="text-xs text-text-secondary">
              Don't have an account yet?{" "}
              <Link href="/register" className="font-bold text-mocha hover:text-espresso underline">
                Register as Customer, Worker, or Contractor
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
