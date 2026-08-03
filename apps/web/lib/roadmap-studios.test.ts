import { describe, expect, it } from 'vitest';
import { TOOLS } from './tools';

describe('master roadmap studio registration', () => {
  const expected = [
    'social-media-tools','image-tools','pdf-document-studio','developer-tools','website-seo-tools',
    'calculator-tools','productivity-tools','education-tools','career-job-tools','health-tools',
    'travel-tools','creator-tools','text-utility-tools','home-everyday-tools',
    'professional-message','supplier-message','whatsapp-reply-generator',
  ];
  it.each(expected)('publishes %s as a ready tool', (slug) => {
    expect(TOOLS.find((tool) => tool.slug === slug)).toMatchObject({ slug, ready: true });
  });
});
