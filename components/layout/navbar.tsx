"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  ShieldCheck,
  PhoneCall,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  HardHat,
  ChevronDown,
  Sparkles,
  Home,
  Wrench,
  Package,
  Building2,
} from "lucide-react";
import { SessionUser } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user session
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.user) {
            setUser(json.data.user);
          }
        }
      } catch {
        // Not authenticated
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [pathname]);

  // Handle logout
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  function getDashboardRoute(role?: string) {
    if (role === "admin") return "/admin";
    if (role === "worker") return "/dashboard/worker";
    if (role === "contractor") return "/dashboard/contractor";
    return "/dashboard";
  }

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Find Workers", href: "/workers", icon: HardHat },
    { label: "Services", href: "/services", icon: Wrench },
    { label: "Materials Library", href: "/materials", icon: Package },
    { label: "Contractors", href: "/contractors", icon: Building2 },
    { label: "About", href: "/about", icon: ShieldCheck },
    { label: "Contact", href: "/contact", icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#D8D0C5] shadow-subtle">
      {/* Top micro bar for industrial hotline & trust certifications */}
      <div className="bg-[#40352E] text-[#D8D0C5] text-xs py-1.5 px-4 hidden md:block">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#F5F0E8] font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-[#A98559]" />
              Verified Construction Tradesmen, Master Welders & Contractors
            </span>
            <span className="text-[#806B59]">•</span>
            <span className="text-[#D8D0C5]">AWS D1.1, ASME & IS Standards Compliant</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1.5 text-[#F5F0E8] hover:text-[#A98559] transition-colors font-medium"
            >
              <PhoneCall className="h-3 w-3 text-[#A98559]" />
              +91 98765 43210
            </a>
            <span className="text-[#806B59]">•</span>
            <span className="text-[#D8D0C5]">Direct Mill Supply & 24/7 Breakdown Dispatch</span>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Container className="flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#806B59] to-[#40352E] flex items-center justify-center text-white shadow-sm shadow-[#40352E]/20 group-hover:scale-105 transition-all">
            <Flame className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#A98559]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-[#40352E] leading-tight">
              WELDING<span className="text-[#806B59]">PANCHAL</span>
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#77716E] font-semibold hidden xs:block">
              Earthy Construction Tech
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-semibold text-[#77716E]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all py-1 border-b-2 whitespace-nowrap ${
                  isActive
                    ? "text-[#40352E] border-[#806B59] font-bold"
                    : "border-transparent hover:text-[#40352E] hover:border-[#D8D0C5]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & User Menu (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 flex-shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#D8D0C5] bg-[#F5F0E8] hover:bg-[#ECE8E1] transition-colors text-sm font-semibold text-[#40352E]"
              >
                <div className="h-7 w-7 rounded-lg bg-[#806B59] text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-[#806B59] border border-[#D8D0C5]">
                  {user.role}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#77716E]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-luxury-hover border border-[#D8D0C5] py-2 z-50 animate-in fade-in duration-100 overflow-hidden">
                  <div className="px-4 py-2 border-b border-[#D8D0C5]/40 bg-[#F5F0E8]/50">
                    <p className="text-[11px] text-[#77716E]">Signed in as</p>
                    <p className="text-xs font-bold text-[#40352E] truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#40352E] hover:bg-[#F5F0E8] hover:text-[#806B59] transition-colors"
                  >
                    <Home className="h-4 w-4 text-[#806B59]" />
                    <span>Home Page</span>
                  </Link>

                  <Link
                    href={getDashboardRoute(user.role)}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#40352E] hover:bg-[#F5F0E8] hover:text-[#806B59] transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#806B59]" />
                    <span>
                      {user.role === "admin"
                        ? "Admin Console"
                        : user.role === "worker"
                        ? "Worker Dashboard"
                        : user.role === "contractor"
                        ? "Contractor Dashboard"
                        : "Customer Dashboard"}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors border-t border-[#D8D0C5]/40 mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}

          <Link href="/workers">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<HardHat className="h-3.5 w-3.5" />}
            >
              Hire a Worker
            </Button>
          </Link>
        </div>

        {/* Mobile & Tablet menu trigger (Visible on all screens below lg) */}
        <div className="flex lg:hidden items-center gap-2">
          {user ? (
            <Link
              href={getDashboardRoute(user.role)}
              className="h-9 w-9 rounded-xl bg-[#806B59] text-white flex items-center justify-center font-bold text-xs"
              title="Dashboard"
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#40352E] hover:bg-[#F5F0E8] transition-colors border border-[#D8D0C5]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile & Tablet Drawer (Full responsiveness for all viewports below lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D8D0C5] bg-[#F5F0E8] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-luxury">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-[#806B59] text-white font-bold"
                      : "text-[#40352E] hover:bg-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#806B59]"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#D8D0C5] space-y-2">
            <Link
              href="/workers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#806B59] hover:bg-[#6C5A4B] text-white text-sm font-bold shadow-sm min-h-[44px]"
            >
              <HardHat className="h-4 w-4 text-[#A98559]" />
              Hire a Skilled Worker
            </Link>

            {user ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardRoute(user.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#40352E] text-white text-sm font-bold min-h-[44px]"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#A98559]" />
                  Dashboard Console ({user.role})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-red-700 text-xs font-bold min-h-[44px]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-[#40352E] text-xs font-bold min-h-[44px]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-[#40352E] text-white text-xs font-bold min-h-[44px]"
                >
                  Register
                </Link>
              </div>
            )}

            <div className="pt-2 text-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-1.5 text-xs text-[#77716E] hover:text-[#40352E] font-medium"
              >
                <PhoneCall className="h-3.5 w-3.5 text-[#A98559]" />
                Direct Helpline: +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
