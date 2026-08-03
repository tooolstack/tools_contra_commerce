import type { MetadataRoute } from 'next';
import { TOOLS } from '../lib/tools';
import { getHubUrl, getToolUrl } from '../lib/domain';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: getHubUrl(), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...TOOLS.filter((tool) => tool.ready).map((tool) => ({
      url: getToolUrl(tool.slug),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
