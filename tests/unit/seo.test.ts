import { describe, expect, it } from 'vitest';

import {
  buildArticleSchema,
  buildCanonical,
  buildCaseStudySchema,
  buildCreativeWorkSchema,
  buildFaqSchema,
  buildMarketingAgencySchema,
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

  it('builds marketing agency schema with locality data', () => {
    const schema = buildMarketingAgencySchema({
      siteName: 'Cake Marketing Collective',
      siteDescription: 'Culture-led event strategy.',
      email: 'contact@cakemarketingllc.com',
      bookingUrl: 'https://example.com',
      primaryCity: 'Shreveport',
      primaryState: 'Louisiana',
      serviceArea: 'Shreveport and nationwide',
      socialLinks: [],
    });

    expect(schema['@type']).toBe('MarketingAgency');
    expect((schema.address as Record<string, string>).addressLocality).toBe('Shreveport');
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

  it('builds article schema for insight pages', () => {
    const schema = buildArticleSchema(
      {
        title: 'Integrated Growth',
        category: 'Brand Strategy',
        excerpt: 'How the system works.',
        author: 'Cake Marketing Collective',
        publishDate: '2026-04-05',
      },
      '/insights/integrated-growth',
    );

    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Integrated Growth');
  });

  it('builds case study schema for proof pages', () => {
    const schema = buildCaseStudySchema(
      {
        title: 'LinkFest',
        client: 'Featured Cultural Event',
        sector: 'Experiential Marketing',
        timeframe: '2025 Campaign Cycle',
        summary: 'Lead case study.',
        overview: 'Case study overview.',
        challenge: 'Challenge',
        strategy: 'Strategy',
        execution: 'Execution',
        results: 'Results',
      },
      '/case-studies/linkfest',
    );

    expect(schema['@type']).toBe('CaseStudy');
    expect(schema.name).toBe('LinkFest');
  });

  it('builds creative work schema for work pages', () => {
    const schema = buildCreativeWorkSchema(
      {
        title: 'LinkFest',
        client: 'Featured Cultural Event',
        sector: 'Experiential Marketing',
        timeframe: '2025 Campaign Cycle',
        summary: 'Lead case study.',
        overview: 'Case study overview.',
        challenge: 'Challenge',
        strategy: 'Strategy',
        execution: 'Execution',
        results: 'Results',
      },
      '/work/linkfest',
    );

    expect(schema['@type']).toBe('CreativeWork');
    expect(schema.name).toBe('LinkFest');
  });
});
