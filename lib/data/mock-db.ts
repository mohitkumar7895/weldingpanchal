/**
 * Fallback Mock Database Data
 * Used seamlessly when MySQL is offline (e.g. initial Vercel deploy before cloud DB is configured).
 */

export interface MockWorker {
  id: number;
  user_id: number;
  title: string;
  experience_years: number;
  hourly_rate: number;
  daily_rate: number;
  city: string;
  state: string;
  availability_status: string;
  verification_status: string;
  rating_avg: number;
  total_reviews: number;
  bio: string;
  worker_name: string;
  worker_email: string;
  worker_phone: string;
  worker_avatar: string;
}

export interface MockContractor {
  id: number;
  user_id: number;
  company_name: string;
  registration_number: string;
  experience_years: number;
  established_year: number;
  team_size: number;
  city: string;
  state: string;
  website: string;
  verification_status: string;
  rating_avg: number;
  total_reviews: number;
  description: string;
  contractor_name: string;
  owner_name: string;
  contractor_email: string;
  contractor_phone: string;
}

export interface MockService {
  id: number;
  category_id: number;
  category_name: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  base_price: number;
  price_unit: string;
  icon: string;
  image_url: string;
  is_active: number;
  display_order: number;
}

export interface MockMaterial {
  id: number;
  category_id: number;
  category_name: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  price_per_unit: number;
  unit: string;
  min_order_quantity: number;
  stock_quantity: number;
  image_url: string;
  is_in_stock: number;
  is_active: number;
}

export interface MockCategory {
  id: number;
  type: "service" | "material";
  name: string;
  slug: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: number;
}

export interface MockReview {
  id: number;
  reviewer_id: number;
  reviewer_name: string;
  reviewer_avatar: string;
  rating: number;
  review_text: string;
  created_at: string;
  is_verified_purchase: number;
  service_id?: number;
  service_title?: string;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: 1, type: "service", name: "Welding & Metal Fabrication", slug: "welding-fabrication", description: "TIG, MIG, arc welding, pressure piping, and structural fabrication.", icon: "Flame", display_order: 1, is_active: 1 },
  { id: 2, type: "service", name: "Civil Construction & Masonry", slug: "civil-masonry", description: "Brickwork, stone masonry, foundation casting, and RCC structural slabs.", icon: "Building2", display_order: 2, is_active: 1 },
  { id: 3, type: "service", name: "Carpentry & Formwork", slug: "carpentry-formwork", description: "Structural shuttering, wooden framework, doors, and designer cabinetry.", icon: "Axe", display_order: 3, is_active: 1 },
  { id: 4, type: "service", name: "Electrical Works", slug: "electrical-works", description: "Industrial 3-phase wiring, transformer setup, panels, and conduit laying.", icon: "Zap", display_order: 4, is_active: 1 },
  { id: 5, type: "service", name: "Plumbing & Drainage", slug: "plumbing-drainage", description: "Commercial piping, sanitaryware, water filtration, and pump fitting.", icon: "Pipette", display_order: 5, is_active: 1 },
  { id: 6, type: "service", name: "Painting & Waterproofing", slug: "painting-waterproofing", description: "Exterior weather-proof coating, interior emulsion, and roof waterproofing.", icon: "Paintbrush", display_order: 6, is_active: 1 },
  { id: 7, type: "service", name: "Flooring & Tile Installation", slug: "flooring-tiling", description: "Vitrified tiles, Italian marble, granite polishing, and epoxy flooring.", icon: "Layers", display_order: 7, is_active: 1 },
  { id: 8, type: "service", name: "Labour Contracting & Mobilization", slug: "labour-contracting", description: "Certified gang mobilization of beldars, helpers, and skilled tradesmen.", icon: "HardHat", display_order: 8, is_active: 1 },
  { id: 9, type: "material", name: "Cement & Aggregates", slug: "cement-aggregates", description: "OPC, PPC, slag cement, river sand, and washed aggregates.", icon: "Package", display_order: 1, is_active: 1 },
  { id: 10, type: "material", name: "Steel & TMT Rebars", slug: "steel-tmt-bars", description: "Fe 550D TMT rebars, structural channels, I-beams, and mild steel plates.", icon: "Layers", display_order: 2, is_active: 1 },
  { id: 11, type: "material", name: "Bricks & AAC Blocks", slug: "bricks-blocks", description: "Fly-ash bricks, red clay bricks, and lightweight AAC blocks.", icon: "Boxes", display_order: 3, is_active: 1 },
  { id: 12, type: "material", name: "Tiles & Stone Flooring", slug: "tiles-flooring", description: "Vitrified tiles, glazed porcelain, granite slabs, and tile adhesive.", icon: "Grid", display_order: 4, is_active: 1 },
  { id: 13, type: "material", name: "Paints & Exterior Finishes", slug: "paints-finishes", description: "Primer, waterproof exterior coats, putty, and epoxy resin.", icon: "Droplet", display_order: 5, is_active: 1 },
  { id: 14, type: "material", name: "Electrical Supplies", slug: "electrical-supplies", description: "Copper cables, distribution boards, MCBs, and PVC conduits.", icon: "Cpu", display_order: 6, is_active: 1 },
  { id: 15, type: "material", name: "Plumbing Supplies", slug: "plumbing-supplies", description: "CPVC, UPVC pipes, brass fittings, and water storage tanks.", icon: "Wrench", display_order: 7, is_active: 1 },
  { id: 16, type: "material", name: "Welding Consumables & Gases", slug: "welding-consumables-gases", description: "Electrodes, MIG wires, argon gas, and shielding consumables.", icon: "Sparkles", display_order: 8, is_active: 1 }
];

export const MOCK_WORKERS: MockWorker[] = [
  {
    id: 1,
    user_id: 2,
    title: "Senior 6G Pipe & Pressure Vessel Welder",
    experience_years: 9,
    hourly_rate: 450,
    daily_rate: 3200,
    city: "Ahmedabad",
    state: "Gujarat",
    availability_status: "available",
    verification_status: "verified",
    rating_avg: 4.95,
    total_reviews: 38,
    bio: "AWS CWI certified 6G pipe specialist with deep expertise in steam lines, ASME Section IX vessels, and stainless steel sanitary tubes.",
    worker_name: "Rajesh Sharma",
    worker_email: "rajesh.welder@example.com",
    worker_phone: "9876543211",
    worker_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  },
  {
    id: 2,
    user_id: 3,
    title: "Heavy Structural Steel Fitter & Fabricator",
    experience_years: 12,
    hourly_rate: 380,
    daily_rate: 2800,
    city: "Vadodara",
    state: "Gujarat",
    availability_status: "available",
    verification_status: "verified",
    rating_avg: 4.88,
    total_reviews: 52,
    bio: "Lead structural fitter specializing in heavy factory PEB erection, crane arm alignment, submerged arc welding, and I-beam assemblies.",
    worker_name: "Manoj Panchal",
    worker_email: "manoj.panchal@example.com",
    worker_phone: "9876543212",
    worker_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    user_id: 4,
    title: "Master Civil Mason & Bricklayer",
    experience_years: 14,
    hourly_rate: 300,
    daily_rate: 2200,
    city: "Surat",
    state: "Gujarat",
    availability_status: "available",
    verification_status: "verified",
    rating_avg: 4.92,
    total_reviews: 45,
    bio: "Expert in RCC foundation footing, precision fly-ash/red brickwork, exterior stone cladding, and plaster line alignment.",
    worker_name: "Ramesh Prajapati",
    worker_email: "ramesh.mason@example.com",
    worker_phone: "9876543213",
    worker_avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop"
  },
  {
    id: 4,
    user_id: 5,
    title: "Master Shuttering & Finishing Carpenter",
    experience_years: 11,
    hourly_rate: 350,
    daily_rate: 2500,
    city: "Ahmedabad",
    state: "Gujarat",
    availability_status: "available",
    verification_status: "verified",
    rating_avg: 4.85,
    total_reviews: 34,
    bio: "Specialized in formwork shuttering for multi-storey concrete slabs, plywood paneling, teakwood frames, and modular kitchen installations.",
    worker_name: "Dinesh Suthar",
    worker_email: "dinesh.carpenter@example.com",
    worker_phone: "9876543214",
    worker_avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop"
  },
  {
    id: 5,
    user_id: 6,
    title: "Licensed Industrial & Residential Electrician",
    experience_years: 10,
    hourly_rate: 320,
    daily_rate: 2400,
    city: "Gandhinagar",
    state: "Gujarat",
    availability_status: "available",
    verification_status: "verified",
    rating_avg: 4.90,
    total_reviews: 41,
    bio: "Certified Wireman with extensive experience in 3-phase industrial panel board wiring, circuit breaker routing, and smart home automation.",
    worker_name: "Jignesh Patel",
    worker_email: "jignesh.electrician@example.com",
    worker_phone: "9876543215",
    worker_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
  },
  {
    id: 6,
    user_id: 7,
    title: "Commercial Plumbing & Firefighting Specialist",
    experience_years: 8,
    hourly_rate: 280,
    daily_rate: 2100,
    city: "Rajkot",
    state: "Gujarat",
    availability_status: "available",
    verification_status: "verified",
    rating_avg: 4.78,
    total_reviews: 29,
    bio: "Skilled in high-pressure CPVC loops, underground sewage drainage lines, overhead hydro-pneumatic pressure pumps, and firefighting risers.",
    worker_name: "Vinod Parmar",
    worker_email: "vinod.plumber@example.com",
    worker_phone: "9876543216",
    worker_avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
  },
  {
    id: 7,
    user_id: 8,
    title: "Commercial Spray Painter & Texture Artisan",
    experience_years: 7,
    hourly_rate: 260,
    daily_rate: 1900,
    city: "Ahmedabad",
    state: "Gujarat",
    availability_status: "available",
    verification_status: "verified",
    rating_avg: 4.82,
    total_reviews: 31,
    bio: "Professional in mechanized airless spray painting, PU exterior waterproofing membranes, rustic wall textures, and anti-corrosion primer.",
    worker_name: "Sanjay Rathod",
    worker_email: "sanjay.painter@example.com",
    worker_phone: "9876543217",
    worker_avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop"
  },
  {
    id: 8,
    user_id: 9,
    title: "Vitrified Tile & Italian Marble Installer",
    experience_years: 9,
    hourly_rate: 340,
    daily_rate: 2400,
    city: "Surat",
    state: "Gujarat",
    availability_status: "available",
    verification_status: "verified",
    rating_avg: 4.89,
    total_reviews: 36,
    bio: "Flawless laser-aligned laying of large format (1200x1800mm) porcelain slabs, epoxy grouting, diamond marble crystallization, and granite stairs.",
    worker_name: "Mukesh Chavda",
    worker_email: "mukesh.tiles@example.com",
    worker_phone: "9876543218",
    worker_avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop"
  }
];

export const MOCK_CONTRACTORS: MockContractor[] = [
  {
    id: 1,
    user_id: 10,
    company_name: "Apex Heavy Fabrication & Engineering Works",
    registration_number: "24AAACA1234A1Z5",
    experience_years: 15,
    established_year: 2009,
    team_size: 65,
    city: "Ahmedabad",
    state: "Gujarat",
    website: "https://apexheavyfab.example.com",
    verification_status: "verified",
    rating_avg: 4.94,
    total_reviews: 78,
    description: "Class-A turnkey structural fabrication contractor executing complete industrial plant sheds, PEB warehouses, heavy overhead cranes, and pipeline grids.",
    contractor_name: "Vikram Singh",
    owner_name: "Vikram Singh",
    contractor_email: "vikram.contractor@example.com",
    contractor_phone: "9876543219"
  },
  {
    id: 2,
    user_id: 11,
    company_name: "Panchal Industrial Steel & Canopy Solutions",
    registration_number: "24AAACP5678B1Z2",
    experience_years: 11,
    established_year: 2013,
    team_size: 35,
    city: "Surat",
    state: "Gujarat",
    website: "https://panchalsteel.example.com",
    verification_status: "verified",
    rating_avg: 4.86,
    total_reviews: 52,
    description: "Turnkey metal design and construction firm providing cantilevered skylight canopies, motorized sliding gates, catwalks, and stainless architectural facades.",
    contractor_name: "Suresh Patel",
    owner_name: "Suresh Patel",
    contractor_email: "suresh.fabrication@example.com",
    contractor_phone: "9876543220"
  },
  {
    id: 3,
    user_id: 12,
    company_name: "Solanki Turnkey Civil Infrastructure & Builders",
    registration_number: "24AAACS9988D1Z9",
    experience_years: 18,
    established_year: 2006,
    team_size: 120,
    city: "Ahmedabad",
    state: "Gujarat",
    website: "https://solankibuilders.example.com",
    verification_status: "verified",
    rating_avg: 4.91,
    total_reviews: 94,
    description: "Full-scale civil construction contractor specialized in multi-storey residential complexes, industrial factory foundations, RCC framing, and fast-track renovation.",
    contractor_name: "Bharat Solanki",
    owner_name: "Bharat Solanki",
    contractor_email: "bharat.civil@example.com",
    contractor_phone: "9876543221"
  }
];

export const MOCK_SERVICES: MockService[] = [
  {
    id: 1,
    category_id: 1,
    category_name: "Welding & Metal Fabrication",
    title: "TIG & MIG Precision Pipe Welding",
    slug: "tig-mig-precision-welding",
    short_description: "Aerospace and pharmaceutical tolerance gas tungsten arc joining with 100% radiographic compliance.",
    full_description: "Engineered for steam loops, chemical transport lines, food processing vessels, and thin gauge exotic alloys with internal argon purging and zero-porosity radiographic certification.",
    base_price: 1500,
    price_unit: "per joint",
    icon: "Flame",
    image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&fit=crop",
    is_active: 1,
    display_order: 1
  },
  {
    id: 2,
    category_id: 1,
    category_name: "Welding & Metal Fabrication",
    title: "Turnkey Heavy Structural Steel Fabrication",
    slug: "structural-steel-fabrication",
    short_description: "Turnkey fabrication and on-site erection of factory PEB sheds, I-beams, and columns.",
    full_description: "From structural engineering drawings to automated plasma cutting, beam profiling, precision fit-up, and field erection conforming to IS 800. Equipped with heavy mobile cranes and ultrasonic weld inspection.",
    base_price: 5000,
    price_unit: "per ton",
    icon: "Hammer",
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&fit=crop",
    is_active: 1,
    display_order: 2
  },
  {
    id: 3,
    category_id: 2,
    category_name: "Civil Construction & Masonry",
    title: "Turnkey Home & Civil Construction",
    slug: "turnkey-home-construction",
    short_description: "Complete civil construction from soil excavation to concrete framing and brick masonry.",
    full_description: "Comprehensive turnkey home and commercial building execution. Includes soil testing, PCC/RCC footings, column reinforcement, brickwork, roof slab casting, and exterior plastering managed by licensed civil engineers.",
    base_price: 1800,
    price_unit: "per sq ft",
    icon: "Building2",
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800&fit=crop",
    is_active: 1,
    display_order: 3
  },
  {
    id: 4,
    category_id: 3,
    category_name: "Carpentry & Formwork",
    title: "Architectural Woodwork & Formwork Shuttering",
    slug: "architectural-woodwork-shuttering",
    short_description: "High-grade plywood shuttering, aluminum formwork, and bespoke teakwood interiors.",
    full_description: "Heavy structural formwork design for waterproof concrete slabs alongside premium interior woodwork, solid wood doors, and acoustic wooden wall paneling.",
    base_price: 250,
    price_unit: "per sq ft",
    icon: "Axe",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&fit=crop",
    is_active: 1,
    display_order: 4
  },
  {
    id: 5,
    category_id: 4,
    category_name: "Electrical Works",
    title: "Industrial 3-Phase HT/LT Electrical Wiring",
    slug: "industrial-electrical-wiring",
    short_description: "Certified industrial electrification, distribution panels, and high-load cabling.",
    full_description: "Government licensed A-class electrical installations including 11KV substation transformers, synchronized diesel generator switchgear, busbar trunking, and earthing pit testing.",
    base_price: 3500,
    price_unit: "per circuit",
    icon: "Zap",
    image_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&fit=crop",
    is_active: 1,
    display_order: 5
  },
  {
    id: 6,
    category_id: 5,
    category_name: "Plumbing & Drainage",
    title: "Commercial Plumbing & Firefighting Networks",
    slug: "commercial-plumbing-firefighting",
    short_description: "Turnkey CPVC/GI water loops, central sewage lines, and statutory firefighting wet risers.",
    full_description: "Complete water engineering for multi-storey factories and residences. Includes hydro-pneumatic pump stations, water treatment plants, grease traps, and fire hydrant lines conforming to NBC Part IV.",
    base_price: 180,
    price_unit: "per running ft",
    icon: "Pipette",
    image_url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&fit=crop",
    is_active: 1,
    display_order: 6
  }
];

export const MOCK_MATERIALS: MockMaterial[] = [
  {
    id: 1,
    category_id: 10,
    category_name: "Steel & TMT Rebars",
    sku: "TMT-FE550D-12MM",
    name: "Tata Tiscon 550D High-Ductility TMT Steel Rebar (12mm)",
    brand: "Tata Tiscon",
    description: "Primary mill Fe 550D grade thermo-mechanically treated rebars offering superior earthquake resistance and corrosion protection.",
    price_per_unit: 62.50,
    unit: "kg",
    min_order_quantity: 500,
    stock_quantity: 45000,
    image_url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&fit=crop",
    is_in_stock: 1,
    is_active: 1
  },
  {
    id: 2,
    category_id: 9,
    category_name: "Cement & Aggregates",
    sku: "CEM-ULT-OPC53",
    name: "UltraTech Super OPC 53 Grade High-Strength Cement (50kg)",
    brand: "UltraTech",
    description: "Premium Ordinary Portland Cement engineered for rapid strength development in multi-storey columns, slabs, and bridges.",
    price_per_unit: 385.00,
    unit: "bag",
    min_order_quantity: 50,
    stock_quantity: 2400,
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&fit=crop",
    is_in_stock: 1,
    is_active: 1
  },
  {
    id: 3,
    category_id: 11,
    category_name: "Bricks & AAC Blocks",
    sku: "BLK-AAC-600X200X100",
    name: "Siporex Lightweight Thermal AAC Blocks (600x200x100mm)",
    brand: "Siporex",
    description: "Autoclaved aerated concrete blocks providing 3x thermal insulation, high fire rating, and 50% dead-load reduction over red bricks.",
    price_per_unit: 64.00,
    unit: "piece",
    min_order_quantity: 200,
    stock_quantity: 12000,
    image_url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&fit=crop",
    is_in_stock: 1,
    is_active: 1
  },
  {
    id: 4,
    category_id: 12,
    category_name: "Tiles & Stone Flooring",
    sku: "TILE-KAJ-PORC-1200",
    name: "Kajaria Eternity Glazed Vitrified Porcelain Floor Tiles (1200x600mm)",
    brand: "Kajaria",
    description: "Ultra-low water absorption polished glazed vitrified tiles with marble veining and anti-skid surface for luxury commercial and living spaces.",
    price_per_unit: 78.00,
    unit: "sq ft",
    min_order_quantity: 200,
    stock_quantity: 8500,
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop",
    is_in_stock: 1,
    is_active: 1
  }
];

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: 1,
    reviewer_id: 13,
    reviewer_name: "Deepa Mehta",
    reviewer_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    rating: 5,
    review_text: "Hired 4 master welders and a civil contractor through WeldingPanchal for our factory expansion in Sanand. Flawless radiographic test results and zero safety delays.",
    created_at: "2026-10-15T10:00:00Z",
    is_verified_purchase: 1,
    service_id: 1,
    service_title: "TIG & MIG Precision Pipe Welding"
  },
  {
    id: 2,
    reviewer_id: 14,
    reviewer_name: "Rahul Verma",
    reviewer_avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    rating: 5,
    review_text: "Ordered 12 tons of Tata Tiscon TMT rebars. Ex-mill pricing was authentic and delivered directly to the construction site within 24 hours.",
    created_at: "2026-10-18T14:30:00Z",
    is_verified_purchase: 1,
    service_id: 2,
    service_title: "Turnkey Heavy Structural Steel Fabrication"
  },
  {
    id: 3,
    reviewer_id: 1,
    reviewer_name: "Arun Dave (Site Director)",
    reviewer_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    rating: 5,
    review_text: "The escrow payment milestone model gives complete peace of mind. Both the workers and contractor were accountable down to the last millimetre of formwork.",
    created_at: "2026-10-22T09:15:00Z",
    is_verified_purchase: 1,
    service_id: 3,
    service_title: "Turnkey Home & Civil Construction"
  }
];

export const MOCK_SKILLS = [
  { id: 1, worker_profile_id: 1, skill_name: "TIG / GTAW Precision Welding", certification_name: "AWS D1.1 & D1.6 Certified", years_experience: 9 },
  { id: 2, worker_profile_id: 1, skill_name: "6G Radiographic Pipe Welding", certification_name: "ASME Section IX Welder Qual", years_experience: 8 },
  { id: 3, worker_profile_id: 2, skill_name: "Heavy MIG / GMAW Welding", certification_name: "IS 800 Structural Welding Card", years_experience: 12 },
  { id: 4, worker_profile_id: 2, skill_name: "Submerged Arc Welding (SAW)", certification_name: "Heavy Column Fabricator License", years_experience: 10 },
  { id: 5, worker_profile_id: 3, skill_name: "RCC Foundation & Column Casting", certification_name: "National Skill Masonry Card", years_experience: 14 },
  { id: 6, worker_profile_id: 4, skill_name: "Slab Formwork & Shuttering", certification_name: "Advanced Concrete Carpentry", years_experience: 11 },
  { id: 7, worker_profile_id: 5, skill_name: "3-Phase Industrial Distribution Boards", certification_name: "Government Licensed Wireman A-Class", years_experience: 10 },
  { id: 8, worker_profile_id: 6, skill_name: "High Pressure CPVC Loop Piping", certification_name: "Plumbing Council of India Gold Card", years_experience: 8 },
  { id: 9, worker_profile_id: 7, skill_name: "Airless Spray & Epoxy Floor Coating", certification_name: "Master Painter Certification", years_experience: 7 },
  { id: 10, worker_profile_id: 8, skill_name: "Large Format Porcelain Slab Laying", certification_name: "Italian Tile Installer Certification", years_experience: 9 }
];

/**
 * Intelligent Mock Query Resolver:
 * Matches SQL queries by entity keyword and returns formatted fallback datasets.
 */
export function resolveMockQuery<T = any>(sql: string, params: any[] = []): T {
  const s = sql.toLowerCase();

  // 1. COUNT QUERIES
  if (s.includes("count(")) {
    if (s.includes("worker_profiles")) {
      return [{ total: MOCK_WORKERS.length }] as unknown as T;
    }
    if (s.includes("contractor_profiles")) {
      return [{ total: MOCK_CONTRACTORS.length }] as unknown as T;
    }
    if (s.includes("services")) {
      return [{ total: MOCK_SERVICES.length }] as unknown as T;
    }
    if (s.includes("materials")) {
      return [{ total: MOCK_MATERIALS.length }] as unknown as T;
    }
    return [{ total: 0 }] as unknown as T;
  }

  // 2. SPECIFIC BY ID / SLUG / SKU
  if (s.includes("worker_profiles") && (s.includes("wp.id = ?") || s.includes("wp.user_id = ?"))) {
    const id = Number(params[0]);
    const found = MOCK_WORKERS.find(w => w.id === id || w.user_id === id) || MOCK_WORKERS[0];
    return (found ? [found] : []) as unknown as T;
  }

  if (s.includes("contractor_profiles") && (s.includes("cp.id = ?") || s.includes("cp.user_id = ?"))) {
    const id = Number(params[0]);
    const found = MOCK_CONTRACTORS.find(c => c.id === id || c.user_id === id) || MOCK_CONTRACTORS[0];
    return (found ? [found] : []) as unknown as T;
  }

  if (s.includes("services") && s.includes("s.slug = ?")) {
    const slug = String(params[0]);
    const found = MOCK_SERVICES.find(srv => srv.slug === slug) || MOCK_SERVICES[0];
    return (found ? [found] : []) as unknown as T;
  }

  if (s.includes("materials") && s.includes("m.sku = ?")) {
    const sku = String(params[0]);
    const found = MOCK_MATERIALS.find(mat => mat.sku === sku) || MOCK_MATERIALS[0];
    return (found ? [found] : []) as unknown as T;
  }

  // 3. SKILLS
  if (s.includes("worker_skills")) {
    return MOCK_SKILLS as unknown as T;
  }

  // 4. ENTITY LISTS
  if (s.includes("worker_profiles")) {
    return MOCK_WORKERS as unknown as T;
  }

  if (s.includes("contractor_profiles")) {
    return MOCK_CONTRACTORS as unknown as T;
  }

  if (s.includes("services")) {
    return MOCK_SERVICES as unknown as T;
  }

  if (s.includes("materials")) {
    return MOCK_MATERIALS as unknown as T;
  }

  if (s.includes("categories")) {
    return MOCK_CATEGORIES as unknown as T;
  }

  if (s.includes("reviews")) {
    return MOCK_REVIEWS as unknown as T;
  }

  return [] as unknown as T;
}

