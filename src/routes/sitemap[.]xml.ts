import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://savannah-guide-ai.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/map", changefreq: "weekly", priority: "0.9" },
          { path: "/safari", changefreq: "weekly", priority: "0.9" },
          { path: "/expedition", changefreq: "weekly", priority: "0.8" },
          { path: "/convoy", changefreq: "weekly", priority: "0.8" },
          { path: "/sos", changefreq: "monthly", priority: "0.7" },
          { path: "/survival", changefreq: "weekly", priority: "0.8" },
          { path: "/guardian", changefreq: "weekly", priority: "0.7" },
          { path: "/community", changefreq: "weekly", priority: "0.7" },
          { path: "/events", changefreq: "weekly", priority: "0.7" },
          { path: "/ai-assistant", changefreq: "weekly", priority: "0.8" },
          { path: "/knowledge-packs", changefreq: "weekly", priority: "0.7" },
          { path: "/settings", changefreq: "monthly", priority: "0.3" },
          { path: "/auth", changefreq: "yearly", priority: "0.3" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
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