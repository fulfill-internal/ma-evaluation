'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './SiteHeader.module.css';

const BASE = 'https://www.fulfill.com';

const CASE_STUDIES = [
  { label: 'Turtlebox', href: '/results/turtlebox', img: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/6887630117f8c9b4b215436c_Turtlebox%20Logo.png' },
  { label: 'Kiss My Keto', href: '/results/kissmyketo', img: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/6887634ae955a45136ffe85a_BX%20Internal%20Logo.avif' },
  { label: 'Elm Dirt', href: '/results/elmdirt', img: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/68876348d9bdf7647c278aac_Elm%20Dirt%20Logo.png' },
  { label: 'Shield', href: '/results/shieldsystem', img: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/688763016e5d4e5cf9ed4c7e_Shield%20Logo%201%20from%20Figma.png' },
  { label: 'FurMe', href: '/results/furme', img: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/688763487d473a3cf18fa2b7_FurMe%20Logo.png' },
  { label: 'Project Ratchet', href: '/results/projectratchet', img: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/688763013a01e12d87b867d6_Project%20Ratchet%20White%20Logo.png' },
];

const RESOURCES_LEFT = [
  { label: 'Blog', desc: 'Latest insights and industry news', href: '/blog' },
  { label: 'Logistics Glossary', desc: 'Essential logistics terms explained', href: '/glossary' },
  { label: 'Contact Us', desc: 'Get in touch with our team', href: '/contact' },
];

const RESOURCES_RIGHT = [
  { label: 'What is a 3PL', href: '/what-is-3pl' },
  { label: '3PL Pricing Ultimate Guide', href: '/3pl-pricing' },
  { label: 'Ecommerce Fulfillment Guide', href: '/ecommerce-fulfillment' },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 960) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openDropdown = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <a href={BASE} className={styles.logo}>
          <img
            src="https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/636447e01bb9fb0f9cef2a46_fulfill.png"
            alt="Fulfill.com"
            width={130}
            height={32}
          />
        </a>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          <a href={`${BASE}/how-it-works`} className={styles.navLink}>
            How It Works
          </a>

          {/* Case Studies Dropdown */}
          <div
            className={styles.navItem}
            onMouseEnter={() => openDropdown('cases')}
            onMouseLeave={closeDropdown}
          >
            <button className={styles.navLink} type="button">
              Case Studies
              <ChevronDown />
            </button>
            {activeDropdown === 'cases' && (
              <div className={styles.dropdown}>
                <div className={styles.caseGrid}>
                  {CASE_STUDIES.map((c) => (
                    <a key={c.label} href={`${BASE}${c.href}`} className={styles.caseItem}>
                      <img src={c.img} alt={c.label} className={styles.caseLogo} />
                    </a>
                  ))}
                </div>
                <div className={styles.caseBottom}>
                  <a href={`${BASE}/results`} className={styles.caseLink}>
                    View All Case Studies <ArrowRight />
                  </a>
                  <a href={`${BASE}/clients`} className={styles.caseLink}>
                    View Client Portfolio <ArrowRight />
                  </a>
                </div>
              </div>
            )}
          </div>

          <a href={`${BASE}/3pl`} className={styles.navLink}>
            3PL Directory
          </a>

          {/* Resources Dropdown */}
          <div
            className={styles.navItem}
            onMouseEnter={() => openDropdown('resources')}
            onMouseLeave={closeDropdown}
          >
            <button className={styles.navLink} type="button">
              Resources
              <ChevronDown />
            </button>
            {activeDropdown === 'resources' && (
              <div className={`${styles.dropdown} ${styles.resourcesDropdown}`}>
                <div className={styles.resourcesCols}>
                  <div className={styles.resourcesLeft}>
                    {RESOURCES_LEFT.map((r) => (
                      <a key={r.label} href={`${BASE}${r.href}`} className={styles.resourceItem}>
                        <span className={styles.resourceLabel}>{r.label}</span>
                        <span className={styles.resourceDesc}>{r.desc}</span>
                      </a>
                    ))}
                  </div>
                  <div className={styles.resourcesRight}>
                    <span className={styles.resourcesRightTitle}>Popular</span>
                    {RESOURCES_RIGHT.map((r) => (
                      <a key={r.label} href={`${BASE}${r.href}`} className={styles.resourceLink}>
                        {r.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <a href={`${BASE}/about-us`} className={styles.navLink}>
            About Us
          </a>
        </nav>

        {/* CTA buttons */}
        <div className={styles.ctas}>
          <a href={`${BASE}/get-listed`} className={styles.ctaText}>
            List Your 3PL
          </a>
          <a href="https://app.fulfill.com/find-3pl/" className={styles.ctaButton}>
            Find Your 3PL
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <a href={`${BASE}/how-it-works`} className={styles.mobileLink}>How It Works</a>
          <a href={`${BASE}/results`} className={styles.mobileLink}>Case Studies</a>
          <a href={`${BASE}/3pl`} className={styles.mobileLink}>3PL Directory</a>
          <a href={`${BASE}/blog`} className={styles.mobileLink}>Blog</a>
          <a href={`${BASE}/glossary`} className={styles.mobileLink}>Logistics Glossary</a>
          <a href={`${BASE}/contact`} className={styles.mobileLink}>Contact Us</a>
          <a href={`${BASE}/about-us`} className={styles.mobileLink}>About Us</a>
          <hr className={styles.mobileDivider} />
          <a href={`${BASE}/get-listed`} className={styles.mobileLink}>List Your 3PL</a>
          <a href="https://app.fulfill.com/find-3pl/" className={styles.mobileCta}>
            Find Your 3PL
          </a>
        </div>
      )}
    </header>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 4 }}>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 4 }}>
      <path d="M1 7h12M9 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
