import styles from './SiteFooter.module.css';

const BASE = 'https://www.fulfill.com';

const COLUMNS = [
  {
    title: 'For Brands',
    links: [
      { label: 'Find Your 3PL', href: 'https://app.fulfill.com/find-3pl/' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: '3PL Directory', href: '/3pl' },
      { label: 'Case Studies', href: '/results' },
      { label: 'Client Portfolio', href: '/clients' },
      { label: 'Leave A Review', href: '/review' },
    ],
  },
  {
    title: 'For 3PLs',
    links: [
      { label: '3PL Network', href: '/3pl-network' },
      { label: '3PL Pricing', href: '/get-listed' },
      { label: 'Apply to List Your 3PL', href: '/get-listed' },
      { label: 'M&A Services', href: '/m-a' },
      { label: 'Vendor Partners', href: '/partners' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Customers',
    links: [
      { label: 'Turtlebox', href: '/results/turtlebox' },
      { label: 'Project Ratchet', href: '/results/projectratchet' },
      { label: 'FurMe', href: '/results/furme' },
      { label: 'Elm Dirt', href: '/results/elmdirt' },
      { label: 'Kiss My Keto', href: '/results/kissmyketo' },
      { label: 'Shield', href: '/results/shieldsystem' },
    ],
  },
  {
    title: 'Industry Specialties',
    links: [
      { label: 'Apparel 3PL', href: '/3pl/specialty/apparel' },
      { label: 'Food & Beverage 3PL', href: '/3pl/specialty/food-beverage' },
      { label: 'Electronics 3PL', href: '/3pl/specialty/electronics' },
      { label: 'Big & Bulky 3PL', href: '/3pl/specialty/big-bulky-solutions' },
      { label: 'Shopify 3PL', href: '/3pl/specialty/shopify' },
    ],
  },
  {
    title: 'Featured Locations',
    links: [
      { label: 'California 3PL', href: '/3pl/location/california' },
      { label: 'New Jersey 3PL', href: '/3pl/location/new-jersey' },
      { label: 'Texas 3PL', href: '/3pl/location/texas' },
      { label: 'Florida 3PL', href: '/3pl/location/florida' },
      { label: 'Illinois 3PL', href: '/3pl/location/illinois' },
      { label: 'United Kingdom 3PL', href: '/3pl/location/united-kingdom' },
      { label: 'Australia 3PL', href: '/3pl/location/australia' },
      { label: 'Canada 3PL', href: '/3pl/location/canada' },
      { label: 'Mexico 3PL', href: '/3pl/location/mexico' },
    ],
  },
  {
    title: 'Channel Specialties',
    links: [
      { label: 'Omnichannel 3PL', href: '/3pl/specialty/omnichannel' },
      { label: 'B2B (Wholesale) 3PL', href: '/3pl/specialty/b2b-wholesale' },
      { label: 'B2B (Retail) 3PL', href: '/3pl/specialty/b2b-retail' },
      { label: 'DTC 3PL', href: '/3pl/specialty/direct-to-consumer-dtc' },
      { label: 'FBA 3PL', href: '/3pl/specialty/fulfillment-by-amazon-fba' },
      { label: 'Returns Processing 3PL', href: '/3pl/specialty/returns-processing' },
      { label: 'FBM 3PL', href: '/3pl/specialty/fulfillment-by-merchant-fbm' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Dossier', href: '/dossier' },
      { label: 'Logistics Glossary', href: '/glossary' },
      { label: 'What is 3PL', href: '/what-is-3pl' },
      { label: '3PL Pricing Guide', href: '/3pl-pricing' },
      { label: 'Ecommerce Fulfillment Guide', href: '/ecommerce-fulfillment' },
      { label: 'Top 100 US 3PL Companies', href: '/top-3pl-companies' },
      { label: 'Section 321 & Mexico Tariffs', href: '/section-321' },
    ],
  },
];

const SOCIAL_LINKS = [
  { platform: 'LinkedIn', href: 'https://www.linkedin.com/company/fulfilldotcom/', icon: LinkedInIcon },
  { platform: 'X', href: 'https://twitter.com/FulfillDotCom', icon: XIcon },
  { platform: 'Facebook', href: 'https://www.facebook.com/fulfillcom', icon: FacebookIcon },
  { platform: 'Instagram', href: 'https://www.instagram.com/fulfilldotcom/', icon: InstagramIcon },
  { platform: 'YouTube', href: 'https://www.youtube.com/@fulfilldotcom', icon: YouTubeIcon },
];

function resolveHref(href: string) {
  if (href.startsWith('http')) return href;
  return `${BASE}${href}`;
}

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeading}>Find Your Perfect 3PL Match Today</h2>
          <p className={styles.ctaSub}>
            Join thousands of businesses who&apos;ve found their ideal logistics partners through our
            matchmaking service. Let us simplify your search.
          </p>
          <a href="https://app.fulfill.com/find-3pl/" className={styles.ctaBtn}>
            Get Matched With Top 3PLs
          </a>
        </div>
      </div>

      {/* Link Columns */}
      <div className={styles.columnsWrap}>
        <div className={styles.columns}>
          {COLUMNS.map((col) => (
            <div key={col.title} className={styles.column}>
              <h3 className={styles.columnTitle}>{col.title}</h3>
              <ul className={styles.columnList}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={resolveHref(link.href)} className={styles.columnLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <div className={styles.bottomLeft}>
            <a href={BASE} className={styles.footerLogo}>
              <img
                src="https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/68874b6d991f1e2d7db480aa_Group%202%20Fulfill%20Figma.avif"
                alt="Fulfill.com"
                width={140}
                height={40}
              />
            </a>
            <p className={styles.tagline}>Fulfillment without Friction</p>
            <p className={styles.address}>
              1620 E Riverside Dr, Suite 61204, Austin, TX 78741
            </p>
          </div>

          <div className={styles.bottomRight}>
            <div className={styles.socialLinks}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  className={styles.socialIcon}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Fulfill.com. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href={`${BASE}/privacy-policy`}>Privacy Policy</a>
            <a href={`${BASE}/terms-and-conditions`}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Social SVG Icons ── */

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
