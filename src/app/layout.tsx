import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Free 3PL Valuation Tool — What Is Your 3PL Worth? | Fulfill.com',
  description:
    'Get an instant, data-driven valuation of your third-party logistics (3PL) company. Answer a few questions and receive your estimated enterprise value range, EBITDA multiple, and key valuation factors — free and confidential.',
  metadataBase: new URL('https://www.fulfill.com'),
  alternates: { canonical: '/evaluate' },
  openGraph: {
    title: 'Free 3PL Valuation Tool — What Is Your 3PL Worth? | Fulfill.com',
    description:
      'Get an instant, data-driven valuation of your 3PL company. Answer a few questions and receive your estimated enterprise value range, EBITDA multiple, and key valuation factors.',
    url: '/evaluate',
    siteName: 'Fulfill.com',
    type: 'website',
    images: [
      {
        url: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/63c17da6eb168a7fd6217db0_Banner-Design-Design-1.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free 3PL Valuation Tool | Fulfill.com',
    description:
      'Get an instant, data-driven valuation of your 3PL company. Answer a few questions and receive your estimated valuation.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fulfill.com',
    url: 'https://www.fulfill.com',
    logo: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/636447e01bb9fb0f9cef2a46_fulfill.png',
    sameAs: [
      'https://www.linkedin.com/company/fulfilldotcom/',
      'https://twitter.com/FulfillDotCom',
      'https://www.facebook.com/fulfillcom',
      'https://www.instagram.com/fulfilldotcom/',
      'https://www.youtube.com/@fulfilldotcom',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free 3PL Valuation Tool',
    description:
      'Get an instant, data-driven valuation of your third-party logistics (3PL) company based on real transaction multiples.',
    url: 'https://www.fulfill.com/evaluate',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'Fulfill.com',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Fulfill.com',
        item: 'https://www.fulfill.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'M&A Services',
        item: 'https://www.fulfill.com/m-a',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '3PL Valuation Tool',
        item: 'https://www.fulfill.com/evaluate',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a 3PL valuation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A 3PL valuation estimates the enterprise value of a third-party logistics company based on financial metrics like revenue, EBITDA, growth rate, and industry-specific factors such as client concentration, warehouse capacity, and technology infrastructure.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is EBITDA calculated for a 3PL?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) for a 3PL is calculated by taking total revenue and subtracting operating expenses such as labor, rent, technology costs, and other overhead — excluding interest, taxes, depreciation, and amortization. Typical 3PL EBITDA margins range from 8% to 25%.',
        },
      },
      {
        '@type': 'Question',
        name: 'What EBITDA multiples do 3PLs typically sell for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Third-party logistics companies typically sell for 4x to 12x EBITDA, depending on size, growth rate, client diversification, technology adoption, and market conditions. High-growth 3PLs with strong recurring revenue and diversified client bases command premium multiples.',
        },
      },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inject public env vars at runtime for Webflow Cloud compatibility.
  // Webflow Cloud only provides env vars at runtime, not build time,
  // so NEXT_PUBLIC_* vars won't be inlined into the client bundle.
  const publicEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CALENDAR_URL: process.env.NEXT_PUBLIC_CALENDAR_URL,
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV__=${JSON.stringify(publicEnv)}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteHeader />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 72 }}>
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
