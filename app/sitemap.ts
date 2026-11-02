import { MetadataRoute } from "next";
import { query } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://weldingpanchal.com";

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/workers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/contractors`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/materials`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    // Dynamic workers
    const workers = await query<any[]>("SELECT id, updated_at FROM worker_profiles LIMIT 100");
    const workerRoutes: MetadataRoute.Sitemap = workers.map((w) => ({
      url: `${baseUrl}/workers/${w.id}`,
      lastModified: new Date(w.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic contractors
    const contractors = await query<any[]>("SELECT id, updated_at FROM contractor_profiles LIMIT 100");
    const contractorRoutes: MetadataRoute.Sitemap = contractors.map((c) => ({
      url: `${baseUrl}/contractors/${c.id}`,
      lastModified: new Date(c.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic services
    const services = await query<any[]>("SELECT slug, updated_at FROM services WHERE is_active = 1");
    const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: new Date(s.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic materials
    const materials = await query<any[]>("SELECT sku, updated_at FROM materials WHERE is_active = 1");
    const materialRoutes: MetadataRoute.Sitemap = materials.map((m) => ({
      url: `${baseUrl}/materials/${m.sku}`,
      lastModified: new Date(m.updated_at || Date.now()),
      changeFrequency: "daily",
      priority: 0.7,
    }));

    return [...staticRoutes, ...workerRoutes, ...contractorRoutes, ...serviceRoutes, ...materialRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}

