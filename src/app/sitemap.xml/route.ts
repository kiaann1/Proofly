import { MetadataRoute } from 'next';

export async function GET(): Promise<Response> {
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: 'https://proofly.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://proofly.com/cv',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://proofly.com/cover-letter',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://proofly.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Blog posts
    {
      url: 'https://proofly.com/blog/ats-resume-optimization-2025',
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://proofly.com/blog/common-resume-mistakes',
      lastModified: new Date('2024-12-15'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://proofly.com/blog/cover-letter-guide-2025',
      lastModified: new Date('2024-12-10'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://proofly.com/blog/interview-preparation-guide',
      lastModified: new Date('2024-12-05'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified instanceof Date ? url.lastModified.toISOString() : url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
