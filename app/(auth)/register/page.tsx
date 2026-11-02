"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  HardHat,
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  Wrench,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"customer" | "worker" | "contractor">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed. Please check inputs.");
        return;
      }

      // Auto login after registration
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (role === "worker") router.push("/dashboard/worker");
      else if (role === "contractor") router.push("/dashboard/contractor");
      else router.push("/dashboard");

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-ivory flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg space-y-6">
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
            Create Your Account
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Join Gujarat's leading verified industrial construction tech platform.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-white rounded-[20px] border border-sandstone p-2 shadow-luxury grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all ${
              role === "customer"
                ? "bg-espresso text-white shadow-sm"
                : "bg-transparent text-text-secondary hover:bg-ivory hover:text-espresso"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-bold leading-tight">Customer / Client</span>
            <span className="text-[10px] opacity-75">Hire & Procure</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("worker")}
            className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all ${
              role === "worker"
                ? "bg-espresso text-white shadow-sm"
                : "bg-transparent text-text-secondary hover:bg-ivory hover:text-espresso"
            }`}
          >
            <Wrench className="h-5 w-5" />
            <span className="text-xs font-bold leading-tight">Skilled Worker</span>
            <span className="text-[10px] opacity-75">Welder, Mason, etc.</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("contractor")}
            className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all ${
              role === "contractor"
                ? "bg-espresso text-white shadow-sm"
                : "bg-transparent text-text-secondary hover:bg-ivory hover:text-espresso"
            }`}
          >
            <Building2 className="h-5 w-5" />
            <span className="text-xs font-bold leading-tight">Contractor</span>
            <span className="text-[10px] opacity-75">Turnkey Agency</span>
          </button>
        </div>

        {/* Form */}
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

          <div className="p-3 rounded-xl bg-ivory border border-sandstone text-xs text-espresso flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-bronze flex-shrink-0" />
            <span>
              {role === "customer" && "Book verified tradesmen, order wholesale materials, and track site milestones."}
              {role === "worker" && "Receive daily job alerts, guaranteed living wages, and direct milestone payments."}
              {role === "contractor" && "Receive high-value commercial tenders, civil RFQs, and material supply terms."}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso mb-1.5">
              {role === "contractor" ? "Company / Representative Name *" : "Full Legal Name *"}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                required
                placeholder={role === "contractor" ? "e.g. Panchal Infrastructure Pvt Ltd" : "e.g. Rajesh Panchal"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="tel"
                  required
                  pattern="^[6-9]\d{9}$"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-sandstone bg-ivory/40 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all"
                />
              </div>
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
              Register as {role === "customer" ? "Customer" : role === "worker" ? "Skilled Worker" : "Contractor"}
            </Button>
          </div>

          <div className="text-center pt-3 border-t border-sandstone/50">
            <p className="text-xs text-text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-mocha hover:text-espresso underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
