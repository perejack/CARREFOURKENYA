import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://www.careeropportunitiesportal.site';

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/faq', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.4', changefreq: 'monthly' },
  { path: '/terms', priority: '0.4', changefreq: 'monthly' },
  { path: '/cookies', priority: '0.4', changefreq: 'monthly' },
  { path: '/blog', priority: '0.7', changefreq: 'daily' },
];

const jobRoutes = [
  { path: '/jobs/receptionist', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/accountant-cashier', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/warehouse-supervisor', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/distributor-marketer', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/driver', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/guard', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/sales-attendant', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/chef', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/cleaner', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/store-keeper', priority: '0.9', changefreq: 'weekly' },
  { path: '/jobs/loader-offloader', priority: '0.9', changefreq: 'weekly' },
];

const categoryRoutes = [
  { path: '/jobs/category/customer-service', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/category/finance', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/category/operations', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/category/sales-marketing', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/category/logistics', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/category/security', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/category/food-service', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/category/facility-management', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/category/warehouse', priority: '0.8', changefreq: 'weekly' },
];

const locationRoutes = [
  { path: '/jobs/location/nairobi', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/location/mombasa', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/location/kisumu', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/location/nakuru', priority: '0.8', changefreq: 'weekly' },
  { path: '/jobs/location/eldoret', priority: '0.8', changefreq: 'weekly' },
];

const blogRoutes = [
  { path: '/blog/how-to-write-a-winning-cv-for-retail-jobs-in-kenya', priority: '0.6', changefreq: 'monthly' },
  { path: '/blog/top-10-interview-questions-for-a-carrefour-job', priority: '0.6', changefreq: 'monthly' },
  { path: '/blog/a-guide-to-retail-salaries-in-kenya-what-to-expect-in-2026', priority: '0.6', changefreq: 'monthly' },
];

const today = new Date().toISOString().split('T')[0];

function generateUrlEntry(route) {
  return `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}

function generateSitemap() {
  const allRoutes = [
    ...staticRoutes,
    ...jobRoutes,
    ...categoryRoutes,
    ...locationRoutes,
    ...blogRoutes,
  ];

  const urls = allRoutes.map(generateUrlEntry).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>
`;
}

const sitemap = generateSitemap();
const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outputPath, sitemap);
console.log(`Sitemap generated at ${outputPath}`);
console.log(`Total URLs: ${staticRoutes.length + jobRoutes.length + categoryRoutes.length + locationRoutes.length + blogRoutes.length}`);
