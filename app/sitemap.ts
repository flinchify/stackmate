import type { MetadataRoute } from 'next';

const BLOG_SLUGS = [
  'ai-automation-perth-small-business',
  'why-mining-companies-need-custom-software',
  'best-business-automation-tools-australia-2026',
  'ai-agents-vs-chatbots-whats-the-difference',
  'how-to-choose-a-systems-integrator-perth',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://stackmate.digital';

  const pages = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${base}/process`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/why-us`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/clients`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ];

  const blogPages = BLOG_SLUGS.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const geoPages = [
    { url: `${base}/blog/ai-website-developer-perth`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/blog/business-automation-perth`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/blog/ai-chatbot-perth`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/blog/custom-software-perth`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/blog/seo-perth`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  return [...pages, ...blogPages, ...geoPages];
}
