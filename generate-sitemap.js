const fs = require("fs");

const urls = [
  { loc: "https://www.sanayatechs.com/", changefreq: "daily", priority: "1.0" },
  {
    loc: "https://www.sanayatechs.com/about",
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    loc: "https://www.sanayatechs.com/services",
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    loc: "https://www.sanayatechs.com/services/data-centers",
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    loc: "https://www.sanayatechs.com/academy",
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    loc: "https://www.sanayatechs.com/service-packages",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    loc: "https://www.sanayatechs.com/partners",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    loc: "https://www.sanayatechs.com/contact",
    changefreq: "monthly",
    priority: "0.6",
  },
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

fs.writeFileSync("public/sitemap.xml", sitemapContent);

console.log("✅ Sitemap generated successfully!");
