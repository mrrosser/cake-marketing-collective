import { describe, expect, it } from 'vitest';

import {
  buildCanonical,
  buildFaqSchema,
  buildOrganizationSchema,
  withTitleTemplate,
} from '../../src/lib/seo';

describe('seo helpers', () => {
  it('builds canonical urls against the production domain', () => {
    expect(buildCanonical('/about')).toBe('https://cakemarketingllc.com/about');
  });

  it('applies the title template', () => {
    expect(withTitleTemplate('Services', '%s | Cake Marketing Collective')).toBe(
      'Services | Cake Marketing Collective',
    );
  });

  it('builds organization schema from settings', () => {
    const schema = buildOrganizationSchema({
      siteName: 'Cake Marketing Collective',
      siteDescription: 'Culture-led event strategy.',
      email: 'contact@cakemarketingllc.com',
      bookingUrl: 'https://example.com',
      serviceArea: 'The South',
      socialLinks: [{ label: 'Instagram', url: 'https://instagram.com/cake' }],
    });

    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('Cake Marketing Collective');
  });

  it('builds faq schema from mapped questions', () => {
    const schema = buildFaqSchema([
      {
        question: 'How do we get started?',
        answer: 'Book a discovery call.',
      },
    ]);

    const mainEntity = schema.mainEntity as Array<Record<string, unknown>>;
    expect(mainEntity).toHaveLength(1);
    expect(mainEntity[0].name).toBe('How do we get started?');
  });
});
