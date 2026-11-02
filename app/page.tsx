import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/heading";
import {
  AnimatedWordHeading,
  AnimatedSectionHeader,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated";
import { HeroSearch } from "@/components/home/hero-search";
import { query } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  Flame,
  Hammer,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Building2,
  Axe,
  Zap,
  Pipette,
  Paintbrush,
  Boxes,
  Package,
  Layers,
  Sparkles,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real data from MySQL database
  let workers: any[] = [];
  let contractors: any[] = [];
  let services: any[] = [];
  let materials: any[] = [];
  let reviews: any[] = [];

  try {
    // 1. Fetch featured workers
    workers = await query(
      `SELECT wp.*, u.name AS worker_name, u.avatar_url AS worker_avatar
       FROM worker_profiles wp
       JOIN users u ON u.id = wp.user_id
       WHERE wp.availability_status = 'available' AND u.is_active = 1
       ORDER BY wp.rating_avg DESC
       LIMIT 4`
    );

    // 2. Fetch featured contractors
    contractors = await query(
      `SELECT cp.*, u.name AS owner_name
       FROM contractor_profiles cp
       JOIN users u ON u.id = cp.user_id
       WHERE cp.verification_status = 'verified' AND u.is_active = 1
       ORDER BY cp.rating_avg DESC
       LIMIT 3`
    );

    // 3. Fetch construction services
    services = await query(
      `SELECT s.*, c.name AS category_name
       FROM services s
       JOIN categories c ON c.id = s.category_id
       WHERE s.is_active = 1
       ORDER BY s.display_order ASC
       LIMIT 6`
    );

    // 4. Fetch materials
    materials = await query(
      `SELECT m.*, c.name AS category_name
       FROM materials m
       JOIN categories c ON c.id = m.category_id
       WHERE m.is_active = 1
       ORDER BY m.is_in_stock DESC, m.created_at DESC
       LIMIT 4`
    );

    // 5. Fetch verified customer reviews
    reviews = await query(
      `SELECT r.*, u.name AS reviewer_name, u.avatar_url AS reviewer_avatar, s.title AS service_title
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       LEFT JOIN services s ON s.id = r.service_id
       WHERE r.is_verified_purchase = 1
       ORDER BY r.created_at DESC
       LIMIT 3`
    );
  } catch (err) {
    console.error("Database query error on homepage:", err);
  }

  // 10 Curated categories with verified local imagery
  const categories = [
    {
      title: "Master Welder",
      slug: "welder",
      desc: "TIG, MIG & structural 6G certified welders",
      image: "/images/category-welder.jpg",
      icon: Flame,
      count: "Active Pros",
    },
    {
      title: "Brick Mason",
      slug: "mason",
      desc: "Precision brickwork, AAC block laying & plastering",
      image: "/images/category-mason.jpg",
      icon: Hammer,
      count: "Active Pros",
    },
    {
      title: "Architectural Carpenter",
      slug: "carpenter",
      desc: "Structural formwork, shuttering & fine interior woodcraft",
      image: "/images/category-carpenter.jpg",
      icon: Axe,
      count: "Active Pros",
    },
    {
      title: "Licensed Electrician",
      slug: "electrician",
      desc: "Industrial wiring, 3-phase panels & HT/LT distribution",
      image: "/images/category-electrician.jpg",
      icon: Zap,
      count: "Active Pros",
    },
    {
      title: "Industrial Plumber",
      slug: "plumber",
      desc: "Pressure piping, drainage, CPVC & fire sprinkler lines",
      image: "/images/category-plumber.jpg",
      icon: Pipette,
      count: "Active Pros",
    },
    {
      title: "Finishing Painter",
      slug: "painter",
      desc: "Epoxy flooring, industrial anti-rust & texture finishes",
      image: "/images/category-painter.jpg",
      icon: Paintbrush,
      count: "Active Pros",
    },
    {
      title: "Site Labour & Riggers",
      slug: "labour",
      desc: "Experienced excavation, concrete pouring & site logistics",
      image: "/images/category-labour.jpg",
      icon: HardHat,
      count: "Available Now",
    },
    {
      title: "Tile & Marble Craftsman",
      slug: "tile-installer",
      desc: "Large format porcelain, Italian marble & granite fixing",
      image: "/images/category-tile.jpg",
      icon: Layers,
      count: "Active Pros",
    },
    {
      title: "Turnkey Contractors",
      slug: "contractors",
      desc: "Licensed commercial & residential civil engineering firms",
      image: "/images/category-contractor.jpg",
      icon: Building2,
      count: "Registered Firms",
    },
    {
      title: "Building Materials",
      slug: "materials",
      desc: "Wholesale TMT rebar, structural steel, cement & aggregates",
      image: "/images/material-steel.jpg",
      icon: Boxes,
      count: "Direct Mill Pricing",
    },
  ];

  return (
    <div className="bg-[#F5F0E8] min-h-screen text-[#292522]">
      {/* 1. HERO SECTION: Cinematic Split Layout */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-20 overflow-hidden border-b border-[#D8D0C5]/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal delay={0.05}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D8D0C5] text-xs font-bold text-[#A98559] shadow-subtle">
                  <Sparkles className="h-3.5 w-3.5 text-[#A98559]" />
                  <span>EARTHY CONSTRUCTION LUXURY • AWS & IS 9001 VERIFIED</span>
                </div>
              </ScrollReveal>

              <AnimatedWordHeading
                text="Build Better. Hire Smarter."
                as="h1"
                highlightWords={["Hire", "Smarter."]}
                highlightClassName="text-[#806B59]"
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#40352E] leading-[1.12]"
              />

              <ScrollReveal delay={0.12}>
                <p className="text-base sm:text-lg text-[#77716E] leading-relaxed max-w-xl">
                  Find skilled building workers, trusted contractors, quality construction materials, and reliable services — all in one place.
                </p>
              </ScrollReveal>

              {/* Multi-Tab Luxury Hero Search */}
              <ScrollReveal delay={0.2} className="pt-2">
                <HeroSearch />
              </ScrollReveal>

              {/* Trust Indicators */}
              <ScrollReveal delay={0.28} className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-[#77716E]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#FFFFFF] border border-[#D8D0C5] flex items-center justify-center text-[#A98559]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>100% Aadhaar & Skill Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#FFFFFF] border border-[#D8D0C5] flex items-center justify-center text-[#806B59]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>Escrow Milestone Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#FFFFFF] border border-[#D8D0C5] flex items-center justify-center text-[#A98559]">
                    <Award className="h-4 w-4" />
                  </div>
                  <span>Standardized Living Daily Wages</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Cinematic Construction Photograph (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal delay={0.18} yOffset={28}>
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Clean 24px Rounded Hero Image Container without floating cards */}
                  <div className="relative h-[320px] sm:h-[440px] lg:h-[500px] w-full rounded-[24px] overflow-hidden border-2 border-[#D8D0C5] shadow-luxury bg-[#40352E]">
                    <Image
                      src="/images/hero-construction.jpg"
                      alt="Indian construction workers on active building site"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      priority
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#40352E]/90 via-[#40352E]/20 to-transparent" />

                    {/* Photo Caption Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#A98559] block mb-1">
                        ON-SITE PRECISION
                      </span>
                      <h3 className="text-lg font-bold leading-snug">
                        Master craftsmen at work on commercial high-rise projects in Gujarat.
                      </h3>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. CATEGORY EXPLORER: 10 Image-Based Cards */}
      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            badge="Construction Trades"
            title="Explore 10 Specialized Building Crafts"
            description="From structural welders to precision brick masons and turnkey civil contractors, book verified trade specialists with guaranteed on-site safety gear."
            align="center"
          />

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <StaggerItem key={cat.slug}>
                  <Link
                    href={
                      cat.slug === "contractors"
                        ? "/contractors"
                        : cat.slug === "materials"
                        ? "/materials"
                        : `/workers?skill=${cat.title.split(" ")[1] || cat.title}`
                    }
                    className="group relative h-64 rounded-[20px] overflow-hidden border border-[#D8D0C5] shadow-card hover:shadow-luxury-hover hover:border-[#806B59] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-end p-5 bg-[#40352E] block"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#40352E] via-[#40352E]/50 to-transparent" />

                    <div className="relative z-10 space-y-1">
                      <div className="h-8 w-8 rounded-lg bg-[#FFFFFF]/90 backdrop-blur-sm text-[#40352E] flex items-center justify-center mb-2 shadow-sm">
                        <Icon className="h-4 w-4 text-[#A98559]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#A98559] uppercase tracking-wider block">
                        {cat.count}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#F5F0E8] transition-colors leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] text-[#D8D0C5] line-clamp-1">
                        {cat.desc}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* 3. FEATURED WORKERS: Real MySQL Profiles */}
      <section className="py-16 lg:py-20 bg-[#FFFFFF] border-y border-[#D8D0C5]">
        <Container>
          <AnimatedSectionHeader
            badge="Verified Workforce"
            title="Featured Skilled Tradesmen"
            description="Aadhaar-verified master craftsmen with proven on-site safety track records."
            action={
              <Link href="/workers">
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View All Workers
                </Button>
              </Link>
            }
          />

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workers.map((w, idx) => {
              const fallbackAvatar = `/images/worker-avatar-${(idx % 4) + 1}.jpg`;
              return (
                <StaggerItem key={w.id}>
                  <div className="rounded-[20px] border border-[#D8D0C5] bg-[#FFFFFF] hover:border-[#806B59] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card h-full">
                    <div className="p-5">
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-[#F5F0E8] border border-[#D8D0C5] flex-shrink-0">
                          <Image
                            src={w.worker_avatar || fallbackAvatar}
                            alt={w.worker_name || "Worker"}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-[#40352E] text-sm truncate">
                              {w.worker_name}
                            </h4>
                            {w.verification_status === "verified" && (
                              <span title="Verified Worker">
                                <ShieldCheck className="h-3.5 w-3.5 text-[#A98559] flex-shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#806B59] line-clamp-1 mt-0.5">
                            {w.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-[#292522]">
                            <Star className="h-3.5 w-3.5 text-[#A98559] fill-[#A98559]" />
                            <span className="font-bold">{Number(w.rating_avg).toFixed(1)}</span>
                            <span className="text-[#77716E]">({w.total_reviews})</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-[#77716E] pt-3 border-t border-[#D8D0C5]/40">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#A98559]" />
                            {w.city}, Gujarat
                          </span>
                          <span className="font-semibold text-[#40352E]">
                            {w.experience_years} yrs exp
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F5F0E8] px-5 py-3 border-t border-[#D8D0C5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#77716E] block">
                          Daily Wage
                        </span>
                        <span className="text-sm font-bold text-[#40352E]">
                          {w.daily_rate ? formatCurrency(w.daily_rate) : "Standard"}
                          <span className="text-[10px] font-normal text-[#77716E]"> / shift</span>
                        </span>
                      </div>

                      <Link href={`/workers/${w.id}`}>
                        <Button variant="primary" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* 4. SERVICES CATALOG SECTION */}
      <section className="py-16 lg:py-20">
        <Container>
          <AnimatedSectionHeader
            badge="Turnkey Capabilities"
            title="Standardized Construction Services"
            description="Turnkey civil, welding, and mechanical services backed by our 30-day workmanship assurance."
            action={
              <Link href="/services">
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore All Services
                </Button>
              </Link>
            }
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <StaggerItem key={svc.id}>
                <div className="rounded-[20px] border border-[#D8D0C5] bg-[#FFFFFF] hover:border-[#806B59] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card h-full">
                  <div>
                    <div className="relative h-44 w-full bg-[#40352E] overflow-hidden">
                      <Image
                        src={svc.image_url || "/images/hero-construction.jpg"}
                        alt={svc.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#40352E]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm">
                        {svc.category_name}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-[#40352E] text-base line-clamp-1">
                        {svc.title}
                      </h3>
                      <p className="text-xs text-[#77716E] line-clamp-2 leading-relaxed">
                        {svc.short_description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F5F0E8] px-5 py-3.5 border-t border-[#D8D0C5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#77716E] block">
                        Base Rate
                      </span>
                      <span className="text-sm font-bold text-[#40352E]">
                        {svc.base_price ? formatCurrency(svc.base_price) : "Quote Basis"}
                        {svc.price_unit ? ` / ${svc.price_unit}` : ""}
                      </span>
                    </div>

                    <Link href={`/services/${svc.slug}`}>
                      <Button variant="primary" size="sm">
                        Book Service
                      </Button>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* 5. MATERIALS LIBRARY SECTION */}
      <section className="py-16 lg:py-20 bg-[#EAE5DE] border-y border-[#D8D0C5]">
        <Container>
          <AnimatedSectionHeader
            badge="Factory Direct"
            title="Wholesale Building Materials"
            description="Source IS-certified structural steel, cement, bricks, and consumables at ex-mill trade pricing."
            action={
              <Link href="/materials">
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Browse Materials
                </Button>
              </Link>
            }
          />

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((mat) => (
              <StaggerItem key={mat.id}>
                <div className="rounded-[20px] border border-[#D8D0C5] bg-[#FFFFFF] hover:border-[#806B59] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card h-full">
                  <div>
                    <div className="relative h-44 w-full bg-[#40352E] overflow-hidden">
                      <Image
                        src={mat.image_url || "/images/material-steel.jpg"}
                        alt={mat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#40352E]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        {mat.brand || "Industrial"}
                      </div>
                    </div>

                    <div className="p-5 space-y-1.5">
                      <span className="text-[11px] font-mono text-[#77716E]">
                        SKU: {mat.sku}
                      </span>
                      <h3 className="font-bold text-[#40352E] text-sm line-clamp-1">
                        {mat.name}
                      </h3>
                      <p className="text-xs text-[#77716E]">
                        Min. Order: {mat.min_order_quantity} {mat.unit}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F5F0E8] px-5 py-3 border-t border-[#D8D0C5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#77716E] block">
                        Trade Price
                      </span>
                      <span className="text-sm font-bold text-[#40352E]">
                        {formatCurrency(mat.price_per_unit)} / {mat.unit}
                      </span>
                    </div>

                    <Link href={`/materials/${mat.sku}`}>
                      <Button variant="primary" size="sm">
                        Inquire
                      </Button>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* 6. FEATURED CONTRACTORS */}
      <section className="py-16 lg:py-20">
        <Container>
          <AnimatedSectionHeader
            badge="General Contractors"
            title="Verified Turnkey Contractor Agencies"
            description="Partner with licensed engineering firms and general contracting agencies across Gujarat."
            action={
              <Link href="/contractors">
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View All Contractors
                </Button>
              </Link>
            }
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contractors.map((c) => (
              <StaggerItem key={c.id}>
                <div className="rounded-[20px] border border-[#D8D0C5] bg-[#FFFFFF] p-6 hover:border-[#806B59] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-card h-full">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-[#F5F0E8] text-[#806B59] flex items-center justify-center border border-[#D8D0C5]">
                        <Building2 className="h-6 w-6 text-[#A98559]" />
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F7F2EA] text-[#A98559] border border-[#D8C7B0]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    </div>

                    <h3 className="font-bold text-[#40352E] text-base mb-1">
                      {c.company_name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#77716E] mb-3">
                      <MapPin className="h-3.5 w-3.5 text-[#A98559]" />
                      <span>{c.city}, Gujarat</span>
                      <span>•</span>
                      <span>{c.team_size} Site Crew</span>
                    </div>

                    <p className="text-xs text-[#77716E] line-clamp-3 leading-relaxed">
                      {c.description || "Turnkey commercial civil contracting, structural engineering, and PEB industrial structures."}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#D8D0C5]/40 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 text-[#A98559] fill-[#A98559]" />
                      <span className="font-bold text-[#40352E]">{Number(c.rating_avg).toFixed(1)}</span>
                      <span className="text-[#77716E]">({c.total_reviews} reviews)</span>
                    </div>

                    <Link href={`/contractors/${c.id}`}>
                      <Button variant="primary" size="sm">
                        Request RFQ
                      </Button>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* 7. HOW IT WORKS: 3 Clear Steps */}
      <section className="py-16 lg:py-20 bg-[#FFFFFF] border-t border-[#D8D0C5]">
        <Container>
          <SectionHeading
            badge="Process & Transparency"
            title="How WeldingPanchal Works"
            description="Transparent, reliable, and milestone-backed workflow for project owners, tradesmen, and contractors."
            align="center"
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="rounded-[20px] border border-[#D8D0C5] bg-[#F5F0E8] p-8 space-y-4 h-full">
                <span className="text-4xl font-black text-[#A98559]/40 block">01</span>
                <h3 className="text-xl font-bold text-[#40352E]">Choose Craft or Material</h3>
                <p className="text-xs text-[#77716E] leading-relaxed">
                  Filter verified tradesmen by trade, city, experience, and daily wage rate, or order certified materials delivered directly to your job site.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-[20px] border border-[#D8D0C5] bg-[#F5F0E8] p-8 space-y-4 h-full">
                <span className="text-4xl font-black text-[#A98559]/40 block">02</span>
                <h3 className="text-xl font-bold text-[#40352E]">Mobilize with Escrow</h3>
                <p className="text-xs text-[#77716E] leading-relaxed">
                  Workers and contractors arrive on site with mandatory safety gear. Project funds remain safely protected in milestone escrow.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-[20px] border border-[#D8D0C5] bg-[#F5F0E8] p-8 space-y-4 h-full">
                <span className="text-4xl font-black text-[#A98559]/40 block">03</span>
                <h3 className="text-xl font-bold text-[#40352E]">Inspect & Sign Off</h3>
                <p className="text-xs text-[#77716E] leading-relaxed">
                  Verify craftsmanship, approve completed milestones, and submit authentic ratings to keep India's construction workforce accountable.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      {reviews.length > 0 && (
        <section className="py-16 lg:py-20 bg-[#EAE5DE] border-t border-[#D8D0C5]">
          <Container>
            <SectionHeading
              badge="Client Testimonials"
              title="Verified Project Feedback"
              description="Authentic reviews submitted by commercial developers and residential project owners."
              align="center"
            />

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <StaggerItem key={r.id}>
                  <div className="rounded-[20px] border border-[#D8D0C5] bg-[#FFFFFF] p-6 shadow-card space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < r.rating ? "text-[#A98559] fill-[#A98559]" : "text-[#D8D0C5]"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-[#292522] italic leading-relaxed">
                        "{r.review_text}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D8D0C5]/40 flex items-center justify-between text-xs text-[#77716E]">
                      <span className="font-bold text-[#40352E]">{r.reviewer_name}</span>
                      <span>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* 9. FINAL LUXURY CTA BANNER: Espresso Brown & Antique Bronze */}
      <section className="py-16 sm:py-20 bg-[#40352E] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <ScrollReveal delay={0.05}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B241F] border border-[#806B59] text-xs font-bold text-[#A98559]">
                <Sparkles className="h-3.5 w-3.5" />
                START YOUR PROJECT TODAY
              </span>
            </ScrollReveal>

            <AnimatedWordHeading
              text="Ready to Build with Master Craftsmen & Direct Materials?"
              as="h2"
              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white justify-center"
            />

            <ScrollReveal delay={0.15}>
              <p className="text-base text-[#D8D0C5] max-w-xl mx-auto">
                Join thousands of developers, factory managers, and residential owners across Gujarat who rely on WeldingPanchal for on-site excellence.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.22}>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link href="/workers" className="w-full sm:w-auto">
                  <Button variant="bronze" size="lg" className="w-full sm:w-auto">
                    Hire a Skilled Worker
                  </Button>
                </Link>
                <Link href="/contractors" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Request Contractor RFQ
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
