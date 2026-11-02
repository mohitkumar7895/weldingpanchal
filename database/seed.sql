-- ========================================================================
-- WELDINGPANCHAL PRODUCTION SEED DATA
-- Comprehensive Indian Construction-Tech Platform Data
-- Building Workers, Welders, Masons, Carpenters, Electricians,
-- Plumbers, Painters, Labour, Contractors, Services, and Materials
-- ========================================================================

USE `weldingpanchal`;

-- 1. SEED CATEGORIES (Services & Materials)
INSERT INTO `categories` (`id`, `type`, `name`, `slug`, `description`, `icon`, `display_order`, `is_active`) VALUES
  -- Service Categories
  (1, 'service', 'Welding & Metal Fabrication', 'welding-fabrication', 'TIG, MIG, arc welding, pressure piping, and structural fabrication.', 'Flame', 1, 1),
  (2, 'service', 'Civil Construction & Masonry', 'civil-masonry', 'Brickwork, stone masonry, foundation casting, and RCC structural slabs.', 'Building2', 2, 1),
  (3, 'service', 'Carpentry & Formwork', 'carpentry-formwork', 'Structural shuttering, wooden framework, doors, and designer cabinetry.', 'Axe', 3, 1),
  (4, 'service', 'Electrical Works', 'electrical-works', 'Industrial 3-phase wiring, transformer setup, panels, and conduit laying.', 'Zap', 4, 1),
  (5, 'service', 'Plumbing & Drainage', 'plumbing-drainage', 'Commercial piping, sanitaryware, water filtration, and pump fitting.', 'Pipette', 5, 1),
  (6, 'service', 'Painting & Waterproofing', 'painting-waterproofing', 'Exterior weather-proof coating, interior emulsion, and roof waterproofing.', 'Paintbrush', 6, 1),
  (7, 'service', 'Flooring & Tile Installation', 'flooring-tiling', 'Vitrified tiles, Italian marble, granite polishing, and epoxy flooring.', 'LayoutGrid', 7, 1),
  (8, 'service', 'Labour Contracting & Mobilization', 'labour-contracting', 'Certified gang mobilization of beldars, helpers, and skilled tradesmen.', 'HardHat', 8, 1),
  
  -- Material Categories
  (9, 'material', 'Cement & Aggregates', 'cement-aggregates', 'OPC, PPC, slag cement, river sand, and washed aggregates.', 'Package', 1, 1),
  (10, 'material', 'Steel & TMT Rebars', 'steel-tmt-bars', 'Fe 550D TMT rebars, structural channels, I-beams, and mild steel plates.', 'Layers', 2, 1),
  (11, 'material', 'Bricks & AAC Blocks', 'bricks-blocks', 'Fly-ash bricks, red clay bricks, and lightweight AAC blocks.', 'Boxes', 3, 1),
  (12, 'material', 'Tiles & Stone Flooring', 'tiles-flooring', 'Vitrified tiles, glazed porcelain, granite slabs, and tile adhesive.', 'Grid', 4, 1),
  (13, 'material', 'Paints & Exterior Finishes', 'paints-finishes', 'Primer, waterproof exterior coats, putty, and epoxy resin.', 'Droplet', 5, 1),
  (14, 'material', 'Electrical Supplies', 'electrical-supplies', 'Copper cables, distribution boards, MCBs, and PVC conduits.', 'Cpu', 6, 1),
  (15, 'material', 'Plumbing Supplies', 'plumbing-supplies', 'CPVC, UPVC pipes, brass fittings, and water storage tanks.', 'Wrench', 7, 1),
  (16, 'material', 'Welding Consumables & Gases', 'welding-consumables-gases', 'Electrodes, MIG wires, argon gas, and shielding consumables.', 'Sparkles', 8, 1),
  (17, 'material', 'Tools & Machinery', 'tools-machinery', 'Rotary hammer drills, angle grinders, vibrators, and mixer machines.', 'Drill', 9, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `icon` = VALUES(`icon`);

-- 2. SEED USERS (Password for all seed accounts is 'Admin@123')
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `role`, `avatar_url`, `is_active`) VALUES
  -- Admin
  (1, 'WeldingPanchal Admin', 'admin@weldingpanchal.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543210', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', 1),
  
  -- Workers (Diverse Construction Trades)
  (2, 'Rajesh Sharma', 'rajesh.welder@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543211', 'worker', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', 1),
  (3, 'Manoj Panchal', 'manoj.panchal@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543212', 'worker', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', 1),
  (4, 'Ramesh Prajapati', 'ramesh.mason@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543213', 'worker', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop', 1),
  (5, 'Dinesh Suthar', 'dinesh.carpenter@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543214', 'worker', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop', 1),
  (6, 'Jignesh Patel', 'jignesh.electrician@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543215', 'worker', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', 1),
  (7, 'Vinod Parmar', 'vinod.plumber@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543216', 'worker', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', 1),
  (8, 'Sanjay Rathod', 'sanjay.painter@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543217', 'worker', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop', 1),
  (9, 'Mukesh Chavda', 'mukesh.tiles@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543218', 'worker', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', 1),

  -- Contractors
  (10, 'Vikram Singh', 'vikram.contractor@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543219', 'contractor', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop', 1),
  (11, 'Suresh Patel', 'suresh.fabrication@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543220', 'contractor', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop', 1),
  (12, 'Bharat Solanki', 'bharat.civil@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543221', 'contractor', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop', 1),

  -- Customers
  (13, 'Deepa Mehta', 'deepa.customer@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543222', 'customer', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop', 1),
  (14, 'Rahul Verma', 'rahul.industrial@example.com', '$2a$10$ij/w2vPxLOew05ZP7t.xheK98yhEyeDxf4qBfwgSjNxlnIoqZjNhW', '9876543223', 'customer', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `avatar_url` = VALUES(`avatar_url`);

-- 3. SEED WORKER PROFILES
INSERT INTO `worker_profiles` (`id`, `user_id`, `title`, `experience_years`, `hourly_rate`, `daily_rate`, `city`, `state`, `availability_status`, `verification_status`, `rating_avg`, `total_reviews`, `bio`) VALUES
  (1, 2, 'Senior 6G Pipe & Pressure Vessel Welder', 9, 450.00, 3200.00, 'Ahmedabad', 'Gujarat', 'available', 'verified', 4.95, 38, 'AWS CWI certified 6G pipe specialist with deep expertise in steam lines, ASME Section IX vessels, and stainless steel sanitary tubes.'),
  (2, 3, 'Heavy Structural Steel Fitter & Fabricator', 12, 380.00, 2800.00, 'Vadodara', 'Gujarat', 'available', 'verified', 4.88, 52, 'Lead structural fitter specializing in heavy factory PEB erection, crane arm alignment, submerged arc welding, and I-beam assemblies.'),
  (3, 4, 'Master Civil Mason & Bricklayer', 14, 300.00, 2200.00, 'Surat', 'Gujarat', 'available', 'verified', 4.92, 45, 'Expert in RCC foundation footing, precision fly-ash/red brickwork, exterior stone cladding, and plaster line alignment.'),
  (4, 5, 'Master Shuttering & Finishing Carpenter', 11, 350.00, 2500.00, 'Ahmedabad', 'Gujarat', 'available', 'verified', 4.85, 34, 'Specialized in formwork shuttering for multi-storey concrete slabs, plywood paneling, teakwood frames, and modular kitchen installations.'),
  (5, 6, 'Licensed Industrial & Residential Electrician', 10, 320.00, 2400.00, 'Gandhinagar', 'Gujarat', 'available', 'verified', 4.90, 41, 'Certified Wireman with extensive experience in 3-phase industrial panel board wiring, circuit breaker routing, and smart home automation.'),
  (6, 7, 'Commercial Plumbing & Firefighting Piping Specialist', 8, 280.00, 2100.00, 'Rajkot', 'Gujarat', 'available', 'verified', 4.78, 29, 'Skilled in high-pressure CPVC loops, underground sewage drainage lines, overhead hydro-pneumatic pressure pumps, and firefighting risers.'),
  (7, 8, 'Commercial Spray Painter & Texture Artisan', 7, 260.00, 1900.00, 'Ahmedabad', 'Gujarat', 'available', 'verified', 4.82, 31, 'Professional in mechanized airless spray painting, PU exterior waterproofing membranes, rustic wall textures, and anti-corrosion primer.'),
  (8, 9, 'Vitrified Tile & Italian Marble Installer', 9, 340.00, 2400.00, 'Surat', 'Gujarat', 'available', 'verified', 4.89, 36, 'Flawless laser-aligned laying of large format (1200x1800mm) porcelain slabs, epoxy grouting, diamond marble crystallization, and granite stairs.')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `rating_avg` = VALUES(`rating_avg`), `total_reviews` = VALUES(`total_reviews`);

-- 4. SEED CONTRACTOR PROFILES
INSERT INTO `contractor_profiles` (`id`, `user_id`, `company_name`, `registration_number`, `experience_years`, `established_year`, `team_size`, `city`, `state`, `website`, `verification_status`, `rating_avg`, `total_reviews`, `description`) VALUES
  (1, 10, 'Apex Heavy Fabrication & Engineering Works', '24AAACA1234A1Z5', 15, 2009, 65, 'Ahmedabad', 'Gujarat', 'https://apexheavyfab.example.com', 'verified', 4.94, 78, 'Class-A turnkey structural fabrication contractor executing complete industrial plant sheds, PEB warehouses, heavy overhead cranes, and pipeline grids.'),
  (2, 11, 'Panchal Industrial Steel & Canopy Solutions', '24AAACP5678B1Z2', 11, 2013, 35, 'Surat', 'Gujarat', 'https://panchalsteel.example.com', 'verified', 4.86, 52, 'Turnkey metal design and construction firm providing cantilevered skylight canopies, motorized sliding gates, catwalks, and stainless architectural facades.'),
  (3, 12, 'Solanki Turnkey Civil Infrastructure & Builders', '24AAACS9988D1Z9', 18, 2006, 120, 'Ahmedabad', 'Gujarat', 'https://solankibuilders.example.com', 'verified', 4.91, 94, 'Full-scale civil construction contractor specialized in multi-storey residential complexes, industrial factory foundations, RCC framing, and fast-track renovation.')
ON DUPLICATE KEY UPDATE `company_name` = VALUES(`company_name`), `team_size` = VALUES(`team_size`);

-- 5. SEED WORKER SKILLS
INSERT INTO `worker_skills` (`id`, `worker_profile_id`, `skill_name`, `certification_name`, `years_experience`) VALUES
  (1, 1, 'TIG / GTAW Precision Welding', 'AWS D1.1 & D1.6 Certified', 9),
  (2, 1, '6G Radiographic Pipe Welding', 'ASME Section IX Welder Qual', 8),
  (3, 1, 'SS 316 Orbital Welding', 'High Purity Process Tube Cert', 6),
  (4, 2, 'Heavy MIG / GMAW Welding', 'IS 800 Structural Welding Card', 12),
  (5, 2, 'Submerged Arc Welding (SAW)', 'Heavy Column Fabricator License', 10),
  (6, 3, 'RCC Foundation & Column Casting', 'National Skill Masonry Card', 14),
  (7, 3, 'Precision Brick & Stone Cladding', 'Heritage Mason Certificate', 12),
  (8, 4, 'Slab Formwork & Shuttering', 'Advanced Concrete Carpentry', 11),
  (9, 4, 'Modular Interior Joinery', 'Craftsman Guild Certificate', 8),
  (10, 5, '3-Phase Industrial Distribution Boards', 'Government Licensed Wireman A-Class', 10),
  (11, 5, 'Cable Tray & Industrial Conduit Fitting', 'Electrical Safety Certified', 9),
  (12, 6, 'High Pressure CPVC Loop Piping', 'Plumbing Council of India Gold Card', 8),
  (13, 7, 'Airless Spray & Epoxy Floor Coating', 'Master Painter Certification', 7),
  (14, 8, 'Large Format Porcelain Slab Laying', 'Italian Tile Installer Certification', 9)
ON DUPLICATE KEY UPDATE `skill_name` = VALUES(`skill_name`);

-- 6. SEED SERVICES (Construction, Welding, Carpentry, Civil, Electrical, Plumbing, Flooring)
INSERT INTO `services` (`id`, `category_id`, `title`, `slug`, `short_description`, `full_description`, `base_price`, `price_unit`, `icon`, `image_url`, `is_active`, `display_order`) VALUES
  (1, 1, 'TIG & MIG Precision Pipe Welding', 'tig-mig-precision-welding', 'Aerospace and pharmaceutical tolerance gas tungsten arc joining with 100% radiographic compliance.', 'Engineered for steam loops, chemical transport lines, food processing vessels, and thin gauge exotic alloys with internal argon purging and zero-porosity radiographic certification.', 1500.00, 'per joint', 'Flame', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&fit=crop', 1, 1),
  (2, 1, 'Turnkey Heavy Structural Steel Fabrication', 'structural-steel-fabrication', 'Turnkey fabrication and on-site erection of factory PEB sheds, I-beams, and columns.', 'From structural engineering drawings to automated plasma cutting, beam profiling, precision fit-up, and field erection conforming to IS 800. Equipped with heavy mobile cranes and ultrasonic weld inspection.', 5000.00, 'per ton', 'Hammer', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&fit=crop', 1, 2),
  (3, 2, 'Turnkey Home & Civil Construction', 'turnkey-home-construction', 'Complete civil construction from soil excavation to concrete framing and brick masonry.', 'Comprehensive turnkey home and commercial building execution. Includes soil testing, PCC/RCC footings, column reinforcement, brickwork, roof slab casting, and exterior plastering managed by licensed civil engineers.', 1800.00, 'per sq ft', 'Building2', 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800&fit=crop', 1, 3),
  (4, 2, 'Complete Building Renovation & Remodeling', 'building-renovation-remodeling', 'Structural strengthening, wall alterations, waterproofing, and exterior facade refresh.', 'Modernize aged residential and commercial properties. We handle column jacketing, partition wall removal, plaster repair, wet area waterproofing, and aesthetic facade redesign with minimal site disruption.', 650.00, 'per sq ft', 'Wrench', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&fit=crop', 1, 4),
  (5, 4, 'Commercial & Industrial Electrical Works', 'commercial-electrical-works', 'Complete electrical wiring, main distribution panel setup, and 3-phase balancing.', 'From transformer step-down connections to heavy motor control centers (MCC), cable tray installation, earthing pits, and surge protection compliant with Indian Electricity Rules.', 45.00, 'per point', 'Zap', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&fit=crop', 1, 5),
  (6, 5, 'Plumbing & High-Pressure Sanitary Piping', 'plumbing-sanitary-piping', 'Concealed CPVC/UPVC water supply, sewage drainage lines, and pump manifolding.', 'Reliable plumbing engineering for apartments, factories, and villas. Includes acoustic sewage pipe fittings, solar water heater loop connections, water treatment plants, and bathroom fixtures.', 85.00, 'per point', 'Pipette', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&fit=crop', 1, 6),
  (7, 7, 'Precision Vitrified Tile & Marble Flooring', 'flooring-tile-installation', 'Laser-guided laying of Italian marble, large porcelain slabs, and anti-skid tiles.', 'Specialized flooring artisans utilizing vibration suction cups, leveling clips, and waterproof epoxy grout. Includes wet diamond polishing for Italian marble, Kota stone, and monolithic granites.', 45.00, 'per sq ft', 'LayoutGrid', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop', 1, 7),
  (8, 6, 'Waterproof Exterior & Designer Interior Painting', 'waterproof-interior-painting', 'Mechanized airless spray painting, PU weather-shield coat, and designer textures.', 'End-to-end surface preparation including crack bridging, wall putty leveling, damp-proof priming, and 3-coat washable emulsion application with 7-year anti-fading warranty.', 22.00, 'per sq ft', 'Paintbrush', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&fit=crop', 1, 8),
  (9, 8, 'Certified Construction Labour Gang Mobilization', 'labour-contracting-mobilization', 'Fast deployment of vetted construction beldars, shuttering helpers, and skilled gangs.', 'On-demand mobilization of construction labour gangs with safety helmets, boots, PF/ESIC documentation, and experienced supervisors for fast-track construction projects.', 850.00, 'per person/day', 'HardHat', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&fit=crop', 1, 9)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `image_url` = VALUES(`image_url`), `base_price` = VALUES(`base_price`);

-- 7. SEED CONTRACTOR SERVICES
INSERT INTO `contractor_services` (`contractor_profile_id`, `service_id`, `custom_pricing_notes`) VALUES
  (1, 1, 'Aerospace-spec mobile welding rigs and radiographic testing included'),
  (1, 2, 'Complete PEB engineering, mobile crane erection, and anchor bolt grouting'),
  (2, 1, 'Custom stainless steel balustrades and laser-cut sliding gates'),
  (2, 4, 'Factory shed expansions, canopy retrofitting, and crane beam repair'),
  (3, 3, 'Turnkey EPC contractor executing civil structures from foundation to turnkey handover'),
  (3, 4, 'Full residential and commercial property modernization with structural warranty')
ON DUPLICATE KEY UPDATE `custom_pricing_notes` = VALUES(`custom_pricing_notes`);

-- 8. SEED MATERIALS (Cement, TMT Steel, AAC Blocks, Tiles, Paints, Electrical, Plumbing, Tools)
INSERT INTO `materials` (`id`, `category_id`, `sku`, `name`, `slug`, `brand`, `specifications`, `unit`, `price_per_unit`, `stock_quantity`, `min_order_quantity`, `image_url`, `is_in_stock`, `is_active`) VALUES
  (1, 9, 'MAT-CEM-OPC-53', 'UltraTech Super Premium OPC 53 Grade Cement', 'ultratech-super-opc-53-cement', 'UltraTech Cement', '{"grade": "OPC 53", "standard": "IS 12269", "setting_time_min": 140, "compressive_strength_28d_mpa": 58}', 'bag (50kg)', 380.00, 1500, 20, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&fit=crop', 1, 1),
  (2, 10, 'MAT-TMT-550D-12', 'Tata Tiscon 550D Super Ductile TMT Rebar (12mm)', 'tata-tiscon-550d-tmt-rebar-12mm', 'Tata Tiscon', '{"grade": "Fe 550D", "diameter_mm": 12, "standard": "IS 1786", "elongation_percent": 16.5, "yield_stress_mpa": 570}', 'kg', 74.50, 45000, 500, 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&fit=crop', 1, 1),
  (3, 11, 'MAT-AAC-BLK-600', 'Siporex High-Strength Lightweight AAC Block (600x200x150mm)', 'siporex-lightweight-aac-block-150mm', 'Siporex', '{"dimensions_mm": "600x200x150", "dry_density_kg_m3": 550, "compressive_strength_mpa": 4.0, "thermal_conductivity": 0.16}', 'piece', 68.00, 8500, 100, 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&fit=crop', 1, 1),
  (4, 10, 'MAT-MS-PLT-E250', 'IS 2062 Grade E250 Mild Steel Plate (10mm)', 'is-2062-grade-e250-ms-plate-10mm', 'JSW Steel', '{"grade": "E250", "thickness_mm": 10, "tensile_strength_mpa": 410, "yield_strength_mpa": 250}', 'kg', 69.50, 24000, 500, 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&fit=crop', 1, 1),
  (5, 12, 'MAT-TIL-VIT-600', 'Kajaria Vitrified Anti-Skid Floor Tiles (600x600mm)', 'kajaria-vitrified-floor-tiles-600', 'Kajaria', '{"size_mm": "600x600", "finish": "Matt / Anti-Skid", "thickness_mm": 9.5, "pieces_per_box": 4, "coverage_sqft": 15.5}', 'box', 780.00, 650, 10, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&fit=crop', 1, 1),
  (6, 13, 'MAT-PNT-APX-20L', 'Asian Paints Apex Ultima Exterior Weatherproof Emulsion', 'asian-paints-apex-ultima-20l', 'Asian Paints', '{"volume_liters": 20, "coverage_sqft_per_l": "55-60 (2 coats)", "warranty_years": 7, "dirt_resistance": "Nano Carat Shield"}', 'bucket (20L)', 4850.00, 120, 1, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&fit=crop', 1, 1),
  (7, 14, 'MAT-ELE-CAB-4SQ', 'Polycab 4 Sq mm FRLS Copper House Wire Coil', 'polycab-4sqmm-frls-copper-wire-coil', 'Polycab', '{"conductor": "Electrolytic Copper", "cross_section_sqmm": 4.0, "length_meters": 90, "voltage_grade_v": 1100, "fire_retardant": true}', 'coil (90m)', 2750.00, 180, 2, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&fit=crop', 1, 1),
  (8, 15, 'MAT-PLM-CPVC-1IN', 'Astral CPVC Pro High-Pressure Schedule 40 Pipe (1 Inch)', 'astral-cpvc-pro-pipe-1-inch', 'Astral Pipes', '{"schedule": "Sch 40", "diameter_inch": 1.0, "length_meters": 3.0, "max_temperature_c": 93, "standards": "ASTM D2846"}', 'pipe (3m)', 320.00, 950, 10, 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&fit=crop', 1, 1),
  (9, 16, 'MAT-ROD-AWS-6013', 'ESAB AWS A5.1 E6013 Rutile Welding Electrodes (3.15mm)', 'esab-e6013-welding-electrodes-315', 'ESAB India', '{"aws_spec": "AWS A5.1 E6013", "diameter_mm": 3.15, "length_mm": 350, "pack_weight_kg": 5, "current_amp": "90-130"}', 'box (5kg)', 760.00, 420, 2, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&fit=crop', 1, 1),
  (10, 16, 'MAT-GAS-ARGON-48', 'High-Purity Industrial Shielding Argon Gas Cylinder (47L)', 'industrial-argon-gas-cylinder-47l', 'Inox Air Products', '{"purity": "99.998% Grade 4.8", "cylinder_water_capacity_l": 47, "filling_pressure_bar": 150}', 'cylinder', 1450.00, 55, 1, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&fit=crop', 1, 1),
  (11, 17, 'MAT-MAC-BOSCH-RHM', 'Bosch Professional 800W Rotary Hammer Drill (GBH 2-26 DRE)', 'bosch-professional-rotary-hammer-drill', 'Bosch', '{"power_watts": 800, "impact_energy_j": 2.7, "max_drilling_concrete_mm": 26, "tool_holder": "SDS-Plus"}', 'unit', 6950.00, 40, 1, 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&fit=crop', 1, 1),
  (12, 17, 'MAT-HLM-AUTO-3M', '3M Speedglas Auto-Darkening Welding Helmet (Shade 9-13)', '3m-speedglas-auto-darkening-helmet', '3M', '{"shades": "9 to 13", "switching_speed": "0.1 ms", "standards": "EN 379", "solar_cell": true}', 'unit', 3850.00, 60, 1, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&fit=crop', 1, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `price_per_unit` = VALUES(`price_per_unit`), `image_url` = VALUES(`image_url`);

-- 9. SEED ADDRESSES
INSERT INTO `addresses` (`id`, `user_id`, `address_type`, `contact_person`, `contact_phone`, `street_line1`, `street_line2`, `city`, `state`, `pincode`, `is_default`) VALUES
  (1, 13, 'factory', 'Deepa Mehta', '9876543222', 'Plot 44, GIDC Vatva Industrial Estate Phase IV', 'Near Phase IV Fire Station', 'Ahmedabad', 'Gujarat', '382445', 1),
  (2, 14, 'work_site', 'Rahul Verma', '9876543223', 'Survey No 120, Heavy Engineering Park', 'National Highway 8A', 'Vadodara', 'Gujarat', '391243', 1)
ON DUPLICATE KEY UPDATE `street_line1` = VALUES(`street_line1`);

-- 10. SEED BOOKINGS
INSERT INTO `bookings` (`id`, `booking_number`, `customer_id`, `service_id`, `assigned_worker_id`, `assigned_contractor_id`, `address_id`, `status`, `scheduled_date`, `scheduled_time_slot`, `estimated_amount`, `final_amount`, `notes`) VALUES
  (1, 'BK-20261028-A4F1', 13, 1, 1, NULL, 1, 'in_progress', '2026-11-05', '09:00 AM - 01:00 PM', 14000.00, NULL, 'Urgent TIG repair on pharmaceutical fluid loop lines. Welder must carry AWS certification cards.'),
  (2, 'BK-20261020-B8E2', 14, 2, NULL, 1, 2, 'completed', '2026-10-25', 'Full Day Mobilization', 850000.00, 845000.00, 'Heavy factory shed trusses fabrication and crane girder alignment successfully verified.')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`), `booking_number` = VALUES(`booking_number`);

-- 11. SEED BOOKING STATUS HISTORY
INSERT INTO `booking_status_history` (`id`, `booking_id`, `from_status`, `to_status`, `changed_by_user_id`, `reason`) VALUES
  (1, 1, NULL, 'pending', 13, 'Initial booking created by customer for plant piping repair'),
  (2, 1, 'pending', 'accepted', 1, 'Admin accepted and assigned AWS certified welder Rajesh Sharma'),
  (3, 1, 'accepted', 'in_progress', 2, 'Welder checked in on site with calibration equipment'),
  (4, 2, NULL, 'pending', 14, 'RFQ created for 40-ton structural warehouse erection'),
  (5, 2, 'pending', 'accepted', 1, 'Assigned to Apex Heavy Fabrication & Engineering Works'),
  (6, 2, 'accepted', 'in_progress', 10, 'Material delivered on site and erection started'),
  (7, 2, 'in_progress', 'completed', 1, 'Third-party ultrasonic inspection passed, final sign-off completed')
ON DUPLICATE KEY UPDATE `to_status` = VALUES(`to_status`);

-- 12. SEED REVIEWS
INSERT INTO `reviews` (`id`, `booking_id`, `reviewer_id`, `worker_profile_id`, `contractor_profile_id`, `service_id`, `rating`, `review_text`, `is_verified_purchase`) VALUES
  (1, 2, 14, NULL, 1, 2, 5, 'Apex Heavy Fabrication completed our warehouse steel erection ahead of schedule. Weld seams were exceptionally clean and passed radiographic inspection on the first pass.', 1),
  (2, 1, 13, 1, NULL, 1, 5, 'Rajesh Sharma is a master welder. He fixed our sanitary pipe joints with impeccable TIG finishing and zero heat distortion.', 1)
ON DUPLICATE KEY UPDATE `rating` = VALUES(`rating`);

-- 13. SEED PORTFOLIO IMAGES
INSERT INTO `portfolio_images` (`id`, `worker_profile_id`, `contractor_profile_id`, `title`, `description`, `image_url`, `display_order`) VALUES
  (1, 1, NULL, 'Cryogenic SS 304 Pipe Welding', 'Multi-pass TIG welding with internal argon purging for chemical plant piping.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&fit=crop', 1),
  (2, 3, NULL, 'Heritage Red Brick Arch Masonry', 'Precision curved brick archways and lime mortar pointing for villa estate.', 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800&fit=crop', 1),
  (3, NULL, 1, '60-Meter Clear Span Factory Shed', 'Complete PEB fabrication and mobile crane erection in Sanand GIDC.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&fit=crop', 1),
  (4, NULL, 3, '4-Storey Commercial Complex RCC Frame', 'Fast-track concrete columns, shear walls, and post-tensioned slabs.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&fit=crop', 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 14. SEED CONTACT ENQUIRIES
INSERT INTO `contact_enquiries` (`id`, `name`, `email`, `phone`, `subject`, `service_id`, `material_id`, `enquiry_type`, `city`, `quantity`, `message`, `status`) VALUES
  (1, 'Harish Patel', 'harish.patel@chemtech.example.com', '9898012345', 'Quote for 150-meter boiler steam line renewal', 1, NULL, 'service_quote', 'Ankleshwar', NULL, 'We require ASME Section IX certified pipe welders for a shutdown beginning next month.', 'contacted'),
  (2, 'Sunil Builders', 'procurement@sunilbuilders.example.com', '9825012345', 'Bulk TMT Steel Rebar requirement (12mm and 16mm)', NULL, 2, 'material_quote', 'Ahmedabad', '35 Tons', 'Please provide commercial quotation for Fe 550D Tata Tiscon rebars with mill test certificates.', 'pending')
ON DUPLICATE KEY UPDATE `subject` = VALUES(`subject`);

-- 15. SEED USER FAVOURITES
INSERT INTO `user_favourites` (`id`, `user_id`, `worker_profile_id`, `contractor_profile_id`, `service_id`, `material_id`) VALUES
  (1, 13, 1, NULL, NULL, NULL),
  (2, 13, NULL, NULL, 1, NULL),
  (3, 14, NULL, 1, NULL, NULL)
ON DUPLICATE KEY UPDATE `user_id` = VALUES(`user_id`);

-- 16. SEED ADMIN ACTIVITY LOGS
INSERT INTO `admin_activity_logs` (`id`, `admin_user_id`, `action`, `target_entity`, `target_id`, `details`, `ip_address`) VALUES
  (1, 1, 'INITIALIZE_SYSTEM', 'database', NULL, '{"event": "Phase 3 Full Construction Platform Initialized", "tables_active": 17}', '127.0.0.1'),
  (2, 1, 'VERIFY_WORKER', 'worker_profiles', 1, '{"worker_name": "Rajesh Sharma", "status": "verified"}', '127.0.0.1'),
  (3, 1, 'VERIFY_CONTRACTOR', 'contractor_profiles', 1, '{"company": "Apex Heavy Fabrication", "status": "verified"}', '127.0.0.1')
ON DUPLICATE KEY UPDATE `action` = VALUES(`action`);
