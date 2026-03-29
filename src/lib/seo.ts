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
}

export interface FaqData {
  question: string;
  answer: string;
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
    areaServed: settings.serviceArea,
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
