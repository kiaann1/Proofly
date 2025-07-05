export async function GET(): Promise<Response> {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://proofly.com/sitemap.xml

# Block specific paths if needed
# Disallow: /admin/
# Disallow: /api/

# Crawl-delay (optional, in seconds)
Crawl-delay: 1

# Host preference
Host: https://proofly.com`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
