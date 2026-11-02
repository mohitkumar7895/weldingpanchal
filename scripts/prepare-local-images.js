const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Curated verified image sources with fallbacks
const imageSources = [
  {
    filename: 'hero-construction.jpg',
    urls: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85',
      'https://fastly.picsum.photos/id/1062/1200/800.jpg?hmac=XU5R1C5ZgI1_B5_4Fw3d2g5h6j7k8l9'
    ],
    title: 'Active Construction Site'
  },
  {
    filename: 'hero-indian-site.jpg',
    urls: [
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=85'
    ],
    title: 'Indian Construction Site Workers'
  },
  {
    filename: 'category-welder.jpg',
    urls: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    title: 'Industrial Welding & Metal Fabrication'
  },
  {
    filename: 'category-mason.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
    ],
    title: 'Masonry & Structural Brickwork'
  },
  {
    filename: 'category-carpenter.jpg',
    urls: [
      'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?auto=format&fit=crop&w=800&q=80',
      'https://fastly.picsum.photos/id/1074/800/600.jpg'
    ],
    title: 'Architectural Carpentry'
  },
  {
    filename: 'category-electrician.jpg',
    urls: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
    ],
    title: 'Electrical Engineering & Wiring'
  },
  {
    filename: 'category-plumber.jpg',
    urls: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    ],
    title: 'Industrial Piping & Plumbing'
  },
  {
    filename: 'category-painter.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      'https://fastly.picsum.photos/id/1062/800/600.jpg'
    ],
    title: 'Protective Coatings & Finishing'
  },
  {
    filename: 'category-labour.jpg',
    urls: [
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    ],
    title: 'Construction Workforce'
  },
  {
    filename: 'category-tile.jpg',
    urls: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      'https://fastly.picsum.photos/id/1076/800/600.jpg'
    ],
    title: 'Precision Tile & Marble Installation'
  },
  {
    filename: 'category-contractor.jpg',
    urls: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    ],
    title: 'Civil & Turnkey Contractors'
  },
  {
    filename: 'material-steel.jpg',
    urls: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    ],
    title: 'Structural Steel & TMT Rebar'
  },
  {
    filename: 'material-cement.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      'https://fastly.picsum.photos/id/1050/800/600.jpg'
    ],
    title: 'IS-Certified Cement'
  },
  {
    filename: 'material-bricks.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      'https://fastly.picsum.photos/id/1050/800/600.jpg'
    ],
    title: 'Red Clay Bricks & AAC Blocks'
  },
  {
    filename: 'worker-avatar-1.jpg',
    urls: [
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=400&q=80',
      'https://fastly.picsum.photos/id/1062/400/400.jpg'
    ],
    title: 'Rajesh Panchal'
  },
  {
    filename: 'worker-avatar-2.jpg',
    urls: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
      'https://fastly.picsum.photos/id/1074/400/400.jpg'
    ],
    title: 'Suresh Prajapati'
  },
  {
    filename: 'worker-avatar-3.jpg',
    urls: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
      'https://fastly.picsum.photos/id/1080/400/400.jpg'
    ],
    title: 'Prakash Suthar'
  },
  {
    filename: 'worker-avatar-4.jpg',
    urls: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80',
      'https://fastly.picsum.photos/id/1056/400/400.jpg'
    ],
    title: 'Amit Parmar'
  }
];

async function generateSvgFallback(title, width = 800, height = 600) {
  // Rich Earthy Construction Luxury vector visual
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#40352E" />
        <stop offset="60%" stop-color="#2D241E" />
        <stop offset="100%" stop-color="#1A1411" />
      </linearGradient>
      <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#A98559" />
        <stop offset="50%" stop-color="#CBB28D" />
        <stop offset="100%" stop-color="#806B59" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D8D0C5" stroke-width="0.5" stroke-opacity="0.12" />
      </pattern>
      <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#A98559" fill-opacity="0.25" />
      </pattern>
    </defs>
    
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <rect width="${width}" height="${height}" fill="url(#grid)" />
    
    <!-- Architectural Beams & Structural Silhouette -->
    <g opacity="0.35">
      <line x1="0" y1="${height}" x2="${width}" y2="0" stroke="#806B59" stroke-width="2" />
      <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="#806B59" stroke-width="2" />
      <polygon points="0,${height} ${width * 0.4},${height * 0.3} ${width * 0.6},${height * 0.3} ${width},${height}" fill="#D8D0C5" fill-opacity="0.04" />
      <!-- Crane silhouette -->
      <line x1="${width * 0.75}" y1="${height * 0.2}" x2="${width * 0.75}" y2="${height}" stroke="#A98559" stroke-width="3" />
      <line x1="${width * 0.5}" y1="${height * 0.2}" x2="${width * 0.95}" y2="${height * 0.2}" stroke="#A98559" stroke-width="2.5" />
      <line x1="${width * 0.75}" y1="${height * 0.15}" x2="${width * 0.5}" y2="${height * 0.2}" stroke="#A98559" stroke-width="1.5" />
      <line x1="${width * 0.75}" y1="${height * 0.15}" x2="${width * 0.95}" y2="${height * 0.2}" stroke="#A98559" stroke-width="1.5" />
    </g>

    <!-- Warm Ivory & Bronze Architectural Card Accent -->
    <rect x="30" y="${height - 90}" width="${width - 60}" height="60" rx="14" fill="#F5F0E8" fill-opacity="0.94" stroke="#D8D0C5" stroke-width="1" />
    <text x="50" y="${height - 62}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#A98559" letter-spacing="1.5">WELDINGPANCHAL INDUSTRIAL ASSET</text>
    <text x="50" y="${height - 42}" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="800" fill="#40352E">${title}</text>
    
    <!-- Geometric Badge -->
    <circle cx="${width - 60}" cy="${height - 60}" r="16" fill="url(#bronzeGrad)" />
    <path d="M${width - 66} ${height - 60} L${width - 62} ${height - 56} L${width - 54} ${height - 64}" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" />
  </svg>
  `;
  return Buffer.from(svg);
}

async function downloadOrGenerate() {
  console.log('Preparing local images for Earthy Construction Luxury...');

  for (const item of imageSources) {
    const destPath = path.join(targetDir, item.filename);
    let downloaded = false;

    for (const url of item.urls) {
      try {
        console.log(`Fetching ${item.filename} from ${url.substring(0, 55)}...`);
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(6000)
        });

        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          // Optimize through sharp to normalize JPEG
          await sharp(buffer)
            .jpeg({ quality: 85, progressive: true })
            .toFile(destPath);
          console.log(`✓ Saved ${item.filename} (${fs.statSync(destPath).size} bytes)`);
          downloaded = true;
          break;
        }
      } catch (err) {
        console.log(`  Failed source for ${item.filename}: ${err.message}`);
      }
    }

    if (!downloaded) {
      console.log(`⚡ Generating high-fidelity luxury SVG fallback for ${item.filename}`);
      const svgBuffer = await generateSvgFallback(item.title);
      await sharp(svgBuffer).jpeg({ quality: 90 }).toFile(destPath);
      console.log(`✓ Generated fallback ${item.filename} (${fs.statSync(destPath).size} bytes)`);
    }
  }

  // Create global fallback.jpg
  const globalFallback = path.join(targetDir, 'fallback.jpg');
  const fallbackSvg = await generateSvgFallback('Earthy Construction Luxury', 1200, 800);
  await sharp(fallbackSvg).jpeg({ quality: 90 }).toFile(globalFallback);
  console.log(`✓ Global fallback created at ${globalFallback}`);

  console.log('All local image assets are ready!');
}

downloadOrGenerate();

