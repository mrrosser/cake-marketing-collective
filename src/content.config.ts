import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const navLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const statSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const siteSettings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/siteSettings' }),
  schema: z.object({
    siteName: z.string(),
    siteTagline: z.string(),
    siteDescription: z.string(),
    primaryCtaLabel: z.string(),
    primaryCtaHref: z.string(),
    secondaryCtaLabel: z.string(),
    secondaryCtaHref: z.string(),
    email: z.email(),
    bookingUrl: z.url(),
    formUrl: z.string().optional().default(''),
    formStatus: z.enum(['pending', 'live']).default('pending'),
    phone: z.string().optional().default(''),
    address: z.string().optional().default(''),
    serviceArea: z.string().optional().default(''),
    splineScenePath: z.string().optional().default(''),
    navigation: z.array(navLinkSchema),
    socialLinks: z.array(navLinkSchema),
    stats: z.array(statSchema),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/home' }),
  schema: z.object({
    heroEyebrow: z.string(),
    heroHeadline: z.string(),
    heroSubheadline: z.string(),
    heroBody: z.string(),
    overviewTitle: z.string(),
    overviewBody: z.string(),
    promises: z.array(z.string()),
    fundingTitle: z.string(),
    fundingBody: z.string(),
    closingTitle: z.string(),
    closingBody: z.string(),
  }),
});

const founder = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/founder' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string(),
    image: z.string(),
    photoCredit: z.string().optional().default(''),
    summary: z.string(),
    philosophy: z.string(),
    signature: z.string(),
    highlights: z.array(z.string()),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    detail: z.string(),
    accent: z.string().default('primary'),
    order: z.number(),
    deliverables: z.array(z.string()),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/caseStudies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    timeframe: z.string(),
    image: z.string(),
    summary: z.string(),
    challenge: z.string(),
    response: z.string(),
    outcome: z.string(),
    order: z.number(),
    metrics: z.array(statSchema),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    company: z.string(),
    draft: z.boolean().default(false),
    order: z.number(),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number(),
  }),
});

const seoDefaults = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/seoDefaults' }),
  schema: z.object({
    titleTemplate: z.string(),
    defaultDescription: z.string(),
    defaultOgImage: z.string(),
    organizationType: z.string(),
    serviceKeywords: z.array(z.string()),
    fallbackKeywords: z.array(z.string()),
  }),
});

export const collections = {
  siteSettings,
  home,
  founder,
  services,
  caseStudies,
  testimonials,
  faqs,
  seoDefaults,
};
