const SITE_URL = 'https://cakemarketingllc.com';

export interface NavLink {
  label: string;
  url: string;
}

export interface SiteSettingsData {
  siteName: string;
  siteDescription: string;
  email: string;
  bookingUrl: string;
  primaryCity?: string;
  primaryState?: string;
  serviceArea?: string;
  socialLinks: NavLink[];
}

export interface FounderData {
  name: string;
  title: string;
  location: string;
  summary: string;
  image: string;
}

export interface ServiceData {
  title: string;
  summary: string;
  detail: string;
  slug: string;
  internalLinks?: string[];
}

export interface FaqData {
  question: string;
  answer: string;
}

export interface CaseStudyData {
  title: string;
  client: string;
  sector: string;
  timeframe: string;
  summary: string;
  overview: string;
  challenge: string;
  strategy: string;
  execution: string;
  results: string;
  relatedServices?: string[];
}

export interface ArticleData {
  title: string;
  category: string;
  excerpt: string;
  author: string;
  publishDate: string;
}

export function buildCanonical(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export function withTitleTemplate(title: string, template: string): string {
  return template.replace('%s', title);
}

export function buildOrganizationSchema(settings: SiteSettingsData): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    description: settings.siteDescription,
    url: SITE_URL,
    email: settings.email,
    sameAs: settings.socialLinks.map((link) => link.url),
  };
}

export function buildMarketingAgencySchema(settings: SiteSettingsData): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'MarketingAgency',
    name: settings.siteName,
    url: SITE_URL,
    logo: buildCanonical('/images/cake-marketing-logo.png'),
    email: settings.email,
    areaServed: settings.serviceArea,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.primaryCity,
      addressRegion: settings.primaryState,
      addressCountry: 'US',
    },
  };
}

export function buildPersonSchema(founder: FounderData): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: founder.name,
    jobTitle: founder.title,
    description: founder.summary,
    image: buildCanonical(founder.image),
    homeLocation: founder.location,
  };
}

export function buildProfessionalServiceSchema(
  settings: SiteSettingsData,
  services: ServiceData[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings.siteName,
    url: SITE_URL,
    areaServed: settings.serviceArea || settings.primaryCity,
    email: settings.email,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cake Marketing Collective Services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
        },
      })),
    },
  };
}

export function buildFaqSchema(faqs: FaqData[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleSchema(
  article: ArticleData,
  pathname: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    articleSection: article.category,
    description: article.excerpt,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cake Marketing Collective',
      url: SITE_URL,
    },
    datePublished: article.publishDate,
    mainEntityOfPage: buildCanonical(pathname),
  };
}

export function buildCaseStudySchema(
  caseStudy: CaseStudyData,
  pathname: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CaseStudy',
    name: caseStudy.title,
    headline: caseStudy.title,
    about: caseStudy.sector,
    creator: {
      '@type': 'Organization',
      name: 'Cake Marketing Collective',
      url: SITE_URL,
    },
    description: caseStudy.summary,
    abstract: caseStudy.overview,
    keywords: [caseStudy.client, caseStudy.sector, caseStudy.timeframe],
    mainEntityOfPage: buildCanonical(pathname),
  };
}

export function buildCreativeWorkSchema(
  caseStudy: CaseStudyData,
  pathname: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseStudy.title,
    headline: caseStudy.title,
    description: caseStudy.summary,
    abstract: caseStudy.overview,
    creator: {
      '@type': 'Organization',
      name: 'Cake Marketing Collective',
      url: SITE_URL,
    },
    about: caseStudy.sector,
    mainEntityOfPage: buildCanonical(pathname),
  };
}
