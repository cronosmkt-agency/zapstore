import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = process.env.VITE_APP_URL || "https://zapstore-mu.vercel.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const entries: SitemapEntry[] = [
          { path: "/", lastmod: today, changefreq: "daily", priority: "1.0" },
          { path: "/login", changefreq: "monthly", priority: "0.5" },
          { path: "/signup", changefreq: "monthly", priority: "0.8" },
          { path: "/termos-de-uso", changefreq: "yearly", priority: "0.3" },
          { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
          // Demo Stores & Catalogs
          { path: "/terephones", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/terephones/loja", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/prime-motors", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/prime-motors/loja", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/nexus-digital", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/nexus-digital/loja", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/aura-store", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/aura-store/loja", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/craft-burger", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/craft-burger/loja", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/alpha-imoveis", lastmod: today, changefreq: "weekly", priority: "0.8" },
          { path: "/alpha-imoveis/loja", lastmod: today, changefreq: "weekly", priority: "0.8" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
