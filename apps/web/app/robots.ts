import type { MetadataRoute } from 'next';
import { getHubUrl } from '../lib/domain';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/courier-settings'] }],
    sitemap: `${getHubUrl()}/sitemap.xml`,
  };
}
